package db

import (
	"fmt"
	"log"

	"github.com/cyberfortress/candidate-screening/structs"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"

	"github.com/spf13/viper"
)

func ConnectDB() *gorm.DB {
	log.Println("Initializing database connection")
	viper.SetConfigName("configuration")
	viper.AddConfigPath("$HOME/go/src/github.com/cyberfortress/candidate-screening")
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

	log.Println("Creating tables if necessary...")
	db.AutoMigrate(&structs.UserCreds{})

	db.AutoMigrate(&structs.UserAccount{})

	return db
}
