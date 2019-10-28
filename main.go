package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/cyberfortress/candidate-screening/auth"
	"github.com/cyberfortress/candidate-screening/controllers"

	"github.com/gorilla/mux"
)

func home(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Health check OK")
}

func main() {
	log.Println("Beginning weather api service")

	router := mux.NewRouter().StrictSlash(true)

	router.Use(CommonMiddleware)

	router.HandleFunc("/", home)
	router.HandleFunc("/register", controllers.CreateUser).Methods("POST")
	router.HandleFunc("/login", controllers.Login).Methods("POST")

	s := router.PathPrefix("/auth").Subrouter()
	s.Use(auth.JwtVerify)
	s.HandleFunc("/update", controllers.UpdateUserAccount).Methods("POST")
	s.HandleFunc("/weather", controllers.MyWeather).Methods("GET")

	a := router.PathPrefix("/admin").Subrouter()
	a.Use(auth.JwtVerifyAdmin)
	a.HandleFunc("/users", controllers.GetAllUsers).Methods("GET")
	a.HandleFunc("/userWeather/{id}", controllers.GetUserWeather).Methods("GET")
	log.Println("Router set")
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
