/*
    API Route which handles all ban-related endpoints.
    -> POST @ /api/remote/outbound/bans
    -> GET @ /api/remote/outbound/bans
    -> DELETE @ /api/remote/outbound/bans/<player-id>
*/

require("dotenv").config({ path: "src/data/.env" });

const APIRecords = require("./modules/APIRecords");

const rateLimit = require("express-rate-limit");
const limits = require("./modules/limits");

const BASE = "/api/remote";

let NEW_BANS_DESTINATION = [];

module.exports = (app) => {
    // Posts and registers a new ban to the endpoint.
    app.post(`${BASE}/outbound/bans`, rateLimit(limits.POST), (req, res) => {
        const body = req.body;

        await APIRecords.send({ type: "POST", endpoint: `${BASE}/outbound/bans`, payload: body.toString() }).catch(console.error);

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

        if (NEW_BANS_DESTINATION.some((el) => el.toBanID == body.toBanID)) {
            return res.status(409).send({
                status: "error",
                error: "Pending data already exists",
                statusCode: 409,
            });
        }

        NEW_BANS_DESTINATION.push(body);

        return res.status(201).send({
            status: "ok",
            statusCode: 201,
        });
    });

    // Gets and retrieves all new bans.
    app.get(`${BASE}/outbound/bans`, rateLimit(limits.DEFAULT), (_, res) => {
        const body = req.body;

        await APIRecords.send({ type: "GET", endpoint: `${BASE}/outbound/bans`, payload: body.toString() }).catch(console.error);

        return res.status(200).send({
            status: "ok",
            data: NEW_BANS_DESTINATION,
            statusCode: 200,
        });
    });

    // Deletes a specific pending ban.
    app.delete(`${BASE}/outbound/bans/:id`, rateLimit(limits.DEFAULT), (req, res) => {
        const { id } = req.params;
        const body = req.body;

        await APIRecords.send({ type: "DELETE", endpoint: `${BASE}/outbound/bans/${id}`, payload: body.toString() }).catch(console.error);

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
