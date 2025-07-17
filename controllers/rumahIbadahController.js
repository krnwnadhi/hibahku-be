const { Keagamaan, Kategori } = require("../models");

const createRumahIbadah = async (req, res) => {
    const { id, nama, alamat, wilayah, kategoriid } = req?.body;

    if (!id || !nama || !alamat || !wilayah || !kategoriid) {
        return res.status(400).json({
            message: "Tidak boleh kosong",
        });
    }

    try {
        const existingRumahIbadah = await Keagamaan.findByPk(id);

        if (existingRumahIbadah) {
            return res.status(404).json({
                message: "ID SIMAS/No. NSPP/NSM sudah terdaftar",
            });
        }

        const newDataRumahIbadah = await Keagamaan.create({
            id,
            nama,
            alamat,
            wilayah,
            kategoriid,
        });

        return res.status(201).json({
            message: "Data berhasil disimpan!",
            data: newDataRumahIbadah,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Terjadi kesalahan saat menyimpan data!",
            error: error?.message,
        });
    }
};

const listRumahIbadah = async (req, res) => {
    try {
        const result = await Keagamaan.findAll({
            include: [{ model: Kategori, as: "Kategori" }],
            order: [["createdAt", "DESC"]],
        });

        res.json({
            result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Gagal memuat data Rumah Ibadah!",
            error: error?.message,
        });
    }
};

module.exports = {
    createRumahIbadah,
    listRumahIbadah,
};
