const express = require("express");
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken");
const { roleCheck } = require("../middleware/roleCheck");

const userRoute = express.Router(); // Use express.Router() to define a router

userRoute.get("/getusers", verifyToken, roleCheck, userController.getUsers);

userRoute.get(
    "/getusers/:id",
    verifyToken,
    roleCheck,
    userController.getUsersById
);

module.exports = userRoute;
