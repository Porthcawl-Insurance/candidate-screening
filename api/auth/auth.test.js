const { hashPassword, verifyPassword, verifyToken} = require('./index'),
    http = require('http');

// hashPassword
test('creates a hashed password', async() => {
    const hash = await hashPassword('password');
    expect(hash.length).toBe(60);
    expect(hash.slice(0, 7)).toBe("$2b$10$");
});

// verifyPassword
test('verifies a hashed password matches a password passed as argument', async () => {
    const hash = await hashPassword('password');

    // password match
    expect(await verifyPassword('password', hash)).toBe(true);

    // password mismatch
    expect(await verifyPassword('passw0rd', hash)).toBe(false);
});

// verifyToken
jest.mock('http');
test('verifies a token passed as argument', () => {
    const req = {
        headers : {
        "X-Access-Token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhsbGFtQHlhaG9vLmNvbSIsImlhdCI6MTU3NDcxODc5NiwiZXhwIjoxNTc0ODA1MTk2fQ.yvRRFh1uEHBntmD0sLYGGiiu3nzUrip1tJ6bXb_NEOM"
        }
    };

    const res = {};

    const next = () => true;

    const request = {data: req};

    http.get.mockResolvedValue(request);

    // with Bearer in token
    verifyToken(req, res, next)
        .then(resp => {
            expect(resp.headers["X-Access-Token"]).toBe("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhsbGFtQHlhaG9vLmNvbSIsImlhdCI6MTU3NDcxODc5NiwiZXhwIjoxNTc0ODA1MTk2fQ.yvRRFh1uEHBntmD0sLYGGiiu3nzUrip1tJ6bXb_NEOM");
        })
        .catch(err => ({}));
});

// test('verifies a token passed as argument => No "Bearer"', () => {
//     const req = {
//         headers : {
//         "X-Access-Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhsbGFtQHlhaG9vLmNvbSIsImlhdCI6MTU3NDcxODc5NiwiZXhwIjoxNTc0ODA1MTk2fQ.yvRRFh1uEHBntmD0sLYGGiiu3nzUrip1tJ6bXb_NEOM"
//         }
//     };

//     const res = {};

//     const next = () => true;

//     const request = {data: req};

//     http.get.mockResolvedValue(request);

//     // with Bearer in token
//     verifyToken(req, res, next)
//         .then(resp => {
//             expect(resp.headers["X-Access-Token"]).toBe("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhsbGFtQHlhaG9vLmNvbSIsImlhdCI6MTU3NDcxODc5NiwiZXhwIjoxNTc0ODA1MTk2fQ.yvRRFh1uEHBntmD0sLYGGiiu3nzUrip1tJ6bXb_NEOM");
//         })
//         .catch(err => ({"message": err}));
// });

// test('verifies a token passed as argument => no token', () => {
//     const req = {
//         headers : {}
//     };

//     const res = {
//         status: 401
//     };

//     const next = () => true;

//     const request = {data: res};

//     http.get.mockResolvedValue(request);

//     // with Bearer in token
//     verifyToken(req, res, next)
//         .then(resp => {
//             expect(res.status).toBe(401);
//         })
//         .catch(err => ({"message": err}));
// });