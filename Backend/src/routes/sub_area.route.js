const express = require("express");
const router = express.Router();
const {
  getSubAreas,
  getSubAreaPorId,
  crearSubArea,
  actualizarSubArea,
  eliminarSubArea,
} = require("../controllers/sub_area.controller");

router.get("/", getSubAreas);
router.get("/:id", getSubAreaPorId);
router.post("/", crearSubArea);
router.put("/:id", actualizarSubArea);
router.delete("/:id", eliminarSubArea);

module.exports = router;
