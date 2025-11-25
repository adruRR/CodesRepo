const prisma = require("../db/client");

const getDificultades = async (req, res) => {
  try {
    const dificultades = await prisma.dificultad.findMany();

    return res.json(dificultades);
  } catch (error) {
    console.error("Error al obtener dificultades:", error);
    return res.status(500).json({ error: "Error al obtener dificultades" });
  }
};

const getDificultadPorId = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ error: "El ID es obligatorio" });
    }

    const dificultad = await prisma.dificultad.findUnique({
      where: { id },
    });

    if (!dificultad) {
      return res.status(404).json({ error: "Dificultad no encontrada" });
    }

    return res.json(dificultad);
  } catch (error) {
    console.error("Error al obtener dificultad:", error);
    return res.status(500).json({ error: "Error al obtener la dificultad" });
  }
};

const crearDificultad = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }

    const existe = await prisma.dificultad.findUnique({
      where: { nombre },
    });

    if (existe) {
      return res.status(409).json({ error: "La dificultad ya existe" });
    }

    const nueva = await prisma.dificultad.create({
      data: { nombre },
    });

    return res.status(201).json({
      message: "Dificultad creada correctamente",
      dificultad: nueva,
    });
  } catch (error) {
    console.error("Error al crear dificultad:", error);
    return res.status(500).json({ error: "Error al crear la dificultad" });
  }
};

const actualizarDificultad = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nombre } = req.body;

    if (!id) {
      return res.status(400).json({ error: "El ID es obligatorio" });
    }

    const dificultad = await prisma.dificultad.findUnique({ where: { id } });

    if (!dificultad) {
      return res.status(404).json({ error: "Dificultad no encontrada" });
    }

    if (nombre && nombre !== dificultad.nombre) {
      const existeNombre = await prisma.dificultad.findUnique({
        where: { nombre },
      });

      if (existeNombre) {
        return res
          .status(409)
          .json({ error: "Ya existe una dificultad con ese nombre" });
      }
    }

    const actualizada = await prisma.dificultad.update({
      where: { id },
      data: {
        nombre: nombre ?? dificultad.nombre,
      },
    });

    return res.json({
      message: "Dificultad actualizada correctamente",
      dificultad: actualizada,
    });
  } catch (error) {
    console.error("Error al actualizar dificultad:", error);
    return res.status(500).json({ error: "Error al actualizar la dificultad" });
  }
};

const eliminarDificultad = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ error: "El ID es obligatorio" });
    }

    const dificultad = await prisma.dificultad.findUnique({ where: { id } });

    if (!dificultad) {
      return res.status(404).json({ error: "Dificultad no encontrada" });
    }

    await prisma.dificultad.delete({ where: { id } });

    return res.json({ message: "Dificultad eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar dificultad:", error);

    if (error.code === "P2003") {
      return res.status(409).json({
        error:
          "No se puede eliminar esta dificultad porque tiene categorías asociadas",
      });
    }

    return res.status(500).json({ error: "Error al eliminar la dificultad" });
  }
};

module.exports = {
  getDificultades,
  getDificultadPorId,
  crearDificultad,
  actualizarDificultad,
  eliminarDificultad,
};
