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
            return res.status(409).json({
                message: "ID Rumah Ibadah sudah terdaftar",
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
            return res
                .status(201)
                .json({ message: "Data Rumah Ibadah berhasil disimpan" });
        } else {
            return res
                .status(500)
                .json({ message: "Gagal menyimpan data Rumah Ibadah" });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Terjadi kesalahan saat menyimpan data Rumah Ibadah",
            error: error.message,
        });
    }
};

const listRumahIbadah = async (req, res) => {
    try {
        const page = req?.query?.page ? parseInt(req.query.page) : 1; // Mendapatkan nomor halaman dari query parameter
        const limit = req?.query?.limit ? parseInt(req.query.limit) : 10; // Mendapatkan batas data per halaman dari query parameter

        const offset = (page - 1) * limit; // Menghitung offset data

        const allRumahIbadah = await Keagamaan.findAndCountAll({
            include: [
                { model: Kategori, as: "Kategori", attributes: ["nama"] },
            ],
            limit,
            offset,
        });

        const dataRumahIbadah = allRumahIbadah.rows.map((keagamaan) => ({
            id: keagamaan.id,
            nama: keagamaan.nama,
            alamat: keagamaan.alamat,
            wilayah: keagamaan.wilayah,
            kategori: {
                id: keagamaan.kategoriid,
                nama: keagamaan.Kategori.nama,
            },
        }));

        if (allRumahIbadah.count === 0) {
            return res
                .status(200)
                .json({ success: true, data: "Data rumah ibadah tidak ada" });
        }

        return res
            .status(200)
            .json({ success: true, data: dataRumahIbadah, limit, offset });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Gagal memuat data Rumah Ibadah",
        });
    }
};

module.exports = {
    createRumahIbadah,
    listRumahIbadah,
};
