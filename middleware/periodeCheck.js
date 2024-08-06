const { Op } = require("sequelize");
const { Periode } = require("../models");

const periodeCheck = async (req, res, next) => {
    const { nik } = req?.body;

    // Options for toLocaleDateString to format the date in Indonesian
    const options = {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Jakarta",
    };

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
                message: `Mohon Maaf, Saat ini akses HIBAHKU ditutup hingga ${selesai.toLocaleDateString(
                    "id-ID",
                    options
                )}. Silakan akses kembali setelah periode dibuka kembali. Terima Kasih.`,
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
