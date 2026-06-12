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
    Norekening,
} = require("../models");
const fs = require("fs").promises; // Use the promise-based version of fs

// --- CONFIGURATION ---
// Memudahkan pengelolaan jika ada perubahan model atau field
const FILE_MAP = [
    { key: "file_ktp", model: Ktp, field: "ktpid" },
    { key: "file_rab", model: Rab, field: "rabid" },
    { key: "file_suket", model: Suket, field: "suketid" },
    { key: "file_sk", model: Sk, field: "skid" },
    { key: "file_proposal", model: Proposal, field: "proposalid" },
    {
        key: "file_suratpermohonan",
        model: Suratpermohonan,
        field: "suratpermohonanid",
    },
    { key: "file_asetrekom", model: Asetrekom, field: "asetrekomid" },
    {
        key: "file_izinoperasional",
        model: Izinoperasional,
        field: "izinoperasionalid",
    },
    {
        key: "file_aktapendirian",
        model: Aktapendirian,
        field: "aktapendirianid",
    },
    {
        key: "file_pengesahankemenkumham",
        model: Pengesahankemenkumham,
        field: "pengesahankemenkumhamid",
    },
    { key: "file_npwp", model: Npwp, field: "npwpid" },
    {
        key: "file_suratdomisili",
        model: Suratdomisili,
        field: "suratdomisiliid",
    },
    {
        key: "file_suratpernyataankeabsahan",
        model: Suratpernyataankeabsahan,
        field: "suratpernyataankeabsahanid",
    },
    {
        key: "file_suratpernyataantidakhibah",
        model: Suratpernyataantidakhibah,
        field: "suratpernyataantidakhibahid",
    },
    {
        key: "file_suratrekomkemenag",
        model: Suratrekomkemenag,
        field: "suratrekomkemenagid",
    },
    { key: "file_norekening", model: Norekening, field: "norekeningid" },
];

// --- HELPERS ---
const saveFile = async (file, Model) => {
    if (!file?.[0]) return null;
    return Model.create({
        namafile: file[0].filename,
        size: file[0].size,
        path: file[0].path,
    });
};

// const deleteUploadedFiles = async (filesObject) => {
//     const files = Object.values(filesObject || {})
//         .flat()
//         .filter(Boolean);
//     if (files.length === 0) return;
//     try {
//         await Promise.all(files.map((f) => fs.unlink(f.path)));
//     } catch (err) {
//         console.error("Gagal hapus file:", err);
//     }
// };

const deleteUploadedFiles = async (filesObject) => {
    // TAMBAHKAN VALIDASI INI:
    // Jika filesObject tidak ada (null/undefined), langsung kembalikan (return)
    if (!filesObject) return;

    // Gunakan Object.values dengan aman
    const filesToDelete = Object.values(filesObject).flat().filter(Boolean);

    if (filesToDelete.length === 0) return;

    const paths = filesToDelete.map((file) => file.path);
    try {
        await Promise.all(paths.map((path) => fs.unlink(path)));
        console.log("Cleaned up uploaded files successfully.");
    } catch (error) {
        console.error("Error deleting one or more files:", error);
    }
};

// const saveFile = async (file, Model) => {
//     if (file && file.length > 0) {
//         return Model.create({
//             namafile: file[0].filename,
//             size: file[0].size,
//             path: file[0].path,
//         });
//     }
//     return null;
// };

// // Helper to delete physical files asynchronously
// const deleteUploadedFiles = async (filesObject) => {
//     const filesToDelete = Object.values(filesObject).flat().filter(Boolean);
//     if (filesToDelete.length === 0) return;

//     const paths = filesToDelete.map((file) => file.path);
//     try {
//         await Promise.all(paths.map((path) => fs.unlink(path)));
//         console.log("Cleaned up uploaded files successfully.");
//     } catch (error) {
//         console.error("Error deleting one or more files:", error);
//         return res.status(500).json({
//             status: false,
//             message: "Gagal menghapus data!",
//             error: error?.message,
//         });
//     }
// };

// const permohonan = async (req, res) => {
//     const { body, files, user } = req;
//     const { keagamaanid } = body;

