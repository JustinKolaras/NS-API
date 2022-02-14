/*
    @api
    Entry

    Registers all API routes and middleware, project entry point.
*/

require("dotenv").config({ path: "src/data/.env" });

const express = require("express");
const app = express();
const folder = "./api";
const middlewareFolder = folder + "/middleware";

// Middleware
require(middlewareFolder + "/authConfig")(app);
require(middlewareFolder + "/parseJSON")(express, app);

// API Routes
require(folder + "/ban")(app);
require(folder + "/kick")(app);
require(folder + "/unban")(app);

// Listener
app.listen(process.env.PORT, () => console.log(`Listening: ${process.env.PORT}`));
