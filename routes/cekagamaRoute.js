const express = require("express");
const cekagamaRoute = express.Router(); // Use express.Router() to define a router
const cekagamaController = require("../controllers/cekagamaController");
const verifyToken = require("../middleware/verifyToken");

cekagamaRoute.post("/cekagamas", verifyToken, cekagamaController.cekagama);

module.exports = cekagamaRoute;
