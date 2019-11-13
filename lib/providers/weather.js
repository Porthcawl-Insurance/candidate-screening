const requestPromise = require('request-promise-native');
const userProvider = require('./user');

// See API here: https://openweathermap.org/current 
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather'; // TODO: Move to config
const weatherAppId = '8cb540796c8147eefc42b4164de5bd92'; // TODO: Move to config

/**
 * 
 * @param {*} userId 
 */
async function getWeatherForUser(userId) {
    const user = await userProvider.getUser(userId);

    if (user) {
        const options = {
            uri: weatherUrl,
            method: 'GET',
            qs: {
                lat: user.pii.location.lat,
                lon: user.pii.location.lon,
                APPID: weatherAppId
            },
            json: true
        };
        return requestPromise(options);
    } else {
        return null;
    }
}

/**
 * 
 * @param {*} userId 
 */
async function getUserRainStatus(userId) {
    // Check the weather codes in the response.
    const response = await getWeatherForUser(userId);
    if (response && response.weather) {
        for (let it = 0; it < response.weather.length; it += 1) {
            if (response.weather[it].main.indexOf('Rain') >= 0) {
                return { raining: true };
            }
        }
        return { raining: false };
    }

    // Not found.
    return null;
}

module.exports = {
    getUserRainStatus
};