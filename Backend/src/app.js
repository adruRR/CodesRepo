const express = require("express");
const app = express();
const { rolesRouter, usuariosRouter } = require("./routes");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hola Ingeniero!");
});

app.use("/roles", rolesRouter);
app.use("/usuarios", usuariosRouter);

module.exports = app;
