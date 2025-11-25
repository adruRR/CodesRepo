const express = require("express");
const router = express.Router();
const {
  getCategorias,
  getCategoriaPorId,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} = require("../controllers/categoria.controller");

router.get("/", getCategorias);
router.get("/:id", getCategoriaPorId);
router.post("/", crearCategoria);
router.put("/:id", actualizarCategoria);
router.delete("/:id", eliminarCategoria);

module.exports = router;
