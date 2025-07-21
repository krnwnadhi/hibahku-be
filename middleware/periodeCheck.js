const { Op } = require("sequelize");
const { Periode } = require("../models");

const periodeCheck = async (req, res, next) => {
    const { nik } = req.body;
    const allowedNik = ["1571020410940041", "197710102008011004"];

    if (allowedNik.includes(nik)) {
        return next();
    }

    try {
        const currentDate = new Date();

        const activePeriod = await Periode.findOne({
            where: {
                mulai: { [Op.lte]: currentDate },
                selesai: { [Op.gte]: currentDate },
            },
        });

        if (activePeriod) {
            const options = {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "Asia/Jakarta",
            };
            const endDate = activePeriod.selesai.toLocaleDateString(
                "id-ID",
                options
            );

            return res.status(403).json({
                message: `Mohon Maaf, Saat ini akses HIBAHKU ditutup hingga ${endDate}. Silakan akses kembali setelah periode dibuka kembali. Terima Kasih.`,
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Terjadi kesalahan saat memeriksa periode!",
            error: error?.message,
        });
    }
};

module.exports = periodeCheck;
