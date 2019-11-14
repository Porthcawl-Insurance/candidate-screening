const csv = require('csvtojson');
const path = require('path');
const { User } = require('../models');

csv({ headers: ['address', 'city', 'state', 'zip', 'email', 'firstName', 'lastName'] })
  .fromFile(path.join(__dirname, '../dataset.csv'))
  .then((users) => User.collection.insertMany(users))
  .then(({ insertedCount }) => {
    console.log(`Imported ${insertedCount} user records.`);
  })
  .catch((err) => console.error('ERROR:', err.message))
  .finally(() => process.exit());
