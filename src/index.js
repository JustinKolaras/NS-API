require("dotenv").config({ path: "src/data/.env" });

const express = require("express");
const app = express();
const folder = "./api";

console.log(`Port: ${process.env.PORT}`);
console.log(`Auth: ${process.env.AUTHORIZATION_KEY}`);
console.log(`Base Appension: ${process.env.BASE_APPENSION}`);

// Middlemen
require(folder + "/middlemen/parseJSON")(express, app);

// API Routes
require(folder + "/ban")(app);

// Listener
app.listen(process.env.PORT, () => console.log(`Listening: ${process.env.PORT}`));
