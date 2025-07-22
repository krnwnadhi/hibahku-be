const util = require("util");
const multer = require("multer");
const path = require("path");

const maxSize = 5 * 1024 * 1024; //5MB

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__basedir, "/public/uploads"));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${path.extname(
                file.originalname
            )}`
        );
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
        req.pdfUploadError = "Hanya upload file berekstensi PDF!";
        cb(null, false);
    } else {
        cb(null, true);
    }
};

let uploadFile = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: maxSize },
}).fields([
    { name: "file_ktp" },
    { name: "file_rab" },
    { name: "file_proposal" },
    { name: "file_suket" },
    { name: "file_asetrekom" },
    { name: "file_suratpermohonan" },
    { name: "file_sk" },
    { name: "file_izinoperasional" },
    { name: "file_aktapendirian" },
    { name: "file_pengesahankemenkumham" },
]);

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
