package utils

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/spf13/viper"
)

func SendApiRequest(zip int) (resp *http.Response) {
	log.Println("Sending API request")
	apiUrl := viper.GetString("api.url")
	apiKey := viper.GetString("api.appid")
	url := fmt.Sprintf("%szip=%d&appid=%s", apiUrl, zip, apiKey)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Fatal("NewRequest:", err)
		return
	}

	client := &http.Client{}

	resp, err = client.Do(req)
	if err != nil {
		log.Fatal("Do:", err)
		return
	}
	return
}

func ParseApiResponse(resp *http.Response) (respString string) {
	log.Println("Successfully received API response, parsing")

	switch respCode := resp.StatusCode; respCode {
	case 200:
		type WeatherJson struct {
			Main        string `json:"main"`
			Description string `json:"description"`
		}
		type ApiBody struct {
			Weather []WeatherJson `json:"weather"`
		}
		desc := ApiBody{}
		body, readErr := ioutil.ReadAll(resp.Body)
		if readErr != nil {
			log.Fatal("Read error: ", readErr)
		}
		err := json.Unmarshal(body, &desc)
		if err != nil {
			log.Fatal("Unmarshal error: ", err)
		}

		main := desc.Weather[0].Main
		detail := desc.Weather[0].Description

		respString = fmt.Sprintf("Right now, the weather is %s, specifically %s", main, detail)
		return
	case 400, 404:
		respString = "Location was not found, please confirm ZIP code is accurate"
		return
	case 401:
		fallthrough
	default:
		respString = "Error connecting to the weather API service, please try again later"
		return
	}
}
