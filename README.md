##Getting Started

#### System Dependencies - Required
```
Ruby 2.6.5
Postgresql
Yarn
```
#### After cloning
```
bundle install
yarn install --check-files
rails db:setup
```

#### Secrets
Using Vim or your editor of choice
```
vim config/master.key
<paste in provided key>
Test if worked:
EDITOR=vim rails credentials:edit
```

#### Running Locally
Data is seeded during application load
```
rails s
bin/webpack-dev-server
open browswer to http://localhost:3000
```
Input any email address from the seed file to login and check that user's weather.
Password for all users is `password`
Open up the network tab to view the requests being sent and responses
```
POST http://localhost:3000/api/v1/user_token
Sample response: {"jwt":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1ODI2MzA5NDQsInN1YiI6MSwiZW1haWwiOiJobGxhbUB5YWhvby5jb20ifQ.vtTAgwECiet8zWQHLk9M5mx2f2gBWW3bXjA8evBhH98"}
```
```
GET http://localhost:3000/api/v1/raining
Sample response: {"raining":false,"raining_status_can_be_refreshed_at":"2020-02-24T11:56:46.438Z"}
```



#### Test Suite
```
rspec
rubocop
.\coverage\index.html simplecov code coverage report
```
