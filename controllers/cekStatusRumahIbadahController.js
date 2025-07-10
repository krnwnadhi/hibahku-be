const { Keagamaan, Permohonan } = require("../models");

const cekStatus = async (req, res) => {
    const { id } = req?.body;

    try {
        const rumahIbadahExists = await Keagamaan.findByPk(id);

        if (rumahIbadahExists) {
            const lastSubmission = await Permohonan.findOne({
                where: {
                    Keagamaanid: id,
                },
                order: [["createdAt", "DESC"]],
            });

            if (lastSubmission) {
                // 1. Dapatkan tahun saat ini dan tahun pengajuan terakhir.
                const currentYear = new Date().getFullYear();
                const lastSubmissionYear = new Date(
                    lastSubmission.createdAt
                ).getFullYear();

                // 2. Hitung tahun di mana pengajuan berikutnya diizinkan (tahun terakhir + 2).
                const nextAvailableYear = lastSubmissionYear + 2;

                // 3. Cek apakah tahun ini belum mencapai tahun yang diizinkan untuk pengajuan baru.
                if (currentYear < nextAvailableYear) {
                    // 4. Berikan pesan error yang jelas dengan informasi tahun pengajuan terakhir
                    //    dan kapan bisa mengajukan lagi sesuai aturan baru.
                    return res.status(400).json({
                        message: `Anda sudah pernah mengajukan permohonan pada tahun ${lastSubmissionYear}. Anda baru bisa mengajukan lagi mulai 1 Januari ${nextAvailableYear}.`,
                        isUploaded: true,
                    });
                }
            }

            // Jika tidak ada permohonan sebelumnya atau sudah lebih dari 2 tahun
            // return res.status(200).send("Silahkan upload dokumen");
            return res
                .status(200)
                .json({ message: "Silahkan upload dokumen", isUpload: true });
        } else {
            // return res.status(404).send("Data agama tidak ditemukan");
            return res.status(200).json({
                message: `Data Tidak Ditemukan! Harap mendaftarkan Rumah Ibadah / Lembaga Pendidikan Keagamaan terlebih dahulu.`,
                isUpload: false,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan dalam memproses permintaan!",
            error: error?.message,
        });
    }
};

module.exports = {
    cekStatus,
};
