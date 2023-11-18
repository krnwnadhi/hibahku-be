const {
    Permohonan,
    Ktp,
    Rab,
    Proposal,
    Suket,
    Burek,
    Asetrekom,
    Suratpermohonan,
    Sk,
    Status,
    Keagamaan,
    Kategori,
    User,
    Proses,
} = require("../models");
const { Op } = require("sequelize");

const path = require("path");
const fs = require("fs"); // Module untuk menghapus file

// APPROVAL MERUBAH STATUS
const approvePersetujuan = async (req, res) => {
    const { id, newStatus } = req.body;

    try {
        // Cari permohonan berdasarkan ID
        const existingPermohonan = await Permohonan.findByPk(id);

        if (!existingPermohonan) {
            return res
                .status(404)
                .json({ message: "Permohonan tidak ditemukan" });
        }

        // Lakukan pembaruan status dan keterangan
        existingPermohonan.statusid = newStatus;
        if (newStatus === 2) {
            existingPermohonan.prosesid = 10;
        } else if (newStatus === 1) {
            existingPermohonan.prosesid = 1;
        }

        // Simpan perubahan ke dalam database
        await existingPermohonan.save();

        return res.status(200).json({
            success: true,
            message: "Data permohonan berhasil diperbarui",
            data: existingPermohonan,
        });
    } catch (error) {
        console.error("Error:", error);

        // Catat pesan kesalahan ke dalam log
        // Sebaiknya disesuaikan dengan cara Anda melakukan logging
        // Contoh penggunaan log:
        // logger.error('Gagal memperbarui data permohonan', error);

        return res
            .status(500)
            .json({ message: "Gagal memperbarui data permohonan" });
    }
};

