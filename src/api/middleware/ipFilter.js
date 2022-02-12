require("dotenv").config({ path: "src/data/.env" });

module.exports = (app) => {
    app.use((req, res, next) => {
        return res.status(400).send({
            status: "error",
            requestIp: typeof req.ip + " " + req.ip,
            envIp: typeof process.env.NSUTIL_IP + " " + process.env.NSUTIL_IP,
        });
        if (req.ip === process.env.NSUTIL_IP || req.ip === process.env.NSGAME_IP) {
            next();
        } else {
            return res.status(403).send({
                status: "error",
                error: "Forbidden",
                statusCode: 403,
            });
        }
    });
};
