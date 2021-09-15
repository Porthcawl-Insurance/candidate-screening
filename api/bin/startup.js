const { start } = require('../server'),
    PORT = process.env.PORT;

console.log(`Starting server on port: ${PORT}`);

start(PORT);