const express = require("express");
const routerRoles = express.Router();
const {
  getRoles,
  getRolPorId,
  actualizarRol,
  crearRol,
  eliminarRol,
} = require("../controllers/rol.controller");

routerRoles.get("/", getRoles);
routerRoles.get("/:id", getRolPorId);
routerRoles.post("/", crearRol);
routerRoles.put("/:id", actualizarRol);
routerRoles.delete("/:id", eliminarRol);

module.exports = { routerRoles };
