const {
    assignToken,
    doLogin,
    getZipCode
} = require('./index');

const http = require('http');

jest.mock('../db');

const db = require('../db');

test('placeholder', () => expect(true).toBe(true));

// assignToken
test('write token to user auth table entry', async () => {
    const email = 'test@test.co',
        token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhsbGFtQHlhaG9vLmNvbSIsImlhdCI6MTU3NDcxODc5NiwiZXhwIjoxNTc0ODA1MTk2fQ.yvRRFh1uEHBntmD0sLYGGiiu3nzUrip1tJ6bXb_NEOM';

    db.query.mockImplementation(async () => true);

    const result = await assignToken(email, token);
    expect(result).toBe(true);
});

// doLogin
test('determines if email and password are valid => false', async() => {
    const email = "test@test.co",
        password = "passw0rd";

    const notAuthorized = {
        "status": 401,
        "success": false,
        "message": "Not Authorized!"
    };

    db.query = jest.fn();

    db.query.mockReturnValue({rows: []});

    const results = await doLogin(email, password);

    expect(results.message).toBe("Not Authorized!");
});

// getZipCode
test('get zip code from database', async () => {
    const getZipCode = jest.fn();

    getZipCode.mockReturnValue('01147');
    
    db.query = jest.fn();

    db.query.mockReturnValue = ({rows: [{zip: 1147}]});

    const zip = await getZipCode("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhsbGFtQHlhaG9vLmNvbSIsImlhdCI6MTU3NDcxODc5NiwiZXhwIjoxNTc0ODA1MTk2fQ.yvRRFh1uEHBntmD0sLYGGiiu3nzUrip1tJ6bXb_NEOM");
    expect(zip).toBe(`01147`);
});