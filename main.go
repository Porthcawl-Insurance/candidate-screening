package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/Duke9289/candidate-screening/db"
	"github.com/spf13/viper"

	"github.com/gorilla/mux"
)

func homeLink(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Send a request to /person?firstName=[FIRSTNAME]&lastName=[LASTNAME]")
}

func personLink(w http.ResponseWriter, r *http.Request) {
	firstName := mux.Vars(r)["firstName"]
	lastName := mux.Vars(r)["lastName"]

	zip := db.GetZipCodeByFirstAndLastName(firstName, lastName)
	log.Println("returned zip:", zip)
	apiUrl := viper.GetString("api.url")
	apiKey := viper.GetString("api.appid")
	url := fmt.Sprintf("%szip=%d&appid=%s", apiUrl, zip, apiKey)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Fatal("NewRequest:", err)
		return
	}

	client := &http.Client{}

	resp, err := client.Do(req)
	if err != nil {
		log.Fatal("Do:", err)
		return
	}
	defer resp.Body.Close()
	resp.Write(w)

}

func main() {

	viper.SetConfigName("configuration")
	viper.AddConfigPath(".")
	err := viper.ReadInConfig()
	if err != nil {
		panic(fmt.Errorf("fatal error config file: %s \n", err))
	}
	router := mux.NewRouter().StrictSlash(true)

	router.HandleFunc("/", homeLink)
	router.HandleFunc("/person", personLink).Methods("GET").Queries("firstName", "{firstName}", "lastName", "{lastName}")
	log.Fatal(http.ListenAndServe(":8080", router))
}
