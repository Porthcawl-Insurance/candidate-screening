package db

import (
	"fmt"

	"github.com/Duke9289/candidate-screening/structs"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"

	"github.com/spf13/viper"
)

//func GetZipCodeByFirstAndLastName(email string) (zip int) {
//	database, err := sql.Open(viper.GetString("db.schema"), viper.GetString("db.url"))
//	if err != nil {
//		log.Println("Error opening the database:", err)
//	}
//	defer database.Close()
//
//	sqlText := fmt.Sprintf("SELECT zip FROM user_information WHERE email = '%s'", email)
//
//	row := database.QueryRow(sqlText)
//	err = row.Scan(&zip)
//	if err != nil {
//		log.Println("User not found in db:", email)
//	}
//	return
//}

func ConnectDB() *gorm.DB {
	viper.SetConfigName("configuration")
	viper.AddConfigPath(".")
	err := viper.ReadInConfig()
	if err != nil {
		panic(fmt.Errorf("fatal error config file: %s \n", err))
	}
	username := viper.Get("db.user")
	password := viper.Get("db.password")
	databasePort := viper.Get("db.port")
	databaseName := viper.Get("db.name")
	databaseHost := viper.Get("db.url")

	dbURI := fmt.Sprintf("host=%s port=%s user=%s dbname=%s sslmode=disable password=%s", databaseHost, databasePort, username, databaseName, password)

	db, err := gorm.Open(viper.GetString("db.schema"), dbURI)
	if err != nil {
		fmt.Println("Error connecting to db:", err)
		panic(err)
	}

	db.AutoMigrate(&structs.UserCreds{})

	db.AutoMigrate(&structs.UserAccount{})

	return db
}
