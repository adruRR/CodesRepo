const express = require("express");
const app = express();
const { routerRoles } = require("./routes/rol.route");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hola Ingeniero!");
});

app.use("/roles", routerRoles);

module.exports = app;
