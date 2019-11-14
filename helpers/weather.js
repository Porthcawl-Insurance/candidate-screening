const rp = require('request-promise');

exports.getWeather = (lat, lng) => rp({
  uri: `https://api.darksky.net/forecast/${process.env.DARK_SKY_KEY}/${lat}, ${lng}`,
  qs: { exclude: 'minutely,hourly,daily,alerts,flags' },
  json: true,
}).then((weather) => weather.currently);
