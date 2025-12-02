const prisma = require("../db/client");

// Obtener sub áreas
const getSubAreas = async (req, res) => {
  try {
    const subAreas = await prisma.subArea.findMany({
      include: { area: true },
    });

    const resultado = subAreas.map((sa) => ({
      id: sa.id,
      nombre: sa.nombre,
      area: sa.area.nombre,
    }));

    return res.json(resultado);
  } catch (error) {
    console.error("Error al obtener sub áreas:", error);
    return res.status(500).json({ error: "Error al obtener sub áreas" });
  }
};

// Obtener sub área por ID
const getSubAreaPorId = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) return res.status(400).json({ error: "El ID es obligatorio" });

    const subArea = await prisma.subArea.findUnique({
      where: { id },
      include: { area: true },
    });

    if (!subArea)
      return res.status(404).json({ error: "Sub área no encontrada" });

    return res.json({
      id: subArea.id,
      nombre: subArea.nombre,
      area: subArea.area.nombre,
    });
  } catch (error) {
    console.error("Error al obtener sub área:", error);
    return res.status(500).json({ error: "Error al obtener sub área" });
  }
};

// Crear sub área
const crearSubArea = async (req, res) => {
  try {
    const { nombre, area_id } = req.body;

    if (!nombre || !area_id) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const area = await prisma.area.findUnique({ where: { id: Number(area_id) } });
    if (!area)
      return res.status(404).json({ error: "El área indicada no existe" });

    const existente = await prisma.subArea.findFirst({
      where: { nombre, area_id: Number(area_id) },
    });

    if (existente) {
      return res.status(409).json({
        error: "Ya existe una subárea con ese nombre en esta área",
      });
    }

    const nueva = await prisma.subArea.create({
      data: {
        nombre,
        area_id: Number(area_id),
      },
    });

    return res.status(201).json({
      message: "Sub área creada correctamente",
      sub_area: nueva,
    });
  } catch (error) {
    console.error("Error al crear sub área:", error);
    return res.status(500).json({ error: "Error al crear sub área" });
  }
};

// Actualizar sub área
const actualizarSubArea = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nombre, area_id } = req.body;

    if (!id) return res.status(400).json({ error: "El ID es obligatorio" });

    const subArea = await prisma.subArea.findUnique({ where: { id } });
    if (!subArea)
      return res.status(404).json({ error: "Sub área no encontrada" });

    if (area_id) {
      const area = await prisma.area.findUnique({
        where: { id: Number(area_id) },
      });
      if (!area)
        return res.status(404).json({ error: "El área indicada no existe" });
    }

    const existe = await prisma.subArea.findFirst({
      where: {
        nombre: nombre ?? subArea.nombre,
        area_id: Number(area_id ?? subArea.area_id),
      },
    });

    if (existe && existe.id !== id) {
      return res.status(409).json({
        error: "Ya existe una sub área con ese nombre en esta área",
      });
    }

    const actualizada = await prisma.subArea.update({
      where: { id },
      data: {
        nombre: nombre ?? subArea.nombre,
        area_id: area_id ? Number(area_id) : subArea.area_id,
      },
    });

    return res.json({
      message: "Sub área actualizada correctamente",
      sub_area: actualizada,
    });
  } catch (error) {
    console.error("Error al actualizar sub área:", error);
    return res.status(500).json({ error: "Error al actualizar sub área" });
  }
};

// Eliminar sub área
const eliminarSubArea = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) return res.status(400).json({ error: "El ID es obligatorio" });

    const subArea = await prisma.subArea.findUnique({ where: { id } });
    if (!subArea)
      return res.status(404).json({ error: "Sub área no encontrada" });

    await prisma.subArea.delete({ where: { id } });

    return res.json({ message: "Sub área eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar sub área:", error);

    if (error.code === "P2003") {
      return res.status(409).json({
        error: "No se puede eliminar la sub área porque tiene exámenes asociados",
      });
    }

    return res.status(500).json({ error: "Error al eliminar sub área" });
  }
};

module.exports = {
  getSubAreas,
  getSubAreaPorId,
  crearSubArea,
  actualizarSubArea,
  eliminarSubArea,
};
