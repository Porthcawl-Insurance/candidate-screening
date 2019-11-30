-- import user data from csv file to table
COPY user_data(address,city,state,zip,email,first_name,last_name) 
FROM '/docker-entrypoint-initdb.d/dataset.csv' DELIMITER ',' CSV HEADER;
