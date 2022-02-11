require("dotenv").config({ path: "src/data/.env" });

const ipFilter = require("express-ipfilter").IpFilter;

module.exports = (app) => {
    app.use(ipFilter([process.env.NS_UTIL_IP], { mode: "allow" }));
};
