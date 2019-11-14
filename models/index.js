require('dotenv/config');
const mongoose = require('mongoose');
const bluebird = require('bluebird');

const config = require('../config/db');
const User = require('./User');
const Admin = require('./Admin');

mongoose.Promise = bluebird;

const { host, port, name } = config[process.env.NODE_ENV];
const connectionString = `mongodb://${host}:${port}/${name}`;

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/* istanbul ignore next */
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('MongoDB connection error. Please make sure MongoDB is running.');
  process.exit();
});

module.exports = { User, Admin };
