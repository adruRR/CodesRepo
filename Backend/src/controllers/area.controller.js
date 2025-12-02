const prisma = require("../db/client");

// Obtener todas las áreas
const getAreas = async (req, res) => {
  try {
    const areas = await prisma.area.findMany({
      include: { sub_areas: true },
    });

    const resultado = areas.map((a) => ({
      id: a.id,
      nombre: a.nombre,
      sub_areas: a.sub_areas.map(sa => sa.nombre),
    }));

    return res.json(resultado);
  } catch (error) {
    console.error("Error al obtener áreas:", error);
    return res.status(500).json({ error: "Error al obtener áreas" });
  }
};

// Obtener área por ID
const getAreaPorId = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "El ID es obligatorio" });

    const area = await prisma.area.findUnique({
      where: { id },
      include: { sub_areas: true },
    });

    if (!area) return res.status(404).json({ error: "Área no encontrada" });

    return res.json({
      id: area.id,
      nombre: area.nombre,
      sub_areas: area.sub_areas,
    });
  } catch (error) {
    console.error("Error al obtener área:", error);
    return res.status(500).json({ error: "Error al obtener el área" });
  }
};

// Crear área
const crearArea = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre)
      return res.status(400).json({ error: "El nombre es obligatorio" });

    const existe = await prisma.area.findUnique({ where: { nombre } });
    if (existe)
      return res.status(409).json({ error: "Ya existe un área con ese nombre" });

    const nuevaArea = await prisma.area.create({
      data: { nombre },
    });

    return res.status(201).json({
      message: "Área creada correctamente",
      area: nuevaArea,
    });
  } catch (error) {
    console.error("Error al crear área:", error);
    return res.status(500).json({ error: "Error al crear el área" });
  }
};

// Actualizar área
const actualizarArea = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nombre } = req.body;

    if (!id) return res.status(400).json({ error: "El ID es obligatorio" });

    const area = await prisma.area.findUnique({ where: { id } });
    if (!area) return res.status(404).json({ error: "Área no encontrada" });

    if (nombre && nombre !== area.nombre) {
      const existe = await prisma.area.findUnique({ where: { nombre } });
      if (existe)
        return res.status(409).json({ error: "Ya existe un área con ese nombre" });
    }

    const actualizada = await prisma.area.update({
      where: { id },
      data: { nombre: nombre ?? area.nombre },
    });

    return res.json({
      message: "Área actualizada correctamente",
      area: actualizada,
    });
  } catch (error) {
    console.error("Error al actualizar área:", error);
    return res.status(500).json({ error: "Error al actualizar el área" });
  }
};

// Eliminar área
const eliminarArea = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "El ID es obligatorio" });

    const area = await prisma.area.findUnique({ where: { id } });
    if (!area) return res.status(404).json({ error: "Área no encontrada" });

    await prisma.area.delete({ where: { id } });

    return res.json({ message: "Área eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar área:", error);

    if (error.code === "P2003") {
      return res.status(409).json({
        error: "No se puede eliminar el área porque tiene sub áreas asociadas",
      });
    }

    return res.status(500).json({ error: "Error al eliminar el área" });
  }
};

module.exports = {
  getAreas,
  getAreaPorId,
  crearArea,
  actualizarArea,
  eliminarArea,
};
