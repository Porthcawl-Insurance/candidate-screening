const { expect } = require('chai');
const request = require('supertest');
const nock = require('nock');
const jwt = require('jsonwebtoken');

require('./clear-db');
const app = require('../app');
const { Admin, User } = require('../models');

const email = 'test@test.com';
const password = 'password';

let admin;
let token;
let user;

before(async () => {
  admin = await Admin.create({ email: 'admin@test.com', password });
  user = await User.create({
    email,
    address: '808 Marsh Drive',
    city: 'Yakima',
    state: 'WA',
  });
  await User.create({ email: 'test1@test.com' });
  await User.create({ email: 'test2@test.com' });

  token = jwt.sign({ email: admin.email, adminId: admin.id }, process.env.JWT_SECRET);
});

describe('POST /admin/signup', () => {
  it('creates an admin', () =>
    request(app)
      .post('/admin/signup')
      .query({ email, password })
      .expect(200)
      .then(() => Admin.findOne({ email }))
      .then((admin) => {
        expect(admin.email).to.equal(email);
      }));
});

describe('POST /admin/login', () => {
  it('logs in with an admin', () =>
    request(app)
      .post('/admin/login')
      .query({ email: admin.email, password })
      .expect(200)
      .then((res) => {
        expect(res.body.token).to.be.a('string');
      }));

  it('fails login with invalid email', () =>
    request(app)
      .post('/admin/login')
      .query({ email: 'invalid@test.com', password })
      .expect(401, 'Unauthorized'));

  it('fails login with invalid password', () =>
    request(app)
      .post('/admin/login')
      .query({ email: admin.email, password: 'invalidpassword' })
      .expect(401, 'Unauthorized'));
});

describe('GET /users', () => {
  it('gets a list of user ids', () =>
    request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((res) => {
        expect(res.body.length).to.equal(3);
      }));
});

describe('GET /users/:userId/weather', () => {
  beforeEach(() => {
    nock('https://api.geocod.io')
      .get(/.*/)
      .reply(200, {
        results: [{
          location: {
            lat: 45.123,
            lng: -123.012,
          },
        }],
      });
  });

  it('gets the weather for a user where it is raining', () => {
    nock('https://api.darksky.net')
      .get(/forecast\/.*/)
      .reply(200, { currently: { precipType: 'rain' } });

    return request(app)
      .get(`/users/${user.id}/weather`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200, 'It is raining where this user lives.');
  });

  it('gets the weather for a user where it is not raining', () => {
    nock('https://api.darksky.net')
      .get(/forecast\/.*/)
      .reply(200, { currently: {} });

    return request(app)
      .get(`/users/${user.id}/weather`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200, 'It is NOT raining where this user lives.');
  });
});
