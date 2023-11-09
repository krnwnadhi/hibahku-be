const express = require("express");

const persetujuanController = require("../../controllers/admin/persetujuanController");
const verifyToken = require("../../middleware/verifyToken");
const { roleCheck } = require("../../middleware/roleCheck");

const persetujuanRoute = express.Router();

persetujuanRoute.post(
    "/persetujuan/:id",
    verifyToken,
    roleCheck,
    persetujuanController.persetujuan
);

persetujuanRoute.delete(
    "/persetujuan/:id",
    verifyToken,
    roleCheck,
    persetujuanController.hapuspermohonan
);

persetujuanRoute.get(
    "/persetujuan/:id",
    verifyToken,
    roleCheck,
    persetujuanController.detailpermohonan
);

persetujuanRoute.get(
    "/download/:fileName",
    verifyToken,
    roleCheck,
    persetujuanController.downloadfile
);

module.exports = persetujuanRoute;
