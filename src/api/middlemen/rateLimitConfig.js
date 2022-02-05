const rateLimit = require("express-rate-limit");

module.exports = (express, app) => {
    app.use(
        rateLimit({
            windowMS: 10 * 60 * 1000, // 10 minutes
            max: 30,
            standardHeaders: true,
            legacyHeaders: false,
        })
    );
};
