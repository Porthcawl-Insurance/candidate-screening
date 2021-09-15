CREATE TABLE IF NOT EXISTS user_data
(
  id serial NOT NULL PRIMARY KEY,
  address varchar(80),
  city varchar(80),
  state varchar(2),
  zip varchar(10),
  email varchar(255),
  first_name varchar(50),
  last_name varchar(50)
);
