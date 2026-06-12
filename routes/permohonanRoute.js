const express = require("express");
const path = require("path");
const permohonanController = require("../controllers/permohonanController");
const verifyToken = require("../middleware/verifyToken");
const multer = require("multer");
const bodyparser = require("body-parser");
const fs = require("fs");
const uploadFileMiddleware = require("../middleware/uploadFile");

const permohonanRoute = express();

permohonanRoute.use(bodyparser.json());
permohonanRoute.use(bodyparser.urlencoded({ extended: true }));
permohonanRoute.use(express.static("public"));

// // Setting up the route to handle POST requests
// permohonanRoute.post(
//     "/uploads",
//     uploadFileMiddleware,
//     verifyToken,
//     permohonanController.permohonan,
// );

// module.exports = permohonanRoute;

// --- ROUTES ---

// CREATE: Mengajukan permohonan baru
// Gunakan verifyToken di awal agar user tidak perlu upload file jika tidak terautentikasi
permohonanRoute.post(
    "/uploads",
    verifyToken,
    uploadFileMiddleware,
    permohonanController.permohonan,
);

// READ (ALL): Mendapatkan semua permohonan milik user yang sedang login
permohonanRoute.get("/", verifyToken, permohonanController.getAllPermohonan);

// READ (ONE): Mendapatkan detail permohonan berdasarkan ID
permohonanRoute.get(
    "/:id",
    verifyToken,
    permohonanController.getPermohonanById,
);

// UPDATE: Mengubah data permohonan
permohonanRoute.patch(
    "/:id",
    verifyToken,
    uploadFileMiddleware,
    permohonanController.updatePermohonan,
);

// DELETE: Menghapus permohonan
permohonanRoute.delete(
    "/:id",
    verifyToken,
    permohonanController.deletePermohonan,
);

module.exports = permohonanRoute;
