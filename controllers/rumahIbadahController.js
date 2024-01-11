const { Op } = require("sequelize");
const { Keagamaan, Kategori } = require("../models");

// const { Sequelize } = require("sequelize");

const createRumahIbadah = async (req, res) => {
    try {
        const { id, nama, alamat, wilayah, kategoriid } = req?.body;

        if (!id || !nama || !alamat || !wilayah || !kategoriid) {
            return res.status(400).json({
                message: "Tidak boleh kosong",
            });
        }

        const existingRumahIbadah = await Keagamaan.findOne({
            where: { id: id },
        });

        if (existingRumahIbadah) {
            return res.status(404).json({
                message: "ID SIMAS/NSPP sudah terdaftar",
            });
        }

        const dataRumahIbadah = new Keagamaan({
            id: id,
            nama: nama,
            alamat: alamat,
            wilayah: wilayah,
            kategoriid: kategoriid,
        });

        const newDataRumahIbadah = await dataRumahIbadah.save();

        if (newDataRumahIbadah) {
            return res.status(201).json({
                message: "Data berhasil disimpan",
                data: newDataRumahIbadah,
            });
        } else {
            return res.status(500).json({ message: "Gagal menyimpan data" });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Terjadi kesalahan saat menyimpan data",
            error: error.message,
        });
    }
};

const listRumahIbadah = async (req, res) => {
    try {
        const result = await Keagamaan.findAll({
            include: [
                { model: Kategori, as: "Kategori", attributes: ["id", "nama"] },
            ],
            order: [["createdAt", "DESC"]],
        });

        res.json({
            result: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Gagal memuat data Rumah Ibadah." + error,
        });
    }
};

module.exports = {
    createRumahIbadah,
    listRumahIbadah,
};
