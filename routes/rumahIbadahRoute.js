const express = require("express");
const rumahIbadahController = require("../controllers/rumahIbadahController");
const verifyToken = require("../middleware/verifyToken");
const { roleCheck } = require("../middleware/roleCheck");

const rumahIbadah = express.Router();

rumahIbadah.get(
    "/list",
    verifyToken,
    roleCheck,
    rumahIbadahController.listRumahIbadah
);

rumahIbadah.post(
    "/create",
    verifyToken,
    rumahIbadahController.createRumahIbadah
);

module.exports = rumahIbadah;
