package controllers

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/cyberfortress/candidate-screening/utils"
	"github.com/gorilla/mux"
)

var dummyApiResponse = `{
  "coord": {"lon": -122.08,"lat": 37.39},
  "weather": [
    {
      "id": 800,
      "main": "Clear",
      "description": "clear sky",
      "icon": "01d"
    }
  ],
  "base": "stations",
  "main": {
    "temp": 296.71,
    "pressure": 1013,
    "humidity": 53,
    "temp_min": 294.82,
    "temp_max": 298.71
  },
  "visibility": 16093,
  "wind": {
    "speed": 1.5,
    "deg": 350
  },
  "clouds": {
    "all": 1
  },
  "dt": 1560350645,
  "sys": {
    "type": 1,
    "id": 5122,
    "message": 0.0139,
    "country": "US",
    "sunrise": 1560343627,
    "sunset": 1560396563
  },
  "timezone": -25200,
  "id": 420006353,
  "name": "Mountain View",
  "cod": 200
}`

func mockSendApiRequest(zip int) *http.Response {
	r := http.Response{
		StatusCode: 200,
		Body:       ioutil.NopCloser(bytes.NewBufferString(dummyApiResponse)),
	}
	return &r
}
func mockSendApiRequestBadResponse(zip int) *http.Response {
	r := http.Response{
		StatusCode: 401,
		Body:       ioutil.NopCloser(bytes.NewBufferString(dummyApiResponse)),
	}
	return &r
}

func TestGetUserWeather_pass(t *testing.T) {
	req := httptest.NewRequest("GET", "/admin/userWeather/1", nil)
	rr := httptest.NewRecorder()

	dummyAdminServerWithSetApi().ServeHTTP(rr, req)

	resp := rr.Result()

	body, _ := ioutil.ReadAll(resp.Body)

	expectedRespString := "Right now, it is NOT raining for user account 1"

	if string(body) != expectedRespString {
		t.Errorf("got %s, expected %s", body, expectedRespString)
	}

}

func TestGetUserWeather_fail_NoUser(t *testing.T) {
	req := httptest.NewRequest("GET", "/admin/userWeather/9999", nil)
	rr := httptest.NewRecorder()

	dummyAdminServer().ServeHTTP(rr, req)

	resp := rr.Result()

	body, _ := ioutil.ReadAll(resp.Body)

	expectedRespString := "No record found for user account 9999"

	if string(body) != expectedRespString {
		t.Errorf("got %s, expected %s", body, expectedRespString)
	}
}

func TestGetUserWeather_fail_NoApi(t *testing.T) {
	req := httptest.NewRequest("GET", "/admin/userWeather/9999", nil)
	rr := httptest.NewRecorder()

	dummyAdminServerWithBadApi().ServeHTTP(rr, req)

	resp := rr.Result()

	body, _ := ioutil.ReadAll(resp.Body)

	expectedRespString := "Error connecting to the weather API service, please try again later for user account 9999"

	if string(body) != expectedRespString {
		t.Errorf("got %s, expected %s", body, expectedRespString)
	}
}

func dummyAdminServer() http.Handler {
	r := mux.NewRouter()
	r.HandleFunc("/admin/userWeather/{id}", GetUserWeather)
	return r
}

func dummyAdminServerWithSetApi() http.Handler {
	r := mux.NewRouter()
	r.HandleFunc("/admin/userWeather/{id}", func(w http.ResponseWriter, r *http.Request) {
		userId := mux.Vars(r)["id"]
		rh := utils.NewRequestHandler(mockSendApiRequest, utils.ParseApiResponse)

		resp := rh.SendApiRequest(1)
		defer resp.Body.Close()

		respString := rh.ParseApiResponse(resp)
		fmt.Fprintf(w, "%s for user account %s",
			respString, string(userId))
	})
	return r
}

func dummyAdminServerWithBadApi() http.Handler {
	r := mux.NewRouter()
	r.HandleFunc("/admin/userWeather/{id}", func(w http.ResponseWriter, r *http.Request) {
		userId := mux.Vars(r)["id"]
		rh := utils.NewRequestHandler(mockSendApiRequestBadResponse, utils.ParseApiResponse)

		resp := rh.SendApiRequest(1)
		defer resp.Body.Close()

		respString := rh.ParseApiResponse(resp)
		fmt.Fprintf(w, "%s for user account %s",
			respString, string(userId))
	})
	return r
}
