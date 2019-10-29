package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/cyberfortress/candidate-screening/db"
	"github.com/cyberfortress/candidate-screening/structs"
	"github.com/cyberfortress/candidate-screening/utils"
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

	log.Println("Creating new user")

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
		log.Println(errMessage)
	}
	log.Println("Successfully created user")
	fmt.Fprint(w, "User successfully created, you may now log in")
}

func UpdateUserAccount(w http.ResponseWriter, r *http.Request) {
	log.Println("Updating user account")
	userAccount := &structs.UserAccount{}
	json.NewDecoder(r.Body).Decode(userAccount)
	token := r.Context().Value("user").(*structs.Token)
	userAccount.ID = token.UserID
	userAccount.Email = token.Email
	savedUser := database.Save(userAccount)

	if savedUser.Error != nil {
		log.Println(savedUser.Error)
	}
	log.Println("User account updated")
	json.NewEncoder(w).Encode(savedUser)
}

func MyWeather(w http.ResponseWriter, r *http.Request) {
	token := r.Context().Value("user").(*structs.Token)
	userAccount := &structs.UserAccount{}
	log.Println("Getting weather request for user id: ", token.UserID)

	email := token.Email
	database.Where("Email = ?", email).First(userAccount)

	rh := utils.NewRequestHandler(utils.SendApiRequest, utils.ParseApiResponse)

	resp := rh.SendApiRequest(userAccount.Zip)
	defer resp.Body.Close()

	respString := rh.ParseApiResponse(resp)
	fmt.Fprint(w, respString)

}

func Login(w http.ResponseWriter, r *http.Request) {
	userCreds := &structs.UserCreds{}
	err := json.NewDecoder(r.Body).Decode(userCreds)

	log.Println("Login request for email: ", userCreds.Email)
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
	if errf != nil && errf == bcrypt.ErrMismatchedHashAndPassword {
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
	resp["token"] = tokenString
	resp["user"] = user
	return resp
}
