const express = require("express");
const cekStatusRumahIbadah = require("../controllers/cekStatusRumahIbadahController");
const verifyToken = require("../middleware/verifyToken");

const cekStatusRumahIbadahRoute = express.Router();

cekStatusRumahIbadahRoute.post(
    "/",
    verifyToken,
    cekStatusRumahIbadah.cekStatus
);

module.exports = cekStatusRumahIbadahRoute;
