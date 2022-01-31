require("dotenv").config({ path: "src/data/.env" });

const BASE = process.env.BASE_APPENSION;

let NEW_KICKS_DESTINATION = [];

module.exports = (app) => {
    // Posts and registers a new kick to the endpoint.
    app.post(`${BASE}/outbound/kicks`, (req, res) => {
        const body = req.body;
        const headers = req.headers;

        if (!headers.authorization || headers.authorization !== process.env.AUTHORIZATION_KEY) {
            return res.status(401).send({
                status: "error",
                error: "Unauthorized",
            });
        }

        // Validate required fields
        if (
            !body.toKickID ||
            typeof body.toKickID !== "number" ||
            !body.reason ||
            typeof body.reason !== "string" ||
            !body.executor ||
            typeof body.executor !== "number"
        ) {
            return res.status(400).send({
                status: "error",
                error: "Invalid payload syntax",
            });
        }

        NEW_KICKS_DESTINATION.push(body);
        return res.status(201).send({
            status: "ok",
        });
    });

    // Gets and retrieves all new kicks.
    app.get(`${BASE}/outbound/kicks`, (req, res) => {
        const headers = req.headers;

        if (!headers.authorization || headers.authorization !== process.env.AUTHORIZATION_KEY) {
            return res.status(401).send({
                status: "error",
                error: "Unauthorized",
            });
        }

        return res.status(200).send({
            status: "ok",
            data: NEW_KICKS_DESTINATION,
        });
    });

    // Deletes all pending kicks.
    app.delete(`${BASE}/outbound/kicks`, (req, res) => {
        const headers = req.headers;

        if (!headers.authorization || headers.authorization !== process.env.AUTHORIZATION_KEY) {
            return res.status(401).send({
                status: "error",
                error: "Unauthorized",
            });
        }

        NEW_KICKS_DESTINATION = [];
        return res.status(200).send({
            status: "ok",
        });
    });

    // Deletes a specific pending kick.
    app.delete(`${BASE}/outbound/kicks/:id`, (req, res) => {
        const headers = req.headers;

        if (!headers.authorization || headers.authorization !== process.env.AUTHORIZATION_KEY) {
            return res.status(401).send({
                status: "error",
                error: "Unauthorized",
            });
        }

        const { id } = req.params;

        if (isNaN(parseInt(id))) {
            return res.status(400).send({
                status: "error",
                error: "ID is not a number",
            });
        }

        for (const index in NEW_KICKS_DESTINATION) {
            const dict = NEW_KICKS_DESTINATION[index];
            if (dict.toKickID == id) {
                NEW_KICKS_DESTINATION = NEW_KICKS_DESTINATION.filter((item) => item !== dict);
                return res.status(200).send({
                    status: "ok",
                });
            }
        }

        return res.status(400).send({
            status: "error",
            error: "Not found",
        });
    });
};
