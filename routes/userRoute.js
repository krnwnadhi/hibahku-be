const express = require("express");
const userRoute = express.Router(); // Use express.Router() to define a router
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken");
const { roleCheck } = require("../middleware/roleCheck");

userRoute.get("/getusers", verifyToken, roleCheck, userController.getusers);
userRoute.get(
    "/getusers/:id",
    verifyToken,
    roleCheck,
    userController.getUsersById
);

module.exports = userRoute;
