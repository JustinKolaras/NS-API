/*
    API Route which allows for Roblox > Discord communication via webhooks.
    -> POST @ /api/remote/proxy/discord
*/

require("dotenv").config({ path: "src/data/.env" });

const rateLimit = require("express-rate-limit");
const limits = require("./modules/limits");
const axios = require("axios");

const BASE = "/api/remote";

module.exports = (app) => {
    // Sends a webhook request to Discord.
    app.post(`${BASE}/proxy/discord`, rateLimit(limits.POST), (req, res) => {
        const body = req.body;
        console.log(body);

        // Validate required fields
        if (!body.webhookURL || typeof body.webhookURL !== "string" || !body.webhookURL.includes("https://discord.com/api/webhooks/") || !body.webhookPayload) {
            return res.status(400).send({
                status: "error",
                errorStatus: "internal",
                error: "Invalid payload syntax",
                statusCode: 400,
            });
        }

        try {
            axios.post(body.webhookURL, body.webhookPayload);
        } catch (err) {
            const response = err.response;
            return res.status(response.status).send({
                status: "error",
                errorStatus: "external",
                stringError: err.toString(),
                errorData: response.data,
                statusCode: response.status,
            });
        }

        return res.status(200).send({
            status: "ok",
            statusCode: 200,
        });
    });
};
