const express = require("express");
const agamaController = require("../controllers/agamaController");
const verifyToken = require("../middleware/verifyToken");
const { roleCheck } = require("../middleware/roleCheck");

const agamaRoute = express.Router();

agamaRoute.get("/list", verifyToken, roleCheck, agamaController.agamas);
agamaRoute.post("/", verifyToken, agamaController.registagama);

module.exports = agamaRoute;
