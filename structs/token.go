package structs

import jwt "github.com/dgrijalva/jwt-go"

type Token struct {
	UserID uint
	Email  string
	Role   string
	*jwt.StandardClaims
}
