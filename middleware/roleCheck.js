const { User } = require("../models");

const roleCheck = async (req, res, next) => {
    const { user } = req; // Ganti "User" dengan "user"
    // console.log("Role ID:", user.roleid);
    if (user.roleid !== 1) {
        // Ganti "User" dengan "user", dan ubah operator perbandingan dari "!=" menjadi "!==" untuk perbandingan tipe data yang tepat
        // console.log("Unauthorized - Role is not ADMIN");
        return res.status(403).json({
            msg: "Maaf hanya Admin yang bisa mengakses halaman!",
        });
    }
    next();
};

module.exports = {
    roleCheck,
};
