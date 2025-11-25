const express = require("express");
const app = express();
const roleRoute = require('./routes/role.route');

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hola Ingeniero!");
});

app.use('/roles', roleRoute);

module.exports = app;