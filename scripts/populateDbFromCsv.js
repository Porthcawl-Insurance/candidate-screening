#!/usr/bin/env node

//const requestPromise = require('request-promise-native');
const path = require('path');
const csvToJson = require('csvtojson');

const userProvider = require('../lib/providers/user');
const csvFile = path.resolve('dataset.csv');

csvToJson()
    .fromFile(csvFile)
    .then(records => Promise.all(records.map(record => userProvider.registerUser(record))));

