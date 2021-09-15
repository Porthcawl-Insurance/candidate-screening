const { stop } = require('../server');

console.log(`Shutting down server on port: ${process.env.PORT}.`);

stop();