package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/Duke9289/candidate-screening/db"
	"github.com/Duke9289/candidate-screening/structs"
	"github.com/Duke9289/candidate-screening/utils"
	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
)

type ErrorResponse struct {
	Err string
}

type error interface {
	Error() string
}

var database = db.ConnectDB()

func CreateUser(w http.ResponseWriter, r *http.Request) {
	user := &structs.UserCreds{}
	json.NewDecoder(r.Body).Decode(user)

	pass, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Println(err)
		err := ErrorResponse{
			Err: "Password Encryption  failed",
		}
		json.NewEncoder(w).Encode(err)
	}

	user.Password = string(pass)
	user.Role = "basic"

	createdUser := database.Create(user)
	var errMessage = createdUser.Error

	if createdUser.Error != nil {
		fmt.Println(errMessage)
	}
	json.NewEncoder(w).Encode(createdUser)
}

func MyWeather(w http.ResponseWriter, r *http.Request) {
	token := r.Context().Value("user").(*structs.Token)
	userAccount := &structs.UserAccount{}
	email := token.Email
	database.Where("Email = ?", email).First(userAccount)

	resp := utils.SendApiRequest(userAccount.Zip)
	defer resp.Body.Close()

	main, detail := utils.ParseApiResponse(resp)
	fmt.Fprintf(w, "Right now, the weather is %s, specifically, %s",
		main, detail)

}

func Login(w http.ResponseWriter, r *http.Request) {
	userCreds := &structs.UserCreds{}
	err := json.NewDecoder(r.Body).Decode(userCreds)
	if err != nil {
		var resp = map[string]interface{}{"status": false, "message": "Invalid request"}
		json.NewEncoder(w).Encode(resp)
		return
	}
	resp := FindOne(userCreds.Email, userCreds.Password)
	json.NewEncoder(w).Encode(resp)
}

func FindOne(email, password string) map[string]interface{} {
	user := &structs.UserCreds{}

	if err := database.Where("Email = ?", email).First(user).Error; err != nil {
		var resp = map[string]interface{}{"status": false, "message": "Email address not found"}
		return resp
	}
	expiresAt := time.Now().Add(time.Minute * 100000).Unix()

	errf := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if errf != nil && errf == bcrypt.ErrMismatchedHashAndPassword { //Password does not match!
		var resp = map[string]interface{}{"status": false, "message": "Invalid login credentials. Please try again"}
		return resp
	}

	tk := &structs.Token{
		UserID: user.ID,
		Email:  user.Email,
		Role:   user.Role,
		StandardClaims: &jwt.StandardClaims{
			ExpiresAt: expiresAt,
		},
	}

	token := jwt.NewWithClaims(jwt.GetSigningMethod("HS256"), tk)

	tokenString, error := token.SignedString([]byte("secret"))
	if error != nil {
		fmt.Println(error)
	}

	var resp = map[string]interface{}{"status": false, "message": "logged in"}
	resp["token"] = tokenString //Store the token in the response
	resp["user"] = user
	return resp
}
