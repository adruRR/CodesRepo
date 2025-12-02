const express = require("express");
const router = express.Router();
const {
  getAreas,
  getAreaPorId,
  crearArea,
  actualizarArea,
  eliminarArea,
} = require("../controllers/area.controller");

router.get("/", getAreas);
router.get("/:id", getAreaPorId);
router.post("/", crearArea);
router.put("/:id", actualizarArea);
router.delete("/:id", eliminarArea);

module.exports = router;
