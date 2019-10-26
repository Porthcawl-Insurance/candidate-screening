package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/Duke9289/candidate-screening/auth"
	"github.com/Duke9289/candidate-screening/controllers"
	"github.com/spf13/viper"

	"github.com/gorilla/mux"
)

func home(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Send a request to /person?email=[EMAIL]")
}

func main() {

	viper.SetConfigName("configuration")
	viper.AddConfigPath(".")
	err := viper.ReadInConfig()
	if err != nil {
		panic(fmt.Errorf("fatal error config file: %s \n", err))
	}

	router := mux.NewRouter().StrictSlash(true)

	router.Use(CommonMiddleware)

	router.HandleFunc("/", home)
	router.HandleFunc("/register", controllers.CreateUser).Methods("POST")
	router.HandleFunc("/login", controllers.Login).Methods("POST")

	s := router.PathPrefix("/auth").Subrouter()
	s.Use(auth.JwtVerify)
	s.HandleFunc("/person", controllers.MyWeather).Methods("GET")

	a := router.PathPrefix("/admin").Subrouter()
	a.Use(auth.JwtVerifyAdmin)
	a.HandleFunc("/users", controllers.GetAllUsers).Methods("GET")
	a.HandleFunc("/userWeather/{id}", controllers.GetUserWeather).Methods("GET")
	log.Fatal(http.ListenAndServe(":8080", router))
}

func CommonMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, Access-Control-Request-Headers, Access-Control-Request-Method, Connection, Host, Origin, User-Agent, Referer, Cache-Control, X-header")
		next.ServeHTTP(w, r)
	})
}
