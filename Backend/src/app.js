const express = require("express");
const app = express();
const {
  rolesRouter,
  usuariosRouter,
  authRouter,
  dificultadesRouter,
  categoriasRouter,
  areasRouter,
  subAreasRouter,
} = require("./routes");

const { verificarToken, permitirRoles } = require("./middlewares/auth.middleware");

app.use(express.json());

app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Hola Ingeniero!");
});

// Rutas solo para Administrador
app.use("/roles", verificarToken, permitirRoles("Administrador"), rolesRouter);
app.use("/usuarios", verificarToken, permitirRoles("Administrador"), usuariosRouter);

// Rutas para Administrador y Profesor
app.use("/areas", verificarToken, permitirRoles("Administrador", "Profesor"), areasRouter);
app.use("/sub-areas", verificarToken, permitirRoles("Administrador", "Profesor"), subAreasRouter);

//Rutas para todos los roles 
app.use("/categorias", verificarToken, categoriasRouter);
app.use("/dificultades", verificarToken, dificultadesRouter);


module.exports = app;