const allPersetujuan = async (req, res) => {
    const page = parseInt(req?.query?.page) || 0;
    const limit = parseInt(req?.query?.limit) || 10;
    const search = req?.query?.keagamaanid || "";

    const offset = limit * page;

    const totalRows = await Permohonan.count({
        where: {
            keagamaanid: {
                [Op.like]: `%${search}%`,
            },
        },
    });

    const totalPage = Math.ceil(totalRows / limit);

    try {
        const data = await Permohonan.findAll({
            where: {
                keagamaanid: {
                    [Op.like]: `%${search}%`,
                },
            },
            include: [
                { model: User, as: "User", attributes: ["nama", "notelpon"] },
                {
                    model: Keagamaan,
                    as: "Keagamaan",
                    attributes: ["nama", "wilayah", "alamat"],
                    include: [
                        {
                            model: Kategori,
                            as: "Kategori",
                            attributes: ["id", "nama"],
                        },
                    ],
                },
                {
                    model: Status,
                    as: "Status",
                    attributes: ["id", "nama"],
                },
                {
                    model: Proses,
                    as: "Proses",
                    attributes: ["id", "nama", "keterangan"],
                },
                { model: Ktp, as: "Ktp", attributes: ["namafile"] },
                { model: Suket, as: "Suket", attributes: ["namafile"] },
                {
                    model: Suratpermohonan,
                    as: "Suratpermohonan",
                    attributes: ["namafile"],
                },
                { model: Sk, as: "Sk", attributes: ["namafile"] },
                { model: Proposal, as: "Proposal", attributes: ["namafile"] },
                { model: Burek, as: "Burek", attributes: ["namafile"] },
                { model: Asetrekom, as: "Asetrekom", attributes: ["namafile"] },
                { model: Rab, as: "Rab", attributes: ["namafile"] },
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

//MENAMPILKAN PERMOHONAN BY ID
const detailPersetujuan = async (req, res) => {
    const permohonanId = req?.params?.id;

    try {
        const permohonan = await Permohonan.findByPk(permohonanId, {
            include: [
                { model: User, as: "User", attributes: ["nama", "notelpon"] },
                {
                    model: Keagamaan,
                    as: "Keagamaan",
                    attributes: ["nama", "wilayah", "alamat"],
                    include: [
                        {
                            model: Kategori,
                            as: "Kategori",
                            attributes: ["id", "nama"],
                        },
                    ],
                },
                {
                    model: Status,
                    as: "Status",
                    attributes: ["id", "nama"],
                },
                {
                    model: Proses,
                    as: "Proses",
                    attributes: ["id", "nama", "keterangan"],
                },
                { model: Ktp, as: "Ktp", attributes: ["namafile"] },
                { model: Suket, as: "Suket", attributes: ["namafile"] },
                {
                    model: Suratpermohonan,
                    as: "Suratpermohonan",
                    attributes: ["namafile"],
                },
                { model: Sk, as: "Sk", attributes: ["namafile"] },
                { model: Proposal, as: "Proposal", attributes: ["namafile"] },
                { model: Burek, as: "Burek", attributes: ["namafile"] },
                { model: Asetrekom, as: "Asetrekom", attributes: ["namafile"] },
                { model: Rab, as: "Rab", attributes: ["namafile"] },

                // Pastikan semua entitas terkait telah didefinisikan dengan benar di model Anda
                // Ganti entitas "Status", "Keagamaan", dan lainnya dengan nama entitas yang benar jika tidak sesuai
            ],
        });

        if (!permohonan) {
            return res
                .status(404)
                .json({ message: "Data Permohonan Tidak Ditemukan" });
        }

        // Konversi objek Sequelize ke JSON dan buat salinan objek
        const permohonans = JSON.parse(JSON.stringify(permohonan));

        // Hapus properti yang tidak diinginkan
        delete permohonans.userid;
        delete permohonans.skid;
        delete permohonans.ktpid;
        delete permohonans.suratpermohonanid;
        delete permohonans.asetrekomid;
        delete permohonans.suketid;
        delete permohonans.burekid;
        delete permohonans.proposalid;
        delete permohonans.rabid;
        delete permohonans.statusid;
        delete permohonans.keagamaanid;

        return res.status(200).json({ success: true, data: permohonans });
    } catch (error) {
        console.error("Error:", error);
        return res
            .status(500)
            .json({ message: "Gagal memuat detail permohonan" });
    }
};

//DOWNLOAD FILE
const downloadfile = (req, res) => {
    const { fileName } = req?.params;
    const directoryPath = "public/uploads/"; // Sesuaikan dengan direktori penyimpanan Anda

    res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Gagal mendownload file." + err,
            });
        }
    });
};

//MENGHAPUS PERMOHONAN
const hapusPersetujuan = async (req, res) => {
    const { id } = req.params; // Ambil ID permohonan dari params

    try {
        const deletedPermohonan = await Permohonan.findByPk(id);

        if (!deletedPermohonan) {
            return res
                .status(404)
                .json({ message: "Data permohonan tidak ditemukan" });
        }

        // Hapus file-file terkait saat permohonan dihapus
        await Promise.all([
            Ktp.destroy({ where: { id: deletedPermohonan.ktpid } }),
            Rab.destroy({ where: { id: deletedPermohonan.rabid } }),
            Proposal.destroy({ where: { id: deletedPermohonan.proposalid } }),
            Suket.destroy({ where: { id: deletedPermohonan.suketid } }),
            Burek.destroy({ where: { id: deletedPermohonan.burekid } }),
            Asetrekom.destroy({ where: { id: deletedPermohonan.asetrekomid } }),
            Suratpermohonan.destroy({
                where: { id: deletedPermohonan.suratpermohonanid },
            }),
            Sk.destroy({ where: { id: deletedPermohonan.skid } }),
        ]);

        // Hapus data permohonan setelah file-file terkait dihapus
        await deletedPermohonan.destroy();

        return res.status(200).json({
            message: "Data permohonan dan file-file terkait berhasil dihapus",
        });
    } catch (error) {
        console.error("Error:", error);
        return res
            .status(500)
            .json({ message: "Gagal menghapus data permohonan" });
    }
};

module.exports = {
    approvePersetujuan,
    allPersetujuan,
    detailPersetujuan,
    hapusPersetujuan,
    downloadfile,
};
