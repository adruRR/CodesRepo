const prisma = require("../db/client");

const getCategorias = async (req, res) => {
  try {
    const categorias = await prisma.categoria.findMany({
      include: { dificultad: true },
    });

    const resultado = categorias.map((c) => ({
      id: c.id,
      nombre: c.nombre,
      edad_min: c.edad_min,
      edad_max: c.edad_max,
      dificultad: c.dificultad.nombre,
    }));

    return res.json(resultado);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return res.status(500).json({ error: "Error al obtener categorías" });
  }
};

const getCategoriaPorId = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ error: "El ID es obligatorio" });
    }

    const categoria = await prisma.categoria.findUnique({
      where: { id },
      include: { dificultad: true },
    });

    if (!categoria) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    const resultado = {
      id: categoria.id,
      nombre: categoria.nombre,
      edad_min: categoria.edad_min,
      edad_max: categoria.edad_max,
      dificultad: categoria.dificultad.nombre,
    };

    return res.json(resultado);
  } catch (error) {
    console.error("Error al obtener categoría:", error);
    return res.status(500).json({ error: "Error al obtener la categoría" });
  }
};

const crearCategoria = async (req, res) => {
  try {
    const { nombre, edad_min, edad_max, dificultad_id } = req.body;

    if (!nombre || edad_min == null || edad_max == null || !dificultad_id) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    if (Number(edad_min) > Number(edad_max)) {
      return res
        .status(400)
        .json({ error: "edad_min no puede ser mayor que edad_max" });
    }

    const dificultad = await prisma.dificultad.findUnique({
      where: { id: Number(dificultad_id) },
    });

    if (!dificultad) {
      return res.status(404).json({ error: "La dificultad no existe" });
    }

    const categoriaExistente = await prisma.categoria.findFirst({
      where: {
        nombre,
        dificultad_id: Number(dificultad_id),
      },
    });

    if (categoriaExistente) {
      return res.status(409).json({
        error:
          "Ya existe una categoría con este nombre para la dificultad indicada",
      });
    }

    const nuevaCategoria = await prisma.categoria.create({
      data: {
        nombre,
        edad_min: Number(edad_min),
        edad_max: Number(edad_max),
        dificultad_id: Number(dificultad_id),
      },
    });

    return res.status(201).json({
      message: "Categoría creada correctamente",
      categoria: nuevaCategoria,
    });
  } catch (error) {
    console.error("Error al crear categoría:", error);
    return res.status(500).json({ error: "Error al crear la categoría" });
  }
};

const actualizarCategoria = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nombre, edad_min, edad_max, dificultad_id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "El ID es obligatorio" });
    }

    const categoria = await prisma.categoria.findUnique({ where: { id } });

    if (!categoria) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    if (edad_min != null && edad_max != null) {
      if (Number(edad_min) > Number(edad_max)) {
        return res
          .status(400)
          .json({ error: "edad_min no puede ser mayor que edad_max" });
      }
    }

    if (dificultad_id) {
      const dificultad = await prisma.dificultad.findUnique({
        where: { id: Number(dificultad_id) },
      });

      if (!dificultad) {
        return res
          .status(404)
          .json({ error: "La dificultad indicada no existe" });
      }
    }

    if (
      (nombre && nombre !== categoria.nombre) ||
      (dificultad_id && Number(dificultad_id) !== categoria.dificultad_id)
    ) {
      const existe = await prisma.categoria.findFirst({
        where: {
          nombre: nombre ?? categoria.nombre,
          dificultad_id: Number(dificultad_id ?? categoria.dificultad_id),
        },
      });

      if (existe) {
        return res.status(409).json({
          error: "Ya existe una categoría con ese nombre para esa dificultad",
        });
      }
    }

    const actualizada = await prisma.categoria.update({
      where: { id },
      data: {
        nombre: nombre ?? categoria.nombre,
        edad_min: edad_min != null ? Number(edad_min) : categoria.edad_min,
        edad_max: edad_max != null ? Number(edad_max) : categoria.edad_max,
        dificultad_id: dificultad_id
          ? Number(dificultad_id)
          : categoria.dificultad_id,
      },
    });

    return res.json({
      message: "Categoría actualizada correctamente",
      categoria: actualizada,
    });
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    return res.status(500).json({ error: "Error al actualizar la categoría" });
  }
};

const eliminarCategoria = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ error: "El ID es obligatorio" });
    }

    const categoria = await prisma.categoria.findUnique({ where: { id } });

    if (!categoria) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    await prisma.categoria.delete({ where: { id } });

    return res.json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar categoría:", error);

    if (error.code === "P2003") {
      return res.status(409).json({
        error:
          "No se puede eliminar esta categoría porque tiene preguntas asociadas",
      });
    }

    return res.status(500).json({ error: "Error al eliminar la categoría" });
  }
};

module.exports = {
  getCategorias,
  getCategoriaPorId,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
};