//     try {
//         const existingKeagamaan = await Keagamaan.findByPk(keagamaanid);
//         if (!existingKeagamaan) {
//             await deleteUploadedFiles(files);
//             return res
//                 .status(404)
//                 .json({ message: "ID SIMAS/NSM/NSPP tidak terdaftar!" });
//         }

//         const existingPermohonan = await Permohonan.findOne({
//             where: { keagamaanid },
//             order: [["createdAt", "DESC"]],
//         });

//         if (existingPermohonan) {
//             // 1. Dapatkan tahun saat ini dan tahun permohonan terakhir secara langsung.
//             const currentYear = new Date().getFullYear();
//             const lastSubmissionYear = new Date(
//                 existingPermohonan.createdAt,
//             ).getFullYear();

//             // 2. Hitung tahun di mana pengajuan berikutnya diizinkan (tahun terakhir + 2).
//             const nextAvailableYear = lastSubmissionYear + 2;

//             // 3. Cek apakah tahun ini masih kurang dari tahun yang diizinkan.
//             if (currentYear < nextAvailableYear) {
//                 await deleteUploadedFiles(files);

//                 // 4. Berikan pesan error yang jelas kapan bisa mengajukan lagi.
//                 return res.status(403).json({
//                     message: `Anda sudah pernah mengajukan permohonan pada tahun ${lastSubmissionYear}. Anda baru bisa mengajukan permohonan kembali mulai 1 Januari ${nextAvailableYear}.`,
//                 });
//             }
//         }

//         const [
//             ktp,
//             rab,
//             suket,
//             sk,
//             proposal,
//             suratpermohonan,
//             asetrekom,
//             izinoperasional,
//             aktapendirian,
//             pengesahankemenkumham,
//             npwp,
//             suratdomisili,
//             suratpernyataankeabsahan,
//             suratpernyataantidakhibah,
//             suratrekomkemenag,
//             norekening,
//         ] = await Promise.all([
//             saveFile(files.file_ktp, Ktp),
//             saveFile(files.file_rab, Rab),
//             saveFile(files.file_suket, Suket),
//             saveFile(files.file_sk, Sk),
//             saveFile(files.file_proposal, Proposal),
//             saveFile(files.file_suratpermohonan, Suratpermohonan),
//             saveFile(files.file_asetrekom, Asetrekom),
//             saveFile(files.file_izinoperasional, Izinoperasional),
//             saveFile(files.file_aktapendirian, Aktapendirian),
//             saveFile(files.file_pengesahankemenkumham, Pengesahankemenkumham),
//             saveFile(files.file_npwp, Npwp),
//             saveFile(files.file_suratdomisili, Suratdomisili),
//             saveFile(
//                 files.file_suratpernyataankeabsahan,
//                 Suratpernyataankeabsahan,
//             ),
//             saveFile(
//                 files.file_suratpernyataantidakhibah,
//                 Suratpernyataantidakhibah,
//             ),
//             saveFile(files.file_suratrekomkemenag, Suratrekomkemenag),
//             saveFile(files.file_norekening, Norekening),
//         ]);

//         const permohonanData = await Permohonan.create({
//             ...body,
//             ktpid: ktp?.id,
//             rabid: rab?.id,
//             suketid: suket?.id,
//             skid: sk?.id,
//             proposalid: proposal?.id,
//             suratpermohonanid: suratpermohonan?.id,
//             asetrekomid: asetrekom?.id,
//             izinoperasionalid: izinoperasional?.id,
//             aktapendirianid: aktapendirian?.id,
//             pengesahankemenkumhamid: pengesahankemenkumham?.id,
//             npwpid: npwp?.id,
//             suratdomisiliid: suratdomisili?.id,
//             suratpernyataankeabsahanid: suratpernyataankeabsahan?.id,
//             suratpernyataantidakhibahid: suratpernyataantidakhibah?.id,
//             suratrekomkemenagid: suratrekomkemenag?.id,
//             norekeningid: norekening?.id,
//             statusid: 3,
//             prosesid: 10,
//             userid: user.nik,
//         });

