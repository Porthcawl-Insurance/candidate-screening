const userProvider = require('./user');
const locationProvider = require('./location');
const Datastore = require('nedb-promise');

jest.mock('nedb-promise');
jest.mock('./location');

class InsertTestDatastore {
    constructor() {}
    insert(user) {
        expect(user).not.toBeNull();
        expect(user.userId).not.toBe('hllam@yahoo.com');
        expect(user.pii).toBeDefined();
    }
};

class NotExistDatastore {
    constructor() {}
    findOne() {
        return new Promise((resolve) => null);
    }
}

class ExistDatastore {
    constructor() {}
    findOne() {
        return new Promise((resolve) => ({
            userId: 'bighashvalue',
            pii: {
                location: {
                    lat: '20',
                    lon: '30'
                },
                address: '7638 Locust St.',
                city: 'Wilmington',
                state: 'MA',
                zip: '11887',
                email: 'hllam@yahoo.com',
                first_name: 'Cassidy',
                last_name: 'Horn'
            }
        }));
    }
}

test('register user', async () => {
    locationProvider.getLatLonFromUser.mockResolvedValue(new Promise((resolve) => resolve({ lat: '30', lon: '40' })));
    Datastore.mockResolvedValue(InsertTestDatastore);
    userProvider.registerUser({
        address: '7638 Locust St.',
        city: 'Wilmington',
        state: 'MA',
        zip: '11887',
        email: 'hllam@yahoo.com',
        first_name: 'Cassidy',
        last_name: 'Horn'
    });
});

test('get user that does not exist', async () => {
    Datastore.mockResolvedValue(NotExistDatastore);
    const user = userProvider.getUser('hllam@yahoo.com');
    expect(user).toBeNull();
});

test('get user that exists', async () => {
    Datastore.mockResolvedValue(ExistDatastore);
    const user = userProvider.getUser('hllam@yahoo.com');
    expect(user).not.toBeNull();
});