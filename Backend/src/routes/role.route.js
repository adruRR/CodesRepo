const express = require("express");
const routerRoles = express.Router();
const { get } = require("../controllers/role.controller");

routerRoles.get("/", get);

module.exports = { routerRoles };
