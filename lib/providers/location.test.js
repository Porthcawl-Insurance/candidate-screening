const locationProvider = require('./location');
const requestPromiseNative = require('request-promise-native');

jest.mock('request-promise-native');

test('should get latitude/longitude from user data', async () => {
    requestPromiseNative.mockResolvedValue(new Promise((resolve) => resolve('a,b,c,10,20')));
    const location = await locationProvider.getLatLonFromUser({
        address: '123 Cherry St',
        city: 'San Antonio',
        state: 'TX',
        zip: '78232'
    });
    expect(location.lat).toBe('10');
    expect(location.lon).toBe('20');
});
