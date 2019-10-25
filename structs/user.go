package structs

import "github.com/jinzhu/gorm"

type UserCreds struct {
	gorm.Model
	Email    string `gorm:"type:varchar(100);unique_index"`
	Password string `json:"Password"`
}

type UserAccount struct {
	gorm.Model
	Address    string
	City       string
	State      string
	Zip        int
	Email      string
	First_name string
	Last_name  string
}
