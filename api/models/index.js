const { query } = require('../db'),
    { verifyPassword } = require('../auth'),
    jwt = require('jsonwebtoken');

// set token in database
const assignToken = async (email, token) => {
    const queryString = {
        text: 'update user_authentication set token = $1 where email = $2',
        values: [token, email]
    };

    try {
        const result = await query(queryString);
        return true;        
    } catch(err) {
        throw err;
    }
};

// fetch zip code to check weather
const getZipCode = async token => {
    const queryString = {
        text: 'select d.zip from user_data d, user_authentication a where a.token = $1 and a.email = d.email',
        values: [token]
    };

    try {
        const result = await query(queryString);
        const zip = result.rows[0].zip;
        return zip && zip.length < 5 ? `0${zip}` : zip;

    } catch (err) {
        throw err;
    }
};

const doLogin = async (email, password) => {
    // get hashed password from database
    const queryString = {
        text: 'select password from user_authentication where email = $1 limit 1',
        values: [email]
    };

    try {
        const unauthorized = {
            "status": 401,
            "success": false,
            "message": "Not Authorized!"
        };

        const result = await query(queryString);

        try {
            const hash = await result.rows[0].password;

            // set token if passwords match
            const match = await verifyPassword(password, hash);

            if (match) {
                const token = `Bearer ${jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: '24h'})}`;

                return {
                    token
                };
            } else {
                return unauthorized;
            }
            
        } catch(err) {
            return unauthorized;
        }
    } catch (err) {
        return {
            status: 404,
            message: "Unable to find account.", "error": err,
            success: false
        };
    }
};

module.exports = {
    assignToken,
    doLogin,
    getZipCode
};
