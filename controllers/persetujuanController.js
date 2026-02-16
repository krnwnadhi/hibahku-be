const {
    Permohonan,
    Ktp,
    Rab,
    Proposal,
    Suket,
    Asetrekom,
    Suratpermohonan,
    Sk,
    Status,
    Keagamaan,
    Kategori,
    User,
    Proses,
    Izinoperasional,
    Aktapendirian,
    Pengesahankemenkumham,
    Norekening,
    Npwp,
    Suratdomisili,
    Suratpernyataankeabsahan,
    Suratpernyataantidakhibah,
    Suratrekomkemenag,
} = require("../models");

// const fs = require("fs").promises; // Module untuk menghapus file
const fs = require("fs"); // Module untuk menghapus file
const path = require("path");
const mime = require("mime-types");

const includeOptions = [
    { model: User, as: "User", attributes: ["nama", "notelpon", "nik"] },
    {
        model: Keagamaan,
        as: "Keagamaan",
        attributes: ["nama", "wilayah", "alamat", "id"],
        include: [
            { model: Kategori, as: "Kategori", attributes: ["id", "nama"] },
        ],
    },
    { model: Status, as: "Status", attributes: ["id", "nama"] },
    {
        model: Proses,
        as: "Proses",
        attributes: ["id", "nama", "keterangan", "updatedAt"],
    },
    { model: Ktp, as: "Ktp", attributes: ["namafile"] },
    { model: Rab, as: "Rab", attributes: ["namafile"] },
    { model: Proposal, as: "Proposal", attributes: ["namafile"] },
    { model: Suket, as: "Suket", attributes: ["namafile"] },
    { model: Asetrekom, as: "Asetrekom", attributes: ["namafile"] },
    { model: Suratpermohonan, as: "Suratpermohonan", attributes: ["namafile"] },
    { model: Sk, as: "Sk", attributes: ["namafile"] },
    { model: Izinoperasional, as: "Izinoperasional", attributes: ["namafile"] },
    { model: Aktapendirian, as: "Aktapendirian", attributes: ["namafile"] },
    {
        model: Pengesahankemenkumham,
        as: "Pengesahankemenkumham",
        attributes: ["namafile"],
    },
    {
        model: Norekening,
        as: "Norekening",
        attributes: ["namafile"],
    },
    {
        model: Suratdomisili,
        as: "Suratdomisili",
        attributes: ["namafile"],
    },
    {
        model: Npwp,
        as: "Npwp",
        attributes: ["namafile"],
    },
    {
        model: Suratpernyataankeabsahan,
        as: "Suratpernyataankeabsahan",
        attributes: ["namafile"],
    },
    {
        model: Suratpernyataantidakhibah,
        as: "Suratpernyataantidakhibah",
        attributes: ["namafile"],
    },
    {
        model: Suratrekomkemenag,
        as: "Suratrekomkemenag",
        attributes: ["namafile"],
    },
];

// APPROVAL MERUBAH STATUS
const approvePersetujuan = async (req, res) => {
    const { id, newStatus, newProses } = req.body;

    try {
        // Cari permohonan berdasarkan ID
        const dataPermohonan = await Permohonan.findByPk(id);

        if (!dataPermohonan) {
            return res
                .status(404)
                .json({ message: "Permohonan tidak ditemukan" });
        }

        // Lakukan pembaruan status dan keterangan
        if (newProses !== undefined) {
            dataPermohonan.prosesid = newProses;
            if (newProses === 10) dataPermohonan.statusid = 3;
            else if (newProses === 11) dataPermohonan.statusid = 2;
            else dataPermohonan.statusid = 1;
        } else {
            dataPermohonan.statusid = newStatus;
            if (newStatus === 1) dataPermohonan.prosesid = 1;
            else if (newStatus === 2) dataPermohonan.prosesid = 11;
            else if (newStatus === 3) dataPermohonan.prosesid = 10;
        }

        // Simpan perubahan ke dalam database
        await dataPermohonan.save();

        return res.status(200).json({
            message: "Data berhasil diperbarui!",
            data: dataPermohonan,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Gagal memperbarui data!",
            error: error?.message,
        });
    }
};

const allPersetujuan = async (req, res) => {
    try {
        const result = await Permohonan.findAll({
            include: includeOptions,
            order: [["createdAt", "DESC"]],
        });
        res.json({
            result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Gagal memuat data!" + error.message,
            error: error?.message,
        });
    }
};

