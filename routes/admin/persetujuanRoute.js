const express = require("express");

const persetujuanController = require("../../controllers/admin/persetujuanController");
const verifyToken = require("../../middleware/verifyToken");
const { roleCheck } = require("../../middleware/roleCheck");

const persetujuanRoute = express.Router();

persetujuanRoute.get(
    "/list",
    verifyToken,
    roleCheck
    // persetujuanController.allPersetujuan
);

persetujuanRoute.post(
    "/persetujuan/:id",
    verifyToken,
    roleCheck,
    persetujuanController.createPersetujuan
);

persetujuanRoute.delete(
    "/persetujuan/:id",
    verifyToken,
    roleCheck,
    persetujuanController.hapusPersetujuan
);

persetujuanRoute.get(
    "/persetujuan/:id",
    verifyToken,
    roleCheck,
    persetujuanController.detailPersetujuan
);

persetujuanRoute.get(
    "/download/:fileName",
    verifyToken,
    roleCheck,
    persetujuanController.downloadfile
);

module.exports = persetujuanRoute;
