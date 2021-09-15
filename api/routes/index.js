const {
    authenticateUser,
    getCurrentWeather } = require('../controllers'),
    { verifyToken } = require('../auth');
    express = require('express'),
    router = express.Router();

router
    .get('/api/v1/weather', verifyToken, getCurrentWeather)
    .post('/api/v1/login', authenticateUser);

module.exports = router;