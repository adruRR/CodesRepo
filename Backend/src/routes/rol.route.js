const express = require("express");
const router = express.Router();
const {
  getRoles,
  getRolPorId,
  actualizarRol,
  crearRol,
  eliminarRol,
} = require("../controllers/rol.controller");

router.get("/", getRoles);
router.get("/:id", getRolPorId);
router.post("/", crearRol);
router.put("/:id", actualizarRol);
router.delete("/:id", eliminarRol);

module.exports = router;
