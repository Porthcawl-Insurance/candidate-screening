const bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken');

// to be used with new accounts (not implemented)
const hashPassword = async password => {
    const SALT_ROUNDS = 10,
        salt = await bcrypt.genSalt(SALT_ROUNDS);

    try {
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (err) {
        throw err;
    }   
};

// hash is the password stored in the database
const verifyPassword = async (password, hash) => {
    try {
        const isMatch = await bcrypt.compare(password, hash);
        return isMatch ? true : false;
    } catch (err) {
        throw err;
    }
};

const verifyToken = async (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    
    try {

        if (token.startsWith('Bearer ')) { // Remove Bearer prefix
            token = token.slice(7, token.length);
        }

        const validToken = jwt.verify(token, process.env.JWT_SECRET);

        req.decoded = validToken;
        
        next();
    } catch (err) {
        return res.status(401).json({
            status: 401,
            success: false,
            message: 'Token is not valid. Please login.'
        });
    }
};

module.exports = {
    hashPassword,
    verifyPassword,
    verifyToken
};