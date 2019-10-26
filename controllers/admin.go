package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/cyberfortress/candidate-screening/structs"
	"github.com/cyberfortress/candidate-screening/utils"
	"github.com/gorilla/mux"
)

func GetAllUsers(w http.ResponseWriter, r *http.Request) {
	log.Println("Admin request for user list")
	var users []structs.UserAccount
	database.Find(&users)

	json.NewEncoder(w).Encode(users)
}

func GetUserWeather(w http.ResponseWriter, r *http.Request) {
	userId := mux.Vars(r)["id"]
	log.Println("Admin requst for weather for user id: ", userId)
	userAccount := &structs.UserAccount{}
	database.Where("Id = ?", userId).First(userAccount)
	resp := utils.SendApiRequest(userAccount.Zip)
	defer resp.Body.Close()

	main, detail := utils.ParseApiResponse(resp)
	fmt.Fprintf(w, "Right now, the weather is %s, specifically %s, for user account %s",
		main, detail, string(userId))
}
