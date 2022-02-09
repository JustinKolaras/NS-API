const rateLimit = require("express-rate-limit");

module.exports = (express, app) => {
    app.use(
        rateLimit({
            windowMS: 10 * 60 * 1000, // 10 minutes
            max: 30,
            message: {
                status: "error",
                error: "Too many requests",
            },
            standardHeaders: true,
            legacyHeaders: false,
        })
    );
};
