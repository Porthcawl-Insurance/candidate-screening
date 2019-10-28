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
	recordNotFound := database.Where("Id = ?", userId).First(userAccount).RecordNotFound()
	if recordNotFound {
		fmt.Fprintf(w, "No record found for user account %s", userId)
		return
	}

	resp := utils.SendApiRequest(userAccount.Zip)
	defer resp.Body.Close()

	respString := utils.ParseApiResponse(resp)
	fmt.Fprintf(w, "%s, for user account %s",
		respString, string(userId))
}
