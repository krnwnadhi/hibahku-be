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
    Npwp,
    Suratdomisili,
    Suratpernyataankeabsahan,
    Suratpernyataantidakhibah,
    Suratrekomkemenag,
} = require("../models");
const fs = require("fs").promises; // Use the promise-based version of fs

const saveFile = async (file, Model) => {
    if (file && file.length > 0) {
        return Model.create({
            namafile: file[0].filename,
            size: file[0].size,
            path: file[0].path,
        });
    }
    return null;
};

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
    const { keagamaanid } = body;

    try {
        const existingKeagamaan = await Keagamaan.findByPk(keagamaanid);
        if (!existingKeagamaan) {
            await deleteUploadedFiles(files);
            return res
                .status(404)
                .json({ message: "ID SIMAS/NSM/NSPP tidak terdaftar!" });
        }

        const existingPermohonan = await Permohonan.findOne({
            where: { keagamaanid },
            order: [["createdAt", "DESC"]],
        });

        if (existingPermohonan) {
            // 1. Dapatkan tahun saat ini dan tahun permohonan terakhir secara langsung.
            const currentYear = new Date().getFullYear();
            const lastSubmissionYear = new Date(
                existingPermohonan.createdAt,
            ).getFullYear();

            // 2. Hitung tahun di mana pengajuan berikutnya diizinkan (tahun terakhir + 2).
            const nextAvailableYear = lastSubmissionYear + 2;

            // 3. Cek apakah tahun ini masih kurang dari tahun yang diizinkan.
            if (currentYear < nextAvailableYear) {
                await deleteUploadedFiles(files);

                // 4. Berikan pesan error yang jelas kapan bisa mengajukan lagi.
                return res.status(403).json({
                    message: `Anda sudah pernah mengajukan permohonan pada tahun ${lastSubmissionYear}. Anda baru bisa mengajukan permohonan kembali mulai 1 Januari ${nextAvailableYear}.`,
                });
            }
        }

        const [
            ktp,
            rab,
            suket,
            sk,
            proposal,
            suratpermohonan,
            asetrekom,
            izinoperasional,
            aktapendirian,
            pengesahankemenkumham,
            npwp,
            suratdomisili,
            suratpernyataankeabsahan,
            suratpernyataantidakhibah,
            suratrekomkemenag,
        ] = await Promise.all([
            saveFile(files.file_ktp, Ktp),
            saveFile(files.file_rab, Rab),
            saveFile(files.file_suket, Suket),
            saveFile(files.file_sk, Sk),
            saveFile(files.file_proposal, Proposal),
            saveFile(files.file_suratpermohonan, Suratpermohonan),
            saveFile(files.file_asetrekom, Asetrekom),
            saveFile(files.file_izinoperasional, Izinoperasional),
            saveFile(files.file_aktapendirian, Aktapendirian),
            saveFile(files.file_pengesahankemenkumham, Pengesahankemenkumham),
            saveFile(files.file_npwp, Npwp),
            saveFile(files.file_suratdomisili, Suratdomisili),
            saveFile(
                files.file_suratpernyataankeabsahan,
                Suratpernyataankeabsahan,
            ),
            saveFile(
                files.file_suratpernyataantidakhibah,
                Suratpernyataantidakhibah,
            ),
            saveFile(files.file_suratrekomkemenag, Suratrekomkemenag),
        ]);

        const permohonanData = await Permohonan.create({
            ...body,
            ktpid: ktp?.id,
            rabid: rab?.id,
            suketid: suket?.id,
            skid: sk?.id,
            proposalid: proposal?.id,
            suratpermohonanid: suratpermohonan?.id,
            asetrekomid: asetrekom?.id,
            izinoperasionalid: izinoperasional?.id,
            aktapendirianid: aktapendirian?.id,
            pengesahankemenkumhamid: pengesahankemenkumham?.id,
            npwpid: npwp?.id,
            suratdomisiliid: suratdomisili?.id,
            suratpernyataankeabsahanid: suratpernyataankeabsahan?.id,
            suratpernyataantidakhibahid: suratpernyataantidakhibah?.id,
            suratrekomkemenagid: suratrekomkemenag?.id,
            statusid: 3,
            prosesid: 10,
            userid: user.nik,
        });

        return res.status(201).json({
            message: "Permohonan berhasil",
            data: permohonanData,
        });
    } catch (error) {
        console.log(error);

        await deleteUploadedFiles(files);

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
