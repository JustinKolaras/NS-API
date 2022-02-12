/*
    A middleware which automatically converts to JSON format.
*/

module.exports = (express, app) => {
    app.use(express.json());
};
