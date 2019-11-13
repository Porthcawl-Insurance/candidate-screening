const express = require('express');

const weatherProvider = require('./lib/providers/weather');
const routes = require('./lib/routes');

const app = express();
routes(app);

const server = app.listen(3000, function () {
    console.log('Listening on port ', server.address().port);
});
