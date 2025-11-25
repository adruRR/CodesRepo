const express = require("express");
const router = express.Router();
const {
  getDificultades,
  getDificultadPorId,
  crearDificultad,
  actualizarDificultad,
  eliminarDificultad,
} = require("../controllers/dificultad.controller");

router.get("/", getDificultades);
router.get("/:id", getDificultadPorId);
router.post("/", crearDificultad);
router.put("/:id", actualizarDificultad);
router.delete("/:id", eliminarDificultad);

module.exports = router;
