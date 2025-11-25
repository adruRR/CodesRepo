const prisma = require("../db/client");

const getRoles = async (req, res) => {
  try {
    const roles = await prisma.rol.findMany();
    return res.json(roles);
  } catch (error) {
    console.error("Error al obtener roles:", error);
    return res.status(500).json({ error: "Error al obtener roles" });
  }
};

const getRolPorId = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ error: "El ID es obligatorio" });
    }

    const rol = await prisma.rol.findUnique({ where: { id } });

    if (!rol) {
      return res.status(404).json({ error: "Rol no encontrado" });
    }

    return res.json(rol);
  } catch (error) {
    console.error("Error al obtener el rol:", error);
    return res.status(500).json({ error: "Error al obtener el rol" });
  }
};

const crearRol = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }

    const existe = await prisma.rol.findUnique({
      where: { nombre },
    });

    if (existe) {
      return res.status(409).json({ error: "Ya existe un rol con ese nombre" });
    }

    const nuevo = await prisma.rol.create({
      data: { nombre },
    });

    return res.status(201).json(nuevo);
  } catch (error) {
    console.error("Error al crear el rol:", error);
    return res.status(500).json({ error: "Error al crear el rol" });
  }
};

const actualizarRol = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nombre } = req.body;

    if (!id) {
      return res.status(400).json({ error: "El ID es obligatorio" });
    }

    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }

    const existe = await prisma.rol.findUnique({ where: { id } });

    if (!existe) {
      return res.status(404).json({ error: "Rol no encontrado" });
    }

    const actualizado = await prisma.rol.update({
      where: { id },
      data: { nombre },
    });

    return res.json(actualizado);
  } catch (error) {
    console.error("Error al actualizar el rol:", error);
    return res.status(500).json({ error: "Error al actualizar el rol" });
  }
};

const eliminarRol = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ error: "El ID es obligatorio" });
    }

    const existe = await prisma.rol.findUnique({ where: { id } });

    if (!existe) {
      return res.status(404).json({ error: "Rol no encontrado" });
    }

    await prisma.rol.delete({
      where: { id },
    });

    return res.json({ message: "Rol eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el rol:", error);

    if (error.code === "P2003") {
      return res.status(409).json({
        error: "No se puede eliminar el rol porque tiene usuarios asociados",
      });
    }

    return res.status(500).json({ error: "Error al eliminar el rol" });
  }
};

module.exports = {
  getRoles,
  getRolPorId,
  crearRol,
  actualizarRol,
  eliminarRol,
};
