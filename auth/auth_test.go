package auth

import (
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/cyberfortress/candidate-screening/structs"
	"github.com/dgrijalva/jwt-go"
)

func GetTestHandler() http.HandlerFunc {
	fn := func(r http.ResponseWriter, req *http.Request) {
		return
	}
	return http.HandlerFunc(fn)
}

func TestJwtVerify_pass(t *testing.T) {
	testServer := httptest.NewServer(JwtVerify(GetTestHandler()))
	defer testServer.Close()

	client := &http.Client{}
	req, _ := http.NewRequest("GET", string(testServer.URL)+"/auth/weather", nil)

	expiresAt := time.Now().Add(time.Minute * 10).Unix()
	tk := &structs.Token{
		UserID: 0,
		Email:  "foo",
		Role:   "bar",
		StandardClaims: &jwt.StandardClaims{
			ExpiresAt: expiresAt,
		},
	}

	token := jwt.NewWithClaims(jwt.GetSigningMethod("HS256"), tk)
	tokenString, _ := token.SignedString([]byte("secret"))

	req.Header.Set("Authorization", "Bearer "+tokenString)

	resp, err := client.Do(req)
	if err != nil {
		panic("error testing token: " + err.Error())
	}

	if resp.StatusCode != 200 {
		t.Errorf("got %d, expected 200", resp.StatusCode)
	}
}

func TestJwtVerify_fail_NoToken(t *testing.T) {
	testServer := httptest.NewServer(JwtVerify(GetTestHandler()))
	defer testServer.Close()
	client := &http.Client{}
	req, _ := http.NewRequest("GET", string(testServer.URL)+"/auth/weather", nil)
	resp, err := client.Do(req)

	if err != nil {
		panic("error testing token")
	}

	r, err := ioutil.ReadAll(resp.Body)
	respString := string(r)

	expectedRespString := "{\"message\":\"Missing auth token\"}\n"

	if respString != expectedRespString {
		t.Errorf("got %s, expected %s", respString, expectedRespString)
	}
}

func TestJwtVerify_fail_BadToken(t *testing.T) {
	testServer := httptest.NewServer(JwtVerify(GetTestHandler()))
	defer testServer.Close()

	client := &http.Client{}
	req, _ := http.NewRequest("GET", string(testServer.URL)+"/auth/weather", nil)

	expiresAt := time.Now().Add(time.Minute * 10).Unix()
	tk := &structs.Token{
		UserID: 0,
		Email:  "foo",
		Role:   "bar",
		StandardClaims: &jwt.StandardClaims{
			ExpiresAt: expiresAt,
		},
	}

	token := jwt.NewWithClaims(jwt.GetSigningMethod("HS256"), tk)
	tokenString, _ := token.SignedString([]byte("wrong"))

	req.Header.Set("Authorization", "Bearer "+tokenString)

	resp, err := client.Do(req)
	if err != nil {
		panic("error testing token: " + err.Error())
	}

	r, err := ioutil.ReadAll(resp.Body)
	respString := string(r)

	expectedRespString := "{\"message\":\"signature is invalid\"}\n"

	if respString != expectedRespString {
		t.Errorf("got %s, expected %s", respString, expectedRespString)
	}
}

func TestJwtVerifyAdmin_pass(t *testing.T) {
	testServer := httptest.NewServer(JwtVerifyAdmin(GetTestHandler()))
	defer testServer.Close()

	client := &http.Client{}
	req, _ := http.NewRequest("GET", string(testServer.URL)+"/admin/users", nil)

	expiresAt := time.Now().Add(time.Minute * 10).Unix()
	tk := &structs.Token{
		UserID: 0,
		Email:  "foo",
		Role:   "admin",
		StandardClaims: &jwt.StandardClaims{
			ExpiresAt: expiresAt,
		},
	}

	token := jwt.NewWithClaims(jwt.GetSigningMethod("HS256"), tk)
	tokenString, _ := token.SignedString([]byte("secret"))

	req.Header.Set("Authorization", "Bearer "+tokenString)

	resp, err := client.Do(req)
	if err != nil {
		panic("error testing token: " + err.Error())
	}

	if resp.StatusCode != 200 {
		t.Errorf("got %d, expected 200", resp.StatusCode)
	}
}

func TestJwtVerifyAdmin_fail_NoToken(t *testing.T) {
	testServer := httptest.NewServer(JwtVerifyAdmin(GetTestHandler()))
	defer testServer.Close()

	client := &http.Client{}
	req, _ := http.NewRequest("GET", string(testServer.URL)+"/admin/users", nil)
	resp, err := client.Do(req)
	if err != nil {
		panic("error testing token: " + err.Error())
	}
	r, err := ioutil.ReadAll(resp.Body)
	respString := string(r)

	expectedRespString := "{\"message\":\"Missing auth token\"}\n"

	if respString != expectedRespString {
		t.Errorf("got %s, expected %s", respString, expectedRespString)
	}
}
func TestJwtVerifyAdmin_fail_BasicToken(t *testing.T) {
	testServer := httptest.NewServer(JwtVerifyAdmin(GetTestHandler()))
	defer testServer.Close()

	client := &http.Client{}
	req, _ := http.NewRequest("GET", string(testServer.URL)+"/admin/users", nil)

	expiresAt := time.Now().Add(time.Minute * 10).Unix()
	tk := &structs.Token{
		UserID: 0,
		Email:  "foo",
		Role:   "basic",
		StandardClaims: &jwt.StandardClaims{
			ExpiresAt: expiresAt,
		},
	}

	token := jwt.NewWithClaims(jwt.GetSigningMethod("HS256"), tk)
	tokenString, _ := token.SignedString([]byte("secret"))

	req.Header.Set("Authorization", "Bearer "+tokenString)

	resp, err := client.Do(req)
	if err != nil {
		panic("error testing token: " + err.Error())
	}
	r, err := ioutil.ReadAll(resp.Body)
	respString := string(r)

	expectedRespString := "{\"message\":\"You are not allowed to be here.\"}\n"

	if respString != expectedRespString {
		t.Errorf("got %s, expected %s", respString, expectedRespString)
	}
}
