require("dotenv").config({ path: "src/data/.env" });

const express = require("express");
const app = express();
const folder = "./api";

// Middlemen
require(folder + "/middleware/parseJSON")(express, app);
require(folder + "/middleware/rateLimitConfig")(app);
require(folder + "/middleware/ipFilter")(app);
require(folder + "/middleware/authorization")(app);

// API Routes
require(folder + "/ban")(app);
require(folder + "/kick")(app);
require(folder + "/unban")(app);

// Listener
app.listen(process.env.PORT, () => console.log(`Listening: ${process.env.PORT}`));
