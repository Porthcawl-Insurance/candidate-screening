CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE people (
    id SERIAL PRIMARY KEY,
    unique_id UUID UNIQUE DEFAULT uuid_generate_v4(),
    last_name VARCHAR NOT NULL,
    first_name VARCHAR NOT NULL,
    address VARCHAR,
    city VARCHAR,
    state VARCHAR,
    zip VARCHAR,
    email VARCHAR
)