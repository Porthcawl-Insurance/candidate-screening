// This is a provider to find a lat-lon for a given address.
const requestPromise = require('request-promise-native');

const geocodeUrl = 'http://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx';
const apiKey = 'ee657206883c4789927b76f14973cfac'; // TODO move to config

/**
 * 
 * @param {*} address 
 */
async function getLatLonFromUser(user) {
    const options = {
        uri: geocodeUrl,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        qs: {
            apiKey,
            version: '4.01',
            streetAddress: user.address,
            city: user.city,
            state: user.state,
            zip: user.zip
        },
        json: true
    };

    const res = await requestPromise(options);
    const [,,,lat,lon] = res.split(',');

    return {lat, lon};
};

module.exports = {
    getLatLonFromUser
};