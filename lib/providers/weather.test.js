const weatherProvider = require('./weather');
const userProvider = require('./user');
const requestPromiseNative = require('request-promise-native');

jest.mock('request-promise-native');
jest.mock('./user');

const userData = {
    pii: {
        location: {
            lat: '10',
            lon: '20'
        }
    }
};

test('getUserRainStatus should return null if user not found', async () => {
    userProvider.getUser.mockResolvedValue(new Promise((resolve) => resolve(null)));
    const weatherResponse = await weatherProvider.getUserRainStatus('test1@test.com');
    expect(weatherResponse).toBe(null);
});

test('getUserRainStatus should say it is raining', async () => {
    userProvider.getUser.mockResolvedValue(new Promise((resolve) => resolve(userData)));
    requestPromiseNative.mockResolvedValue(new Promise((resolve) => resolve({
        weather: [{main: 'Rain'}]
    })));
    const weatherResponse = await weatherProvider.getUserRainStatus('test2@test.com');
    expect(weatherResponse.raining).toBe(true);
});

test('getUserRainStatus should say it is not raining', async () => {
    userProvider.getUser.mockResolvedValue(new Promise((resolve) => resolve(userData)));
    requestPromiseNative.mockResolvedValue(new Promise((resolve) => resolve({
        weather: [{main: 'Clear'}]
    })));
    const weatherResponse = await weatherProvider.getUserRainStatus('test3@test.com');
    expect(weatherResponse.raining).toBe(false);
});
    
