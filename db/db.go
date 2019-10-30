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

	db, err := gorm.Open(viper.GetString("db.schema"), viper.GetString("db.url"))
	if err != nil {
		fmt.Println("Error connecting to db:", err)
		panic(err)
	}

	log.Println("Creating tables if necessary...")
	db.AutoMigrate(&structs.UserCreds{})

	db.AutoMigrate(&structs.UserAccount{})

	return db
}
