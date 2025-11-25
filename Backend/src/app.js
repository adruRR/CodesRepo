const express = require("express");
const app = express();
const {
  rolesRouter,
  usuariosRouter,
  dificultadesRouter,
  categoriasRouter,
} = require("./routes");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hola Ingeniero!");
});

app.use("/roles", rolesRouter);
app.use("/usuarios", usuariosRouter);
app.use("/dificultades", dificultadesRouter);
app.use("/categorias", categoriasRouter);

module.exports = app;
