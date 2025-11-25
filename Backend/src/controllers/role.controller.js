const prisma = require("../db/client");

const get = async (req, res) => {
  const roles = await prisma.role.findMany();
  return res.json(roles);
};

const getById = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    throw Error("El ID es obligatorio.");
  }
  const role = await prisma.role.findUnique({
    where: { id: Number(id) },
  });
  return res.json(role);
};

module.exports = {
  get,
  getById,
};
