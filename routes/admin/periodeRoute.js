const express = require("express");
const periodeController = require("../../controllers/admin/periodeController");
const verifyToken = require("../../middleware/verifyToken");
const { roleCheck } = require("../../middleware/roleCheck");

const periodeRoute = express.Router();

periodeRoute.post(
    "/periodes",
    verifyToken,
    roleCheck,
    periodeController.verifyPeriode
);

module.exports = periodeRoute;
