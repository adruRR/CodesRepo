const router = require("express").Router();
const ctrl = require("../controllers/usuario.controller");

router.get("/", ctrl.getUsuarios);
router.get("/:id", ctrl.getUsuarioPorId);
router.post("/", ctrl.crearUsuario);
router.put("/:id", ctrl.actualizarUsuario);
router.delete("/:id", ctrl.eliminarUsuario);

module.exports = router;
