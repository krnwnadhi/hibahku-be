const { Op } = require("sequelize");
const { Periode } = require("../models");

const periodeCheck = async (req, res, next) => {
    const { nik } = req?.body;

    try {
        const currentDate = new Date();

        const activePeriod = await Periode.findOne({
            where: {
                mulai: { [Op.lte]: currentDate },
                selesai: { [Op.gte]: currentDate },
            },
        });

        if (
            activePeriod &&
            nik !== "1571020410940041" &&
            nik !== "197710102008011004"
        ) {
            const { selesai } = activePeriod;

            return res.status(403).json({
                message: `Mohon Maaf, Akses Ditutup hingga ${selesai}. Silakan coba lagi nanti.`,
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
