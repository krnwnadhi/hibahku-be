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
const fs = require("fs");

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

// Fungsi untuk menghapus file terunggah
const deleteUploadedFiles = async (files) => {
    files.forEach(async (file) => {
        if (file && file.length > 0) {
            const filePath = file[0].path;
            try {
                fs.unlinkSync(filePath); // Menghapus file
            } catch (error) {
                return res.status(500).json({
                    status: false,
                    message: "Gagal menghapus data!",
                    error: error?.message,
                });
            }
        }
    });
};

const permohonan = async (req, res) => {
    const { body, files, user } = req;

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

    const keagamaanID = body.keagamaanid;
    const existingKeagamaan = await Keagamaan.findByPk(keagamaanID);

    if (!existingKeagamaan) {
        return res
            .status(404)
            .json({ message: "ID SIMAS/NSM/NSPP tidak terdaftar" });
    }

    const existingPermohonan = await Permohonan.findOne({
        where: { keagamaanid: keagamaanID },
        order: [["createdAt", "DESC"]],
    });

    if (existingPermohonan) {
        const currentDate = new Date();
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(currentDate.getFullYear() - 2);

        if (existingPermohonan.createdAt > twoYearsAgo) {
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
            return res.status(403).json({
                message: `ID Rumah Ibadah/No. NSPP/NSM Lembaga Keagamaan : (${existingPermohonan?.keagamaanid}) telah mengajukan permohonan dalam dua tahun terakhir. Silakan mengajukan permohonan lagi setelah 2 tahun. Terima Kasih!`,
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
