/*
    API Route which handles all shutdown-related endpoints.
    -> POST @ /api/remote/outbound/shutdowns
    -> GET @ /api/remote/outbound/shutdowns
    -> DELETE @ /api/remote/outbound/shutdowns
    -> DELETE @ /api/remote/outbound/shutdowns/<uuid>
*/

require("dotenv").config({ path: "src/data/.env" });

const uuid = require("uuid"); // UUIDs is a specific shutdown request's identifier

const rateLimit = require("express-rate-limit");
const limits = require("./modules/limits");

const BASE = "/api/remote";

let NEW_SDS_DESTINATION = [];

module.exports = (app) => {
    // Posts and registers a new shutdown to the endpoint.
    app.post(`${BASE}/outbound/shutdowns`, rateLimit(limits.POST), (req, res) => {
        const body = req.body;

        // Validate required fields
        if ((!body.reason, body.reason !== "") || typeof body.reason !== "string" || !body.executor || typeof body.executor !== "number") {
            return res.status(400).send({
                status: "error",
                error: "Invalid payload syntax",
                statusCode: 400,
            });
        }

        if (NEW_SDS_DESTINATION.length >= 1) {
            return res.status(409).send({
                status: "error",
                error: "Request already initiated",
                statusCode: 409,
            });
        }

        body["_ID"] = uuid.v4();
        NEW_SDS_DESTINATION.push(body);
        return res.status(201).send({
            status: "ok",
            statusCode: 201,
        });
    });

    // Gets and retrieves all new shutdowns.
    app.get(`${BASE}/outbound/shutdowns`, rateLimit(limits.DEFAULT), (_, res) => {
        return res.status(200).send({
            status: "ok",
            data: NEW_SDS_DESTINATION,
            statusCode: 200,
        });
    });

    // Deletes all pending shutdowns.
    app.delete(`${BASE}/outbound/shutdowns`, rateLimit(limits.DEFAULT), (_, res) => {
        NEW_SDS_DESTINATION = [];
        return res.status(200).send({
            status: "ok",
            statusCode: 200,
        });
    });

    // Deletes a specific pending shutdown.
    app.delete(`${BASE}/outbound/shutdowns/:id`, rateLimit(limits.DEFAULT), (req, res) => {
        const { id } = req.params;

        if (!uuid.validate(id) || !uuid.version(id) === 4) {
            return res.status(400).send({
                status: "error",
                error: "Invalid UUID",
                statusCode: 400,
            });
        }

        for (const index in NEW_SDS_DESTINATION) {
            const dict = NEW_SDS_DESTINATION[index];
            if (dict._ID == id) {
                NEW_SDS_DESTINATION = NEW_SDS_DESTINATION.filter((item) => item !== dict);
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
