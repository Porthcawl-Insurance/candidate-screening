FROM node:12

WORKDIR /api

COPY ./package.json .
COPY ./package-lock.json .
COPY ./api .

RUN npm install

EXPOSE 8000

CMD npm start