//         return res.status(201).json({
//             message: "Permohonan berhasil",
//             data: permohonanData,
//         });
//     } catch (error) {
//         console.log(error);

//         await deleteUploadedFiles(files);

//         if (error.code == "LIMIT_FILE_SIZE") {
//             console.log(error);
//             return res.status(500).send({
//                 message: "Ukuran file harus dibawah 5MB!",
//             });
//         }

//         return res.status(500).json({
//             status: false,
//             message: "Gagal menyimpan permohonan!",
//             error: error?.message,
//         });
//     }
// };

// --- CONTROLLERS ---

// 1. CREATE
const permohonan = async (req, res) => {
    const { keagamaanid } = req.body;
    const { files, user } = req;

    try {
        const existingKeagamaan = await Keagamaan.findByPk(keagamaanid);
        if (!existingKeagamaan) {
            await deleteUploadedFiles(files);
            return res
                .status(404)
                .json({ message: "ID SIMAS/NSM/NSPP tidak terdaftar!" });
        }

        // Cek batasan waktu (2 tahun)
        const last = await Permohonan.findOne({
            where: { keagamaanid },
            order: [["createdAt", "DESC"]],
        });
        if (last) {
            const currentYear = new Date().getFullYear();
            const lastYear = new Date(last.createdAt).getFullYear();
            if (currentYear < lastYear + 2) {
                await deleteUploadedFiles(files);
                return res.status(403).json({
                    message: `Maaf, Anda sudah pernah mengajukan permohonan pada tahun ${lastYear}. Anda baru bisa mengajukan kembali pada tahun ${lastYear + 2}. Hubungi Biro Kesra Prov Jambi untuk informasi lebih lanjut.`,
                });
            }
        }

        // Simpan semua file secara dinamis
        const fileRecords = {};
        await Promise.all(
            FILE_MAP.map(async (item) => {
                const saved = await saveFile(files[item.key], item.model);
                if (saved) fileRecords[item.field] = saved.id;
            }),
        );

        const data = await Permohonan.create({
            ...req.body,
            ...fileRecords,
            statusid: 3,
            prosesid: 10,
            userid: user.nik,
        });

        res.status(201).json({ message: "Permohonan berhasil", data });
    } catch (error) {
        await deleteUploadedFiles(files);
        res.status(500).json({
            message: "Gagal menyimpan permohonan!",
            error: error.message,
        });
    }
};

// 2. READ (ALL) - Hanya milik user
const getAllPermohonan = async (req, res) => {
    try {
        const data = await Permohonan.findAll({
            where: { userid: req.user.nik },
        });
        res.json({ data });
    } catch (err) {
        res.status(500).json({ message: "Gagal mengambil data." });
    }
};

// 3. READ (ONE) - Detail milik user
const getPermohonanById = async (req, res) => {
    try {
        const data = await Permohonan.findOne({
            where: { id: req.params.id, userid: req.user.nik },
        });
        if (!data)
            return res.status(404).json({ message: "Data tidak ditemukan." });
        res.json({ data });
    } catch (err) {
        res.status(500).json({ message: "Gagal mengambil data." });
    }
};

