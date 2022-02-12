require("dotenv").config({ path: "src/data/.env" });

module.exports = (app) => {
    app.use((req, res, next) => {
        const headers = req.headers;
        if (headers.Authorization && headers.Authorization === process.env.AUTHORIZATION) {
            next();
        } else {
            return res.status(401).send({
                status: "error",
                error: "Unauthorized",
                statusCode: 401,
            });
        }
    });
};
