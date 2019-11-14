const rp = require('request-promise');

exports.getLatLng = (address, city, state) => rp({
  uri: 'https://api.geocod.io/v1.4/geocode',
  qs: {
    q: `${address} ${city} ${state}`,
    api_key: process.env.GEOCODIO_KEY,
    limit: 1,
  },
  json: true,
}).then((response) => response.results[0].location);
