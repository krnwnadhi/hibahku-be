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
                const twoYearsAgo = new Date();
                twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

                if (lastSubmission.createdAt > twoYearsAgo) {
                    const lastSubmissionDate =
                        lastSubmission.createdAt.toDateString();
                    const nextSubmissionDate = new Date(
                        lastSubmission.createdAt
                    );
                    nextSubmissionDate.setFullYear(
                        nextSubmissionDate.getFullYear() + 2
                    );
                    const nextSubmissionFormattedDate =
                        nextSubmissionDate.toDateString();

                    return res.status(400).json({
                        message: `Anda harus menunggu 2 tahun untuk mengajukan permohonan lagi. Terakhir diajukan pada: ${lastSubmissionDate}. Anda dapat mengajukan lagi setelah: ${nextSubmissionFormattedDate}`,
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
