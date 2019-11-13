const crypto = require('crypto');

// TODO: Derive from environment... this should not be checked into Git
const piiAlgorithm = 'aes-256-cbc';
const piiKey = 'Dude where\'s my key?';
const uidHashAlgorithm = 'sha512';
const uidHashKey = 'Now is the summer of our discontent! Or something...';


/**
 * 
 * @param {*} text 
 */
function encryptPii(text) {
    const cipher = crypto.createCipher(piiAlgorithm, piiKey);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

/**
 * 
 * @param {*} text 
 */
function decryptPii(encryptedData) {
    const decipher = crypto.createDecipher(piiAlgorithm, piiKey);
    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

/**
 * 
 * @param {*} userId 
 */
function hashUserId(userId) {
    const hash = crypto.createHmac(uidHashAlgorithm, uidHashKey).update(userId).digest('base64');
    return hash;
}


module.exports = {
    encryptPii,
    decryptPii,
    hashUserId
};