# CyberFortress

### Setup

* Node v12 is assumed, you can use [NVM](https://github.com/nvm-sh/nvm#install--update-script) to install if needed
* Ensure that the [MongoDB](https://www.mongodb.com/download-center/community) community server is installed
* Create the env file with `cp .env.example .env`, I will provide my Geocodio and Darksky keys via email
* Run `npm install` and `npm run db:seed` from the app directory

### Using the app

Use `npm start` to run the app. You can then send requests using curl or Postman.

###### Register an admin user
```
curl -X POST 'http://localhost:8080/admin/signup?email=test@test.com&password=password'
```

###### Login with your new admin user
```
curl -X POST 'http://localhost:8080/admin/login?email=test@test.com&password=password'
```
This will return a JSON web token, capture that and send it via Bearer authentication with the following requests.

###### Get a list of user ids
```
curl -X GET http://localhost:8080/users \
  -H 'Authorization: Bearer TOKEN_GOES_HERE'
```

Optionally you can paginate this data with an offset and limit. (Defaults to limit 50, max 200)
```
curl -X GET http://localhost:8080/users?offset=20&limit=10 \
  -H 'Authorization: Bearer TOKEN_GOES_HERE'
```

###### Get the rain status of a specific user
```
curl -X GET http://localhost:8080/users/USER_ID/weather \
  -H 'Authorization: Bearer TOKEN_GOES_HERE'
```

### Running the tests

Use `npm test` to run all of the tests and show coverage.