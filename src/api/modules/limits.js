/*
    Defines the rate limits to use for POST requests and all other (DEFAULT) requests.
    POST requests have a limit of 30 per 10 minutes.
    All other requests (DEFAULT) have a limit of 150 per 10 minutes.
    Request count is inclusive to all endpoints.
*/

module.exports = {
    DEFAULT: {
        windowMS: 600000, // 10 minutes
        max: 150,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            status: "error",
            error: "Too many requests",
            statusCode: 429,
        },
    },

    POST: {
        windowMS: 600000, // 10 minutes
        max: 30,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            status: "error",
            error: "Too many requests",
            statusCode: 429,
        },
    },
};
