const express = require("express");
const agamaController = require("../controllers/agamaController");
const verifyToken = require("../middleware/verifyToken");
const { roleCheck } = require("../middleware/roleCheck");

const agamaRoute = express.Router();

agamaRoute.post("/keagamaans", verifyToken, agamaController.registagama);
agamaRoute.get("/keagamaans", verifyToken, roleCheck, agamaController.agamas);

module.exports = agamaRoute;
