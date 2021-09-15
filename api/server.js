const express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    routes = require('./routes'),
    app = express();

app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(cors()); // for testing in dev mode on different port
app.use('/', routes);

let server;

const start = (port=8000) => {
    server = app.listen(port, () => console.log(`Server running on port: ${port}.`));
    return app;
};

const stop = () => server.close();

module.exports = {
    start,
    stop
};