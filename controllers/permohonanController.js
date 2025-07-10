const {
    Keagamaan,
    Permohonan,
    Ktp,
    Proposal,
    Asetrekom,
    Rab,
    Sk,
    Suket,
    Suratpermohonan,
    Izinoperasional,
    Aktapendirian,
    Pengesahankemenkumham,
} = require("../models");
// const fs = require("fs");
const fs = require("fs").promises; // Use the promise-based version of fs

// Fungsi untuk menyimpan file
const saveFile = async (file, Model) => {
    try {
        if (file && file.length > 0) {
            const fileData = new Model({
                namafile: file[0].filename,
                size: file[0].size,
                path: file[0].path,
            });
            const saved = await fileData.save();
            return saved || null; // Mengembalikan null jika penyimpanan gagal
        }
    } catch (error) {
        console.error("Error saving file:", error);
        // return res.status(500).json({
        //     status: false,
        //     message: "Gagal menyimpan data!",
        //     error: error?.message,
        // });
        return null;
    }
};

// // Fungsi untuk menghapus file terunggah
// const deleteUploadedFiles = async (files) => {
//     files.forEach(async (file) => {
//         if (file && file.length > 0) {
//             const filePath = file[0].path;
//             try {
//                 fs.unlinkSync(filePath); // Menghapus file
//             } catch (error) {
//                 return res.status(500).json({
//                     status: false,
//                     message: "Gagal menghapus data!",
//                     error: error?.message,
//                 });
//             }
//         }
//     });
// };

// const deleteUploadedFiles = async (files) => {
//     // Filter out any undefined or empty file arrays
//     const filePaths = files
//         .filter((f) => f && f.length > 0)
//         .map((f) => f[0].path);

//     // Concurrently delete all files and wait for them to finish
//     try {
//         await Promise.all(filePaths.map((path) => fs.unlink(path)));
//     } catch (error) {
//         // Log the error but let the controller handle the response
//         console.error("Error deleting one or more files:", error);
//         return res.status(500).json({
//             status: false,
//             message: "Gagal menghapus data!",
//             error: error?.message,
//         });
//     }
// };

// Helper to delete physical files asynchronously
const deleteUploadedFiles = async (filesObject) => {
    const filesToDelete = Object.values(filesObject).flat().filter(Boolean);
    if (filesToDelete.length === 0) return;

    const paths = filesToDelete.map((file) => file.path);
    try {
        await Promise.all(paths.map((path) => fs.unlink(path)));
        console.log("Cleaned up uploaded files successfully.");
    } catch (error) {
        console.error("Error deleting one or more files:", error);
        return res.status(500).json({
            status: false,
            message: "Gagal menghapus data!",
            error: error?.message,
        });
    }
};

const permohonan = async (req, res) => {
    const { body, files, user } = req;
    const keagamaanID = body.keagamaanid;

    const {
        file_ktp,
        file_rab,
        file_suket,
        file_sk,
        file_suratpermohonan,
        file_asetrekom,
        file_proposal,
        file_izinoperasional,
        file_aktapendirian,
        file_pengesahankemenkumham,
    } = files;

    const existingKeagamaan = await Keagamaan.findByPk(keagamaanID);

    if (!existingKeagamaan) {
        return res
            .status(404)
            .json({ message: "ID SIMAS/NSM/NSPP tidak terdaftar!" });
    }

    const existingPermohonan = await Permohonan.findOne({
        where: { keagamaanid: keagamaanID },
        order: [["createdAt", "DESC"]],
    });

    if (existingPermohonan) {
        // 1. Dapatkan tahun saat ini dan tahun permohonan terakhir secara langsung.
        const currentYear = new Date().getFullYear();
        const lastSubmissionYear = new Date(
            existingPermohonan.createdAt
        ).getFullYear();

        // 2. Hitung tahun di mana pengajuan berikutnya diizinkan (tahun terakhir + 2).
        const nextAvailableYear = lastSubmissionYear + 2;

        // 3. Cek apakah tahun ini masih kurang dari tahun yang diizinkan.
        if (currentYear < nextAvailableYear) {
            // Hapus file yang sudah terlanjur di-upload karena validasi gagal.
            await deleteUploadedFiles([
                file_ktp,
                file_rab,
                file_suket,
                file_sk,
                file_proposal,
                file_suratpermohonan,
                file_asetrekom,
                file_izinoperasional,
                file_aktapendirian,
                file_pengesahankemenkumham,
            ]);

            // 4. Berikan pesan error yang jelas kapan bisa mengajukan lagi.
            return res.status(403).json({
                message: `Anda sudah pernah mengajukan permohonan pada tahun ${lastSubmissionYear}. Anda baru bisa mengajukan permohonan kembali mulai 1 Januari ${nextAvailableYear}.`,
            });
        }
    }

    try {
        const savedFiles = await Promise.all([
            saveFile(file_ktp, Ktp),
            saveFile(file_rab, Rab),
            saveFile(file_suket, Suket),
            saveFile(file_sk, Sk),
            saveFile(file_proposal, Proposal),
            saveFile(file_suratpermohonan, Suratpermohonan),
            saveFile(file_asetrekom, Asetrekom),
            saveFile(file_izinoperasional, Izinoperasional),
            saveFile(file_aktapendirian, Aktapendirian),
            saveFile(file_pengesahankemenkumham, Pengesahankemenkumham),
        ]);

        // console.log("savedFiles: ", savedFiles);

        const permohonanData = new Permohonan({
            keagamaanid: body.keagamaanid,
            pengajuandana: body.pengajuandana,
            tujuan: body.tujuan,
            norek: body.norek,
            ktpid: savedFiles[0].id,
            rabid: savedFiles[1].id,
            suketid: savedFiles[2]?.id,
            skid: savedFiles[3].id,
            proposalid: savedFiles[4].id,
            suratpermohonanid: savedFiles[5].id,
            asetrekomid: savedFiles[6]?.id,
            izinoperasionalid: savedFiles[7]?.id,
            aktapendirianid: savedFiles[8]?.id,
            pengesahankemenkumhamid: savedFiles[9]?.id,
            statusid: 3,
            prosesid: 10,
            userid: user.nik,
        });

        await permohonanData.save();

        // if (req.file == undefined) {
        //     return res.status(400).send({
        //         message: "Mohon upload semua file dokumen yang diperlukan!",
        //     });
        // }

        return res.status(201).json({
            message: "Permohonan berhasil",
            permohonanData: permohonanData,
        });
    } catch (error) {
        console.log(error);
        // If an error occurs during the database save, delete the uploaded files
        await deleteUploadedFiles([
            file_ktp,
            file_rab,
            file_suket,
            file_sk,
            file_proposal,
            file_suratpermohonan,
            file_asetrekom,
            file_izinoperasional,
            file_aktapendirian,
            file_pengesahankemenkumham,
        ]);

        if (error.code == "LIMIT_FILE_SIZE") {
            console.log(error);
            return res.status(500).send({
                message: "Ukuran file harus dibawah 5MB!",
            });
        }

        return res.status(500).json({
            status: false,
            message: "Gagal menyimpan permohonan!",
            error: error?.message,
        });
    }
};

module.exports = {
    permohonan,
};
