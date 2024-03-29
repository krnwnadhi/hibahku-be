const express = require("express");

const persetujuanController = require("../controllers/persetujuanController");
const verifyToken = require("../middleware/verifyToken");
const { roleCheck } = require("../middleware/roleCheck");

const persetujuanRoute = express.Router();

persetujuanRoute.get(
    "/list",
    verifyToken,
    // roleCheck,
    persetujuanController.allPersetujuan
);

persetujuanRoute.get(
    "/detail/:id",
    verifyToken,
    roleCheck,
    persetujuanController.detailPersetujuanAdmin
);

persetujuanRoute.get(
    "/detail/user/:id",
    verifyToken,
    persetujuanController.detailPersetujuan
);

persetujuanRoute.post(
    "/:id",
    verifyToken,
    roleCheck,
    persetujuanController.approvePersetujuan
);

persetujuanRoute.get(
    "/download/:fileName",
    // verifyToken,
    // roleCheck,
    persetujuanController.downloadfile
);

persetujuanRoute.delete(
    "/:id",
    verifyToken,
    roleCheck,
    persetujuanController.hapusPersetujuan
);

module.exports = persetujuanRoute;
