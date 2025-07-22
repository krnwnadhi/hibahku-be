const roleCheck = async (req, res, next) => {
    if (req.user && req.user.roleid === 1) {
        return next();
    }

    return res.status(403).json({
        message: "Maaf, hanya Admin yang bisa mengakses halaman ini!",
    });
};

module.exports = {
    roleCheck,
};
