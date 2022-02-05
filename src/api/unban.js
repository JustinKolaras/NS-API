require("dotenv").config({ path: "src/data/.env" });

const BASE = "/api/remote";

let NEW_UNBANS_DESTINATION = [];

module.exports = (app) => {
    // Posts and registers a new unban to the endpoint.
    app.post(`${BASE}/outbound/unbans`, (req, res) => {
        const body = req.body;
        const headers = req.headers;

        if (!headers.authorization || headers.authorization !== process.env.AUTHORIZATION) {
            return res.status(401).send({
                status: "error",
                error: "Unauthorized",
            });
        }

        // Validate required fields
        if (!body.toUnbanID || typeof body.toUnbanID !== "number") {
            return res.status(400).send({
                status: "error",
                error: "Invalid payload syntax",
            });
        }

        for (const index in NEW_UNBANS_DESTINATION) {
            const dict = NEW_UNBANS_DESTINATION[index];
            if (dict.toBanID == body.toBanID) {
                return res.status(409).send({
                    status: "error",
                    error: "Pending data already exists",
                });
            }
        }

        NEW_UNBANS_DESTINATION.push(body);
        return res.status(201).send({
            status: "ok",
        });
    });

    // Gets and retrieves all new unbans.
    app.get(`${BASE}/outbound/unbans`, (req, res) => {
        const headers = req.headers;

        if (!headers.authorization || headers.authorization !== process.env.AUTHORIZATION) {
            return res.status(401).send({
                status: "error",
                error: "Unauthorized",
            });
        }

        return res.status(200).send({
            status: "ok",
            data: NEW_UNBANS_DESTINATION,
        });
    });

    // Deletes a specific pending unban.
    app.delete(`${BASE}/outbound/unbans/:id`, (req, res) => {
        const headers = req.headers;

        if (!headers.authorization || headers.authorization !== process.env.AUTHORIZATION) {
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

        for (const index in NEW_UNBANS_DESTINATION) {
            const dict = NEW_UNBANS_DESTINATION[index];
            if (dict.toUnbanID == id) {
                NEW_UNBANS_DESTINATION = NEW_UNBANS_DESTINATION.filter((item) => item !== dict);
                return res.status(200).send({
                    status: "ok",
                });
            }
        }

        return res.status(404).send({
            status: "error",
            error: "Not found",
        });
    });
};