// 4. UPDATE - Hanya bisa update jika milik user
const updatePermohonan = async (req, res) => {
    // try {node -v
    //     const permohonan = await Permohonan.findOne({
    //         where: { id: req.params.id, userid: req.user.nik },
    //     });
    //     if (!permohonan)
    //         return res.status(404).json({
    //             message: "Data tidak ditemukan atau bukan milik Anda.",
    //         });

    //     await permohonan.update(req.body);
    //     res.json({ message: "Data berhasil diupdate", data: permohonan });
    // } catch (err) {
    //     res.status(500).json({ message: "Gagal update data." });
    // }

    const { id } = req.params;
    const { user } = req;

    // PERBAIKAN: Pastikan files selalu menjadi objek, meskipun undefined
    const files = req.files || {};

    // --- TAMBAHKAN INI UNTUK DEBUGGING ---
    console.log(
        "Kunci yang diharapkan:",
        FILE_MAP.map((m) => m.key),
    );
    console.log("Kunci yang diterima di req.files:", Object.keys(files));
    // -------------------------------------

    try {
        // 1. Cari data permohonan milik user
        const permohonan = await Permohonan.findOne({
            where: { id, userid: String(user.nik) },
        });
        if (!permohonan)
            return res.status(404).json({ message: "Data tidak ditemukan." });

        const updateData = {};

        // 2. Loop melalui FILE_MAP untuk cek file yang diupload
        for (const item of FILE_MAP) {
            if (files[item.key] && files[item.key].length > 0) {
                console.log(`Memproses file untuk: ${item.key}`);
                const oldFileId = permohonan[item.field]; // Ambil ID file lama (misal: ktpid)

                if (oldFileId) {
                    // Cari record file lama
                    const oldFileRecord = await item.model.findByPk(oldFileId);

                    if (oldFileRecord && oldFileRecord.path) {
                        try {
                            // Hapus fisik file
                            await fs.unlink(oldFileRecord.path);
                            // Hapus record di database file terkait
                            await oldFileRecord.destroy();
                        } catch (err) {
                            console.error(
                                `Gagal menghapus file lama di ${oldFileRecord.path}:`,
                                err,
                            );
                            // Tetap lanjutkan meskipun file fisik mungkin sudah tidak ada
                        }
                    }
                }

                // 3. Simpan file baru
                const saved = await saveFile(files[item.key], item.model);
                console.log(
                    `File ${item.key} berhasil disimpan. ID Baru:`,
                    saved?.id,
                );

                if (saved && saved.id) {
                    updateData[item.field] = saved.id;
                } else {
                    console.error(
                        `Gagal mendapatkan ID untuk file: ${item.key}`,
                    );
                }
            }
        }

        // 4. Update data lain (jika ada text field di req.body)
        // Pastikan hanya update field yang bukan file
        const bodyData = { ...req.body };
        // Hapus key yang berkaitan dengan file jika ada di body agar tidak menimpa file
        FILE_MAP.forEach((item) => delete bodyData[item.field]);

        // Cek apakah ada perubahan yang akan dilakukan
        const isUpdatingFiles = Object.keys(updateData).length > 0;
        const isUpdatingBody = Object.keys(bodyData).length > 0;

        if (!isUpdatingFiles && !isUpdatingBody) {
            return res.status(400).json({
                message:
                    "Tidak ada data atau file yang dikirim untuk diupdate.",
            });
        }

        await permohonan.update({ ...bodyData, ...updateData });

        return res.json({
            message: "Data dan dokumen berhasil diperbarui",
            data: permohonan,
        });
    } catch (error) {
        // // Cleanup file baru jika terjadi error di tengah proses
        // await deleteUploadedFiles(files);
        // res.status(500).json({
        //     message: "Gagal memperbarui data.",
        //     error: error.message,
        // });

        // // Tambahkan kondisi: hanya hapus jika files itu ada
        // if (req.files) {
        //     await deleteUploadedFiles(req.files);
        // }

        // res.status(500).json({
        //     message: "Gagal memperbarui data.",
        //     error: error.message,
        // });

        // PERBAIKAN: Pastikan files ada sebelum dikirim ke deleteUploadedFiles
        if (files && Object.keys(files).length > 0) {
            await deleteUploadedFiles(files);
        }
        res.status(500).json({
            message: "Gagal memperbarui data.",
            error: error.message,
        });
    }
};

// 5. DELETE - Hanya bisa hapus jika milik user
const deletePermohonan = async (req, res) => {
    try {
        const permohonan = await Permohonan.findOne({
            where: { id: req.params.id, userid: req.user.nik },
        });
        if (!permohonan)
            return res.status(404).json({
                message: "Data tidak ditemukan atau bukan milik Anda.",
            });

        await permohonan.destroy();
        res.json({ message: "Permohonan berhasil dihapus." });
    } catch (err) {
        res.status(500).json({ message: "Gagal menghapus data." });
    }
};

module.exports = {
    permohonan,
    getAllPermohonan,
    getPermohonanById,
    updatePermohonan,
    deletePermohonan,
};
