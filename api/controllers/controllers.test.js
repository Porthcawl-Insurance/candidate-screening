const { authenticateUser, getCurrentWeather} = require('./index'),
    http = require('http');

jest.mock('http');
jest.mock('../db');

// authenticateUser
test('determines if email and password are valid => true', async() => {
    const req = {
        body: {
            email: "test@test.com",
            password: "password"
        }
    };

    const res = {
        status() {
            return this;
        },
        json() {
            return {};
        }
    };

    const resp = {
        "status": 201,
        "success": true,
        "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhsbGFtQHlhaG9vLmNvbSIsImlhdCI6MTU3NDcxODc5NiwiZXhwIjoxNTc0ODA1MTk2fQ.yvRRFh1uEHBntmD0sLYGGiiu3nzUrip1tJ6bXb_NEOM"
    };

    http.get.mockResolvedValue(resp);

    authenticateUser(req, res)
        .then(data => {
            expect(data).toBe(resp);
        })
        .catch(err => ({}));
});

// getCurrentWeather
test('returns whether a zip code has rain', async () => {
    const req = {
        headers: {
            "x-access-token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhsbGFtQHlhaG9vLmNvbSIsImlhdCI6MTU3NDcxODc5NiwiZXhwIjoxNTc0ODA1MTk2fQ.yvRRFh1uEHBntmD0sLYGGiiu3nzUrip1tJ6bXb_NEOM"
        }
    };

    const res = {};

    const zipCode = 78717;

    const resp = {
        zip: zipCode,
        raining: true,
        message: `It's Raining at zip code: ${zipCode}!`,
        status: 201
    };

    http.get.mockResolvedValue(resp);

    getCurrentWeather(req, res)
        .then(r => {
            expect(r).toBe(resp);
        })
        .catch(err => ({}));
});