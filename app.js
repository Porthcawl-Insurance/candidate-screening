const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const passport = require('passport');

dotenv.config({ path: '.env' });

require('./config/passport');
require('./models');

const adminController = require('./controllers/admin');
const userController = require('./controllers/user');

const app = express();

app.set('port', process.env.PORT || 8080);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(passport.initialize());

app.post('/admin/signup', adminController.postSignup);
app.post('/admin/login', passport.authenticate('local', { session: false }), adminController.postLogin);

app.get('/users', passport.authenticate('jwt', { session: false }), userController.getUsers);
app.get('/users/:userId/weather', passport.authenticate('jwt', { session: false }), userController.getUserWeather);

/* istanbul ignore next */
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Server Error');
});

app.listen(app.get('port'), () => {
  console.log(`App is listening on port ${app.get('port')}`);
});

module.exports = app;
