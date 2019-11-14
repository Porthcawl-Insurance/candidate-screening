/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const mongoose = require('mongoose');
const config = require('../config/db');

before((done) => {
  const clearCollections = () => {
    for (const collection in mongoose.connection.collections) {
      mongoose.connection.collections[collection].deleteMany(() => { });
    }
    return done();
  };

  if (mongoose.connection.readyState === 0) {
    mongoose.connect(config.test.db, (err) => {
      if (err) throw err;
      return clearCollections();
    });
  } else {
    return clearCollections();
  }
});

after(() => mongoose.disconnect());
