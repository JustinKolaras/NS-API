require("dotenv").config({ path: "src/data/.env" });

const express = require("express");

const app = express();
const PORT = 80;
const BASE = "/api/remote";

let NEW_BANS_DESTINATION = [];

app.use(express.json());

app.post(`${BASE}/outbound/bans`, (req, res) => {
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
            error: "Invalid payload syntax",
        });
    }

    NEW_BANS_DESTINATION.push(body);
    return res.status(201).send({
        status: "ok",
    });
});

app.get(`${BASE}/outbound/bans`, (req, res) => {
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

app.delete(`${BASE}/outbound/bans/:id`, (req, res) => {
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

    for (const index in NEW_BANS_DESTINATION) {
        const dict = NEW_BANS_DESTINATION[index];
        if (dict.toBanID == id) {
            NEW_BANS_DESTINATION = NEW_BANS_DESTINATION.filter((item) => item !== dict);
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

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
