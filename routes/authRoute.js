const express = require("express");
const authController = require("../controllers/authController");
const verifyToken = require("../middleware/verifyToken");
const periodeCheck = require("../middleware/periodeCheck");

const authRoute = express.Router();

authRoute.post("/register", authController.register);

authRoute.post(
    "/login",
    // periodeCheck,
    authController.login,
);

authRoute.post("/logout", verifyToken, authController.logout);

module.exports = authRoute;
