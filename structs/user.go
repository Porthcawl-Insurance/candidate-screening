package structs

import "github.com/jinzhu/gorm"

type UserCreds struct {
	gorm.Model
	Email    string `gorm:"type:varchar(100);unique_index"`
	Password string `json:"Password"`
	Role     string `json:"Role"`
}

type UserAccount struct {
	gorm.Model
	Address    string `json:"Address"`
	City       string `json:"City"`
	State      string `json:"State"`
	Zip        int    `json:"Zip"`
	Email      string `json:"Email"`
	First_name string `json:"FirstName"`
	Last_name  string `json:"LastName"`
}