//MENAMPILKAN PERMOHONAN BY ID USER
const detailPersetujuan = async (req, res) => {
    try {
        const permohonan = await Permohonan.findAll({
            where: {
                userid: req?.params?.id,
            },
            include: includeOptions,
        });

        if (!permohonan || permohonan.length === 0) {
            return res
                .status(404)
                .json({ message: "Data Permohonan Tidak Ditemukan" });
        }

        return res.status(200).json(permohonan);
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Gagal memuat detail permohonan!",
            error: error?.message,
        });
    }
};

//MENAMPILKAN PERMOHONAN BY ID
const detailPersetujuanAdmin = async (req, res) => {
    try {
        const permohonan = await Permohonan.findByPk(req?.params?.id, {
            include: includeOptions,
        });

        if (!permohonan || permohonan.length === 0) {
            return res
                .status(404)
                .json({ message: "Data Permohonan Tidak Ditemukan" });
        }

        return res.status(200).json([permohonan]);
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Gagal memuat detail permohonan!",
            error: error?.message,
        });
    }
};

// --- PREVIEW FILE ---
const previewFile = (req, res) => {
    // 1. Ambil fileName sesuai dengan nama di Route (:fileName)
    const { fileName } = req.params;

    // 2. Gunakan path absolut dari akar project (CWD)
    // Pastikan folder adalah 'public/uploads/' (sesuaikan jika folder Anda berbeda)
    const filePath = path.join(process.cwd(), "public", "uploads", fileName);

    // DEBUG: Cek di terminal backend apakah path ini sudah benar
    console.log("Mencari file di:", filePath);

    // 3. Cek fisik file
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({
            message: "File tidak ditemukan di server",
            debugPath: filePath, // Hapus ini jika sudah masuk tahap produksi
        });
    }

    // 4. Tentukan MIME Type
    const contentType = mime.lookup(filePath) || "application/pdf";

    // 5. Bersihkan header lama dan set header baru
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", "inline");

    // 6. Kirim file
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error("Error saat kirim file:", err);
            if (!res.headersSent) {
                res.status(500).json({ message: "Gagal memproses preview" });
            }
        }
    });
};

// --- DOWNLOAD FILE ---
const downloadfile = (req, res) => {
    const { fileName } = req.params;
    // Gunakan path.resolve juga di sini
    const filePath = path.resolve("public/uploads", fileName);

    res.download(filePath, fileName, (err) => {
        if (err) {
            if (!res.headersSent) {
                res.status(500).send({
                    status: false,
                    message: "Gagal mendownload file: " + err.message,
                });
            }
        }
    });
};

const hapusPersetujuan = async (req, res) => {
    const { id } = req.params;

    try {
        const permohonan = await Permohonan.findByPk(id, {
            include: includeOptions,
        });

        if (!permohonan) {
            return res
                .status(404)
                .json({ message: "Data permohonan tidak ditemukan" });
        }

        const fileModels = [
            permohonan.Ktp,
            permohonan.Rab,
            permohonan.Proposal,
            permohonan.Suket,
            permohonan.Asetrekom,
            permohonan.Suratpermohonan,
            permohonan.Sk,
            permohonan.Izinoperasional,
            permohonan.Aktapendirian,
            permohonan.Pengesahankemenkumham,
            permohonan.Norekening,
            permohonan.Npwp,
            permohonan.Suratdomisili,
            permohonan.Suratpernyataankeabsahan,
            permohonan.Suratpernyataantidakhibah,
            permohonan.Suratrekomkemenag,
        ];

        for (const file of fileModels) {
            if (file && file.path) {
                try {
                    await fs.unlink(file.path);
                    await file.destroy();
                } catch (error) {
                    console.error(`Gagal menghapus file: ${file.path}`, error);
                }
            }
        }

        await permohonan.destroy();

        res.status(200).json({
            message: "Data permohonan dan file-file terkait berhasil dihapus!",
        });
    } catch (error) {
        res.status(500).json({
            message: "Gagal menghapus data permohonan!",
            error: error.message,
        });
    }
};

module.exports = {
    approvePersetujuan,
    allPersetujuan,
    detailPersetujuanAdmin,
    detailPersetujuan,
    hapusPersetujuan,
    downloadfile,
    previewFile,
};
