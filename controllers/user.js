const { User } = require('../models');
const { getWeather } = require('../helpers/weather');
const { getLatLng } = require('../helpers/location');

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

exports.getUsers = async (req, res, next) => {
  const offset = parseInt(req.query.offset) || 0;
  const limit = parseInt(req.query.limit) || DEFAULT_LIMIT;

  try {
    const users = await User.find()
      .skip(offset)
      .limit(Math.min(limit, MAX_LIMIT));

    return res.json(users.map((user) => user._id));
  } catch (err) {
    next(err);
  }
};

exports.getUserWeather = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send('User not found.');

    const { lat, lng } = await getLatLng(user.address, user.city, user.state);
    const weather = await getWeather(lat, lng);

    return res.send(`It is${weather.precipType ? '' : ' NOT'} raining where this user lives.`);
  } catch (err) {
    if (err.name === 'CastError') return res.status(400).send('Invalid user id provided.');
    next(err);
  }
};
