package db

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

func GetZipCodeByFirstAndLastName(firstName string, lastName string) (zip int) {
	database, err := sql.Open("sqlite3", "weather.db")
	if err != nil {
		log.Println("Error opening the database:", err)
	}
	defer database.Close()

	sqlText := fmt.Sprintf("SELECT zip FROM People WHERE first_name = '%s' and last_name = '%s'", firstName, lastName)

	row := database.QueryRow(sqlText)
	err = row.Scan(&zip)
	if err != nil {
		log.Println("User not found in db:", firstName, lastName)
	}
	return
}
