## Solution
The solution is a REST API with protected "weather" endpoint. 

## Under the hood
The following technologies were used:

- Node.js, Express.js for server/api
- Postgresql for database (pg package for queries)
- bcrypt for password hashing
- JWT for tokens
- Jest for testing
- Docker Compose for container management, application bootstrapping

## System requirements

- Docker
- Docker Compose

## Build instructions
After downloading, run `docker-compose up --build &`

This step will:

- create the database and tables
- populate the database with entries from dataset.csv
- create passwords for the user entries
- spin up a Node/Express API and connect to Postgresql

To shutdown gracefully, `docker-compose down`

## API Usage
The following curl commands will allow you to login and check for rain for any of the users in the dataset.csv file.
For convenience, all users have been initialized with the password, "password".

The following endpoints are available:

- login
- weather

### Login
To obtain a token for use in checking for rain, utilize the curl command below for any registered user (any user in dataset.csv).

`curl -i -X POST "localhost:8000/api/v1/login" -d '{"email": "<email address>", "password": "<password>"}'`

### Determine if there is rain
Use the token provided in the response json from login to pass as the token in the X-Access-Token header.

`curl -i "localhost:8000/api/v1/weather" -H X-Access-Token:"<token>"`

## Learning Points
Had learning opportunities configuring Docker Compose and running initialization scripts.

## Wish list
The following items were not implemented:

- Endpoints to add/remove users
- Migration scripts for the database
- User interface to complement the api