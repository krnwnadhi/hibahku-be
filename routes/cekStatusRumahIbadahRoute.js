const express = require("express");
const cekStatusRumahIbadah = require("../controllers/cekStatusRumahIbadahController");
const verifyToken = require("../middleware/verifyToken");
const periodeCheck = require("../middleware/periodeCheck");

const cekStatusRumahIbadahRoute = express.Router();

cekStatusRumahIbadahRoute.post(
    "/",
    verifyToken,
    // periodeCheck,
    cekStatusRumahIbadah.cekStatus,
);

module.exports = cekStatusRumahIbadahRoute;
