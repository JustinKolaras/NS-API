require("dotenv").config({ path: "src/data/.env" });

const BASE = "/api/remote";

let NEW_KICKS_DESTINATION = [];

module.exports = (app) => {
    // Posts and registers a new kick to the endpoint.
    app.post(`${BASE}/outbound/kicks`, (req, res) => {
        const body = req.body;

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
                statusCode: 400,
            });
        }

        for (const index in NEW_KICKS_DESTINATION) {
            const dict = NEW_KICKS_DESTINATION[index];
            if (dict.toBanID == body.toBanID) {
                return res.status(409).send({
                    status: "error",
                    error: "Pending data already exists",
                    statusCode: 409,
                });
            }
        }

        NEW_KICKS_DESTINATION.push(body);
        return res.status(201).send({
            status: "ok",
            statusCode: 201,
        });
    });

    // Gets and retrieves all new kicks.
    app.get(`${BASE}/outbound/kicks`, (req, res) => {
        return res.status(200).send({
            status: "ok",
            data: NEW_KICKS_DESTINATION,
            statusCode: 200,
        });
    });

    // Deletes all pending kicks.
    app.delete(`${BASE}/outbound/kicks`, (req, res) => {
        NEW_KICKS_DESTINATION = [];
        return res.status(200).send({
            status: "ok",
            statusCode: 200,
        });
    });

    // Deletes a specific pending kick.
    app.delete(`${BASE}/outbound/kicks/:id`, (req, res) => {
        const { id } = req.params;

        if (isNaN(parseInt(id))) {
            return res.status(400).send({
                status: "error",
                error: "ID is not a number",
                statusCode: 400,
            });
        }

        for (const index in NEW_KICKS_DESTINATION) {
            const dict = NEW_KICKS_DESTINATION[index];
            if (dict.toKickID == id) {
                NEW_KICKS_DESTINATION = NEW_KICKS_DESTINATION.filter((item) => item !== dict);
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
