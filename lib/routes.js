const weatherProvider = require('./providers/weather');

module.exports = (app) => {
    app.get('/weather/status/rain/user/:userId', async (req, res) => {
        try {
            const status = await weatherProvider.getUserRainStatus(req.params.userId);
            if (status) {
                res.status(200).send(status);
            } else {
                res.status(404).send();
            }
        } catch (err) {
            res.status(500).send();
            console.log(err);
        }
    });
}
