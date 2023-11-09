const express = require("express");
const userRoute = express.Router(); // Use express.Router() to define a router
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken");
const { roleCheck } = require("../middleware/roleCheck");

userRoute.post("/users", userController.register);
userRoute.get("/users", verifyToken, roleCheck, userController.getusers);

module.exports = userRoute;
