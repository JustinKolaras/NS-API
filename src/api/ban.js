require("dotenv").config({ path: "src/data/.env" });

const BASE = "/api/remote";

let NEW_BANS_DESTINATION = [];

module.exports = (app) => {
    // Posts and registers a new ban to the endpoint.
    app.post(`${BASE}/outbound/bans`, (req, res) => {
        const body = req.body;
        const headers = req.headers;

        if (!headers.authorization || headers.authorization !== process.env.AUTHORIZATION) {
            return res.status(401).send({
                status: "error",
                error: "Unauthorized",
                statusCode: 401,
            });
        }

        // Validate required fields
        if (
            !body.toBanID ||
            typeof body.toBanID !== "number" ||
            !body.reason ||
            typeof body.reason !== "string" ||
            !body.executor ||
            typeof body.executor !== "number"
        ) {
            return res.status(400).send({
                status: "error",
                error: "Invalid payload syntax",
                statusCode: 400,
            });
        }

        for (const index in NEW_BANS_DESTINATION) {
            const dict = NEW_BANS_DESTINATION[index];
            if (dict.toBanID == body.toBanID) {
                return res.status(409).send({
                    status: "error",
                    error: "Pending data already exists",
                    statusCode: 409,
                });
            }
        }

        NEW_BANS_DESTINATION.push(body);
        return res.status(201).send({
            status: "ok",
            statusCode: 201,
        });
    });

    // Gets and retrieves all new bans.
    app.get(`${BASE}/outbound/bans`, (req, res) => {
        const headers = req.headers;

        if (!headers.authorization || headers.authorization !== process.env.AUTHORIZATION) {
            return res.status(401).send({
                status: "error",
                error: "Unauthorized",
                statusCode: 401,
            });
        }

        return res.status(200).send({
            status: "ok",
            data: NEW_BANS_DESTINATION,
            statusCode: 200,
        });
    });

    // Deletes a specific pending ban.
    app.delete(`${BASE}/outbound/bans/:id`, (req, res) => {
        const headers = req.headers;

        if (!headers.authorization || headers.authorization !== process.env.AUTHORIZATION) {
            return res.status(401).send({
                status: "error",
                error: "Unauthorized",
                statusCode: 401,
            });
        }

        const { id } = req.params;

        if (isNaN(parseInt(id))) {
            return res.status(400).send({
                status: "error",
                error: "ID is not a number",
                statusCode: 400,
            });
        }

        for (const index in NEW_BANS_DESTINATION) {
            const dict = NEW_BANS_DESTINATION[index];
            if (dict.toBanID == id) {
                NEW_BANS_DESTINATION = NEW_BANS_DESTINATION.filter((item) => item !== dict);
                return res.status(200).send({
                    status: "ok",
                    statusCode: 200,
                });
            }
        }

        return res.status(404).send({
            status: "error",
            error: "Not found",
            statusCode: 404,
        });
    });
};
