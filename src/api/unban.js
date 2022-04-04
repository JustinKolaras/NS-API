/*
    API Route which handles all unban-related endpoints.
    -> POST @ /api/remote/outbound/unbans
    -> GET @ /api/remote/outbound/unbans
    -> DELETE @ /api/remote/outbound/unbans/<player-id>
*/

require("dotenv").config({ path: "src/data/.env" });

const rateLimit = require("express-rate-limit");
const limits = require("./modules/limits");

const BASE = "/api/remote";

let NEW_UNBANS_DESTINATION = [];

module.exports = (app) => {
    // Posts and registers a new unban to the endpoint.
    app.post(`${BASE}/outbound/unbans`, rateLimit(limits.POST), (req, res) => {
        const body = req.body;

        // Validate required fields
        if (!body.toUnbanID || typeof body.toUnbanID !== "number" || !body.executor || typeof body.executor !== "number") {
            return res.status(400).send({
                status: "error",
                error: "Invalid payload syntax",
                statusCode: 400,
            });
        }

        for (const index in NEW_UNBANS_DESTINATION) {
            const dict = NEW_UNBANS_DESTINATION[index];
            if (dict.toBanID == body.toBanID) {
                return res.status(409).send({
                    status: "error",
                    error: "Pending data already exists",
                    statusCode: 409,
                });
            }
        }

        NEW_UNBANS_DESTINATION.push(body);
        return res.status(201).send({
            status: "ok",
            statusCode: 201,
        });
    });

    // Gets and retrieves all new unbans.
    app.get(`${BASE}/outbound/unbans`, rateLimit(limits.DEFAULT), (_, res) => {
        return res.status(200).send({
            status: "ok",
            data: NEW_UNBANS_DESTINATION,
            statusCode: 200,
        });
    });

    // Deletes a specific pending unban.
    app.delete(`${BASE}/outbound/unbans/:id`, rateLimit(limits.DEFAULT), (req, res) => {
        const { id } = req.params;

        if (isNaN(parseInt(id))) {
            return res.status(400).send({
                status: "error",
                error: "ID is not a number",
                statusCode: 400,
            });
        }

        for (const index in NEW_UNBANS_DESTINATION) {
            const dict = NEW_UNBANS_DESTINATION[index];
            if (dict.toUnbanID == id) {
                NEW_UNBANS_DESTINATION = NEW_UNBANS_DESTINATION.filter((item) => item !== dict);
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
