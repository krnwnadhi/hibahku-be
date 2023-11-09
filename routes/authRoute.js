const express = require("express");
const authRoute = express.Router();
const authController = require("../controllers/authController");
const verifyToken = require("../middleware/verifyToken");
const periodeCheck = require("../middleware/periodeCheck");

authRoute.post("/login", periodeCheck, authController.login);
authRoute.post("/logout", verifyToken, authController.logout);

module.exports = authRoute;
