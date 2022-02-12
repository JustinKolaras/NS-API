const rateLimit = require("express-rate-limit");

module.exports = (app) => {
    app.use(
        rateLimit({
            windowMS: 600000, // 10 minutes
            max: 30,
            standardHeaders: true,
            legacyHeaders: false,
            message: {
                status: "error",
                error: "Too many requests",
                statusCode: 429,
            },
        })
    );
};
