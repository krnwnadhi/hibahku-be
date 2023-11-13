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
    const page = parseInt(req?.query?.page) || 0;
    const limit = parseInt(req?.query?.limit) || 10;
    const search = req?.query?.nama || "";

    const offset = limit * page;

    const totalRows = await Keagamaan.count({
        where: {
            nama: {
                [Op.like]: `%${search}%`,
            },
        },
    });

    const totalPage = Math.ceil(totalRows / limit);

    try {
        const data = await Keagamaan.findAll({
            where: {
                nama: {
                    [Op.like]: `%${search}%`,
                },
            },
            include: [
                { model: Kategori, as: "Kategori", attributes: ["id", "nama"] },
            ],
            offset: offset,
            limit: limit,
            order: [["createdAt", "DESC"]],
        });

        res.json({
            success: true,
            data: data,
            page: page + 1,
            limit: limit,
            totalItems: totalRows,
            totalPage: totalPage,
            hasMore: data.length >= limit ? true : false,
        });
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
