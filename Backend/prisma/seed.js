const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

async function main() {
  // --------------ROLES----------------
  const rolesData = [
    { nombre: "Administrador" },
    { nombre: "Profesor" },
    { nombre: "Estudiante" },
  ];

  const roles = {};

  for (const rol of rolesData) {
    const r = await prisma.rol.upsert({
      where: { nombre: rol.nombre },
      update: {},
      create: rol,
    });
    roles[rol.nombre] = r;
  }

  console.log("Roles agregados.");

  // --------------USUARIOS----------------
  const usuariosData = [
    {
      nombre: "Admin Principal",
      correo: "admin@demo.com",
      contrasena: bcrypt.hashSync("admin123", 10),
      rol_id: roles["Administrador"].id,
    },
    {
      nombre: "Profesor Demo",
      correo: "profesor@demo.com",
      contrasena: bcrypt.hashSync("prof123", 10),
      rol_id: roles["Profesor"].id,
    },
    {
      nombre: "Estudiante Demo",
      correo: "estudiante@demo.com",
      contrasena: bcrypt.hashSync("est123", 10),
      rol_id: roles["Estudiante"].id,
    },
  ];

  for (const user of usuariosData) {
    await prisma.usuario.upsert({
      where: { correo: user.correo },
      update: {},
      create: user,
    });
  }

  console.log("Usuarios agregados.");

  // --------------DIFICULTADES----------------
  const dificultadesData = [
    { nombre: "facil" },
    { nombre: "medio" },
    { nombre: "dificil" },
  ];

  const dificultades = {};

  for (const dif of dificultadesData) {
    const d = await prisma.dificultad.upsert({
      where: { nombre: dif.nombre },
      update: {},
      create: dif,
    });
    dificultades[dif.nombre] = d;
  }

  console.log("Dificultades agregadas.");

  // --------------CATEGORÍAS----------------
  const categoriasData = [
    {
      nombre: "Juvenil",
      edad_min: 12,
      edad_max: 17,
      dificultad_id: dificultades["facil"].id,
    },
    {
      nombre: "Adulto",
      edad_min: 18,
      edad_max: 59,
      dificultad_id: dificultades["medio"].id,
    },
    {
      nombre: "Avanzado",
      edad_min: 18,
      edad_max: 50,
      dificultad_id: dificultades["dificil"].id,
    },
  ];

  for (const cat of categoriasData) {
    await prisma.categoria.upsert({
      where: { nombre: cat.nombre },
      update: {},
      create: cat,
    });
  }

  console.log("Categorías agregadas.");
}

main()
  .catch((error) => {
    console.error("Error ejecutando el seed:");
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
