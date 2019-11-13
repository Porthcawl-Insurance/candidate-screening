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
 * 
 * @param {*} userId 
 */
async function getUser(rawUserId) {
    const userId = piiCrypto.hashUserId(rawUserId);
    console.log('hash = ' + userId);
    let user = await userCollection.findOne({ userId });
    console.log(user);

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
 * 
 * @param {*} userObj 
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
    console.log(`http://localhost:3000/weather/status/rain/user/${encodeURI(userObj.email)} available for testing`);
};

module.exports = {
    getUser,
    registerUser
};