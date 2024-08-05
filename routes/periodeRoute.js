const express = require("express");
const periodeController = require("../controllers/periodeController");
const verifyToken = require("../middleware/verifyToken");
const { roleCheck } = require("../middleware/roleCheck");

const periodeRoute = express.Router();

periodeRoute.post("/", verifyToken, roleCheck, periodeController.verifyPeriode);

periodeRoute.get(
    "/",
    verifyToken,
    // roleCheck,
    periodeController.getPeriode
);

module.exports = periodeRoute;
