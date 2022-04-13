/*
    API Route which handles all kick-related endpoints.
    -> POST @ /api/remote/outbound/kicks
    -> GET @ /api/remote/outbound/kicks
    -> DELETE @ /api/remote/outbound/kicks
    -> DELETE @ /api/remote/outbound/kicks/<player-id>
*/

require("dotenv").config({ path: "src/data/.env" });

const APIRecords = require("./modules/APIRecords");

const rateLimit = require("express-rate-limit");
const limits = require("./modules/limits");

const BASE = "/api/remote";

let NEW_KICKS_DESTINATION = [];

module.exports = (app) => {
    // Posts and registers a new kick to the endpoint.
    app.post(`${BASE}/outbound/kicks`, rateLimit(limits.POST), (req, res) => {
        const body = req.body;

        APIRecords.send({ type: "POST", endpoint: `${BASE}/outbound/kicks`, payload: JSON.stringify(body) }).catch(console.error);

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

        if (NEW_KICKS_DESTINATION.some((el) => el.toKickID == body.toKickID)) {
            return res.status(409).send({
                status: "error",
                error: "Pending data already exists",
                statusCode: 409,
            });
        }

        NEW_KICKS_DESTINATION.push(body);
        return res.status(201).send({
            status: "ok",
            statusCode: 201,
        });
    });

    // Gets and retrieves all new kicks.
    app.get(`${BASE}/outbound/kicks`, rateLimit(limits.DEFAULT), (req, res) => {
        const body = req.body;

        APIRecords.send({ type: "GET", endpoint: `${BASE}/outbound/kicks`, payload: JSON.stringify(body) }).catch(console.error);

        return res.status(200).send({
            status: "ok",
            data: NEW_KICKS_DESTINATION,
            statusCode: 200,
        });
    });

    // Deletes all pending kicks.
    app.delete(`${BASE}/outbound/kicks`, rateLimit(limits.DEFAULT), (req, res) => {
        const body = req.body;

        APIRecords.send({ type: "DELETE", endpoint: `${BASE}/outbound/kicks`, payload: JSON.stringify(body) }).catch(console.error);

        NEW_KICKS_DESTINATION = [];
        return res.status(200).send({
            status: "ok",
            statusCode: 200,
        });
    });

    // Deletes a specific pending kick.
    app.delete(`${BASE}/outbound/kicks/:id`, rateLimit(limits.DEFAULT), (req, res) => {
        const { id } = req.params;
        const body = req.body;

        APIRecords.send({ type: "DELETE", endpoint: `${BASE}/outbound/kicks/${id}`, payload: JSON.stringify(body) }).catch(console.error);

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
