package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/Duke9289/candidate-screening/structs"
	"github.com/Duke9289/candidate-screening/utils"
	"github.com/gorilla/mux"
)

func GetAllUsers(w http.ResponseWriter, r *http.Request) {
	var users []structs.UserAccount
	database.Find(&users)

	json.NewEncoder(w).Encode(users)
}

func GetUserWeather(w http.ResponseWriter, r *http.Request) {
	userId := mux.Vars(r)["id"]
	userAccount := &structs.UserAccount{}
	database.Where("Id = ?", userId).First(userAccount)
	resp := utils.SendApiRequest(userAccount.Zip)
	defer resp.Body.Close()

	main, detail := utils.ParseApiResponse(resp)
	fmt.Fprintf(w, "Right now, the weather is %s, specifically %s, for user account %s",
		main, detail, string(userId))
}
