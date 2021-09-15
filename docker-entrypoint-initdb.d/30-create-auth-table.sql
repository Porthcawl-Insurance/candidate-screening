CREATE TABLE IF NOT EXISTS user_authentication
(
  id serial NOT NULL PRIMARY KEY,
  email varchar(255), -- email address
  password varchar(255), -- hashed with bcrypt
  token varchar(255) -- last token set for user
);

-- populate auth table with email addresses from user_data table
INSERT INTO user_authentication (SELECT id, email FROM user_data);

-- create generic password for every entry in user data table (password)
UPDATE user_authentication set password = '$2b$10$HrTN5tWN7paQxehjvFKYKuRLgcGFz0W8SWQ0AlmVJvSL/0WWF.BDe';