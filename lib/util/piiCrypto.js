/**
 * This module provides cryptographic libraries needed for the weather service.
 */

const crypto = require('crypto');

// TODO: Derive from environment... this should not be checked into Git in production
const piiAlgorithm = 'aes-256-cbc';
const piiKey = 'Dude where\'s my key?';
const uidHashAlgorithm = 'sha1';
const uidHashKey = 'H4$h3r';


/**
 * Encrypt the PII serialized object to base64.
 * @param {String} text 
 */
function encryptPii(text) {
    const cipher = crypto.createCipher(piiAlgorithm, piiKey);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

/**
 * Decrypt the base64 content to the PII serialized object.
 * @param {String} text 
 */
function decryptPii(encryptedData) {
    const decipher = crypto.createDecipher(piiAlgorithm, piiKey);
    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

/**
 * Hash the user id from the user's email address. 
 * @param {String} email
 */
function hashUserId(email) {
    const userId = crypto.createHmac(uidHashAlgorithm, uidHashKey).update(email).digest('hex');
    return userId;
}


module.exports = {
    encryptPii,
    decryptPii,
    hashUserId
};