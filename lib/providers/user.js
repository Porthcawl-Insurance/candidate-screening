/**
 * This is the user provider. It will look up the user model in the DB collection of users.
 */


// Using NeDB, which has an ultra-light and local implementation of MongoDB's API.
// That makes an excellent gateway drug for Mongo.
const Datastore = require('nedb-promise');

const path = require('path');
const locationProvider = require('./location');
const piiCrypto = require('../util/piiCrypto');

const userDbFile = path.resolve('users.db');


// TODO: Derive db location from env.
const userCollection = new Datastore({ filename: userDbFile, autoload: true });

/**
 * Get a user.
 * @param {String} userId 
 */
async function getUser(userId) {
    let user = await userCollection.findOne({ userId });

    // Decrypt the PII.
    if (user) {
        return Object.assign(
            {},
            user,
            { pii: JSON.parse(piiCrypto.decryptPii(user.pii)) }
        );
    }

    return null;
}

/**
 * Register a user. This creates the userId.
 * @param {Object} userObj 
 */
async function registerUser(userObj) {

    // Get the user's lat/lon from the location provider.
    const location = await locationProvider.getLatLonFromUser(userObj);
    const userId = piiCrypto.hashUserId(userObj.email);

    // Encapsulate all PII into an object that will be encrypted.
    const pii = Object.assign({ location }, userObj);
    const user = {
        userId,
        pii: piiCrypto.encryptPii(JSON.stringify(pii))
    };

    const userResponse = await userCollection.insert(user);
    const encodedUserId = encodeURI(userId);
    console.log(`http://localhost:3000/weather/status/rain/user/${encodedUserId} available for testing`);
};

module.exports = {
    getUser,
    registerUser
};