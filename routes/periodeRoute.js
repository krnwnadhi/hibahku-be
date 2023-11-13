const express = require("express");
const periodeController = require("../controllers/periodeController");
const verifyToken = require("../middleware/verifyToken");
const { roleCheck } = require("../middleware/roleCheck");

const periodeRoute = express.Router();

periodeRoute.post("/", verifyToken, roleCheck, periodeController.verifyPeriode);

module.exports = periodeRoute;
