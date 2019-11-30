const {
    assignToken,
    doLogin,
    getZipCode
} = require('../models');

const {
    apiKey,
    baseUrl,
} = require('../config');

const http = require('http');

// authenticate
const authenticateUser = async (req, res) => {
    let token;

    const { email, password } = req.body,
        bearer = await doLogin(email, password);

    if (bearer && bearer.token) {
        token = bearer.token;
    } else {
        return res
            .status(bearer.status)
            .json(bearer);
    }
    
    try {
        await assignToken(email, token);
        req.decoded = token;
    
        // return the JWT token for the future API calls
        res
            .set({
                'X-Access-Token': token,
            })
            .json({
                "status": 201,
                "success": true,
                "token": token
            });
    } catch (err) {
        res
            .status(500)
            .json({
                status: 500,
                message: `Error setting token: ${err}`
            })
    }
}

// return current weather
const getCurrentWeather = async (req, res) => {
    const zipCode = await getZipCode(req.headers['x-access-token']);

    if (!zipCode) {
        return res
            .status(400)
            .json({
                status: 400,
                message: "Zip code must be provided."
            });
    }

    const url = `${baseUrl}/current?access_key=${apiKey}&query=${zipCode}`;

    http.get(url, (resp) => {
        let data = "";
      
        resp.on("data", (chunk) => {
            data += chunk;
        });
      
        resp.on("end", () => {
            const currentWeather = JSON.parse(data).current,
                weather = {zip: zipCode};
                        
            if (currentWeather.precip > 0) {
                weather.raining = true;
                weather.message = `It's Raining at zip code: ${zipCode}!`;
            } else {
                weather.raining = false;
                weather.message = `Sorry, no rain at zip code: ${zipCode}!`;
            }

            weather.status = 201;

            res
                .status(weather.status)
                .json(weather);
        });
        
        resp.on("error", (err) => {
            console.log(`An error occured fetching the current weather: ${err.message}`);
            res
                .status(500)
                .json({
                    "status": 500,
                    "message": `An error occured fetching the current weather: ${err.message}`
                });
        });
    });
};

module.exports = {
    authenticateUser,
    getCurrentWeather
};