package utils

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"net/http"
	"testing"

	"github.com/spf13/viper"
)

var dummyResponse = `{
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

func TestSendApiRequest_pass(t *testing.T) {
	viper.SetConfigName("configuration")
	viper.AddConfigPath("..")
	err := viper.ReadInConfig()
	if err != nil {
		panic(fmt.Errorf("fatal error config file: %s \n", err))
	}

	resp := SendApiRequest(12345)
	if resp.StatusCode != 200 {
		t.Errorf("Expected 200 response code, got %d", resp.StatusCode)
	}
}

func TestSendApiRequest_fail_BadZip(t *testing.T) {
	viper.SetConfigName("configuration")
	viper.AddConfigPath("..")
	err := viper.ReadInConfig()
	if err != nil {
		panic(fmt.Errorf("fatal error config file: %s \n", err))
	}

	resp := SendApiRequest(1234)
	if resp.StatusCode != 404 {
		t.Errorf("Expected 404 response code, got %d", resp.StatusCode)
	}
}

func TestParseApiResponse_pass(t *testing.T) {

	mockResp := http.Response{
		StatusCode: 200,
		Body:       ioutil.NopCloser(bytes.NewBufferString(dummyResponse)),
	}

	expectedRespString := "Right now, it is NOT raining"

	respString := ParseApiResponse(&mockResp)
	if respString != expectedRespString {
		t.Errorf("got %s, expecting %s", respString, expectedRespString)
	}
}

func TestParseApiResponse_fail_BadZip(t *testing.T) {
	mockResp := http.Response{
		StatusCode: 400,
	}

	respString := ParseApiResponse(&mockResp)

	expectedRespString := "Location was not found, please confirm ZIP code is accurate"

	if respString != expectedRespString {
		t.Errorf("got %s, expecting %s", respString, expectedRespString)
	}

}

func TestParseApiResponse_fail_ConnectionError(t *testing.T) {
	mockResp := http.Response{
		StatusCode: 401,
	}

	respString := ParseApiResponse(&mockResp)

	expectedRespString := "Error connecting to the weather API service, please try again later"

	if respString != expectedRespString {
		t.Errorf("got %s, expecting %s", respString, expectedRespString)
	}
}

func TestStringInSlice_false(t *testing.T) {
	res := stringInSlice("Rain", []string{"Rain", "Thunderstorm", "Drizzle"})

	if !res {
		t.Error("\"Rain\" should be in that slice")
	}
}

func TestStringInSlice_true(t *testing.T) {
	res := stringInSlice("Clear", []string{"Rain", "Thunderstorm", "Drizzle"})

	if res {
		t.Error("\"Clear\" should not be in that slice")
	}
}
