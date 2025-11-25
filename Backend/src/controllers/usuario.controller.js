const prisma = require("../db/client");
const bcrypt = require("bcryptjs");

const getUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      include: { rol: true },
    });

    const resultado = usuarios.map((u) => ({
      id: u.id,
      nombre: u.nombre,
      correo: u.correo,
      rol: u.rol.nombre,
    }));

    return res.json(resultado);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

const getUsuarioPorId = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ error: "El ID es obligatorio" });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id },
      include: { rol: true },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const resultado = {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol.nombre,
    };

    return res.json(resultado);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return res.status(500).json({ error: "Error al obtener el usuario" });
  }
};

const crearUsuario = async (req, res) => {
  try {
    const { nombre, correo, contrasena, rol_id } = req.body;

    if (!nombre || !correo || !contrasena || !rol_id) {
      return res.status(400).json({
        error: "nombre, correo, contrasena y rol_id son obligatorios",
      });
    }

    const existeCorreo = await prisma.usuario.findUnique({
      where: { correo },
    });

    if (existeCorreo) {
      return res.status(409).json({ error: "El correo ya está registrado" });
    }

    const rolExiste = await prisma.rol.findUnique({
      where: { id: Number(rol_id) },
    });

    if (!rolExiste) {
      return res.status(400).json({ error: "El rol no existe" });
    }

    const hashed = await bcrypt.hash(contrasena, 10);

    const nuevo = await prisma.usuario.create({
      data: {
        nombre,
        correo,
        contrasena: hashed,
        rol_id: Number(rol_id),
      },
    });

    return res.status(201).json({
      message: "Usuario creado correctamente",
      usuario: {
        id: nuevo.id,
        nombre: nuevo.nombre,
        correo: nuevo.correo,
        rol_id: nuevo.rol_id,
      },
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return res.status(500).json({ error: "Error al crear el usuario" });
  }
};

const actualizarUsuario = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nombre, correo, contrasena, rol_id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "El ID es obligatorio" });
    }

    const usuario = await prisma.usuario.findUnique({ where: { id } });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (correo && correo !== usuario.correo) {
      const correoExiste = await prisma.usuario.findUnique({
        where: { correo },
      });

      if (correoExiste) {
        return res.status(409).json({ error: "El correo ya está registrado" });
      }
    }

    if (rol_id) {
      const rolExiste = await prisma.rol.findUnique({
        where: { id: Number(rol_id) },
      });

      if (!rolExiste) {
        return res.status(400).json({ error: "El rol no existe" });
      }
    }

    let nuevaContrasena = undefined;
    if (contrasena) {
      nuevaContrasena = await bcrypt.hash(contrasena, 10);
    }

    const actualizado = await prisma.usuario.update({
      where: { id },
      data: {
        nombre: nombre ?? usuario.nombre,
        correo: correo ?? usuario.correo,
        contrasena: nuevaContrasena ?? usuario.contrasena,
        rol_id: rol_id ? Number(rol_id) : usuario.rol_id,
      },
    });

    return res.json({
      message: "Usuario actualizado correctamente",
      usuario: {
        id: actualizado.id,
        nombre: actualizado.nombre,
        correo: actualizado.correo,
        rol_id: actualizado.rol_id,
      },
    });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return res.status(500).json({ error: "Error al actualizar el usuario" });
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ error: "El ID es obligatorio" });
    }

    const usuario = await prisma.usuario.findUnique({ where: { id } });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    await prisma.usuario.delete({ where: { id } });

    return res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);

    if (error.code === "P2003") {
      return res.status(409).json({
        error:
          "No se puede eliminar el usuario porque tiene registros asociados",
      });
    }

    return res.status(500).json({ error: "Error al eliminar el usuario" });
  }
};

module.exports = {
  getUsuarios,
  getUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
};
