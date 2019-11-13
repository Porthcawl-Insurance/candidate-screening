const userProvider = require('./user');
const locationProvider = require('./location');
const Datastore = require('nedb-promise');

jest.mock('./location');
jest.mock('nedb-promise', () => {
    return function() {
        return {
            insert: (user) => {},
            findOne: (query) => {
                if (query.userId === '560b0fae077798d76539e61b6a79402fdcda5faf') {
                    return {
                        userId:'560b0fae077798d76539e61b6a79402fdcda5faf',
                        pii:'NNOseiw3igokg9cgj7slpC1xKeh0B/y3TDBEUafu0sN3k+y5KlBhah1ew3F7ZLu0W1vuOTj76BQwSaNszrAE0vlDGInum3wrF0cpCf047QWO0/vmxQGQzTXRTKF862kgeKV3WQOOuDCWRaMbffkezkxKe2vO8OHyJQNNtMJldmgu4yl59LtyyAgnMy3sTN6iML7RqpP8C+XtATy8OJHdeZoKjpLQHJOUt5c0fUAXlN10XflJ0cyYPR5WR+mYGHkUiN4eFeS7Ygs75WAKxfuigg==',
                        _id:'08s24RJp37WBqOCC'
                    };
                } else {
                    return null;
                }
            }
        }
    }
});


test('register user', async () => {
    locationProvider.getLatLonFromUser.mockResolvedValue(new Promise((resolve) => resolve({ lat: '30', lon: '40' })));
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
    const user = await userProvider.getUser('asdkfhjalsdkfjasldkfasdkfj');
    expect(user).toBeNull();
});

test('get user that exists', async () => {
    const user = await userProvider.getUser('560b0fae077798d76539e61b6a79402fdcda5faf');
    expect(user).not.toBeNull();
});