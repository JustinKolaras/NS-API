require("dotenv").config({ path: "src/data/.env" });

const express = require("express");
const noblox = require("noblox.js");

const app = express();
const PORT = 3000;
const BASE_URL = "/NS/api/remote";

const NEW_BANS_DESTINATION = [];

app.use(express.json());

app.post(`${BASE_URL}/new-bans`, (req, res) => {
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
        !body.toBanID ||
        typeof body.toBanID !== "number" ||
        !body.reason ||
        typeof body.reason !== "string" ||
        !body.executor ||
        typeof body.executor !== "number"
    ) {
        return res.status(400).send({
            status: "error",
            error: "Invalid payload syntax.",
        });
    }

    /*
    try {
        noblox.getUsernameFromId(body.toBanID);
        noblox.getUsernameFromId(body.executor);
    } catch (err) {
        return res.status(400).send({
            status: "error",
            error: "Invalid toBanID or Executor.",
        });
    }
    */

    NEW_BANS_DESTINATION.push(body);
    return res.status(200).send({
        status: "ok",
    });
});

app.get(`${BASE_URL}/new-bans`, (req, res) => {
    const headers = req.headers;

    if (!headers.authorization || headers.authorization !== process.env.AUTHORIZATION_KEY) {
        return res.status(401).send({
            status: "error",
            error: "Unauthorized",
        });
    }

    return res.status(200).send({
        status: "ok",
        data: NEW_BANS_DESTINATION,
    });
});

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
