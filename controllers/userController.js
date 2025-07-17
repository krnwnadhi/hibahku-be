const { User, Role } = require("../models");

const getUsers = async (req, res) => {
    try {
        const result = await User.findAll({
            include: [
                {
                    model: Role,
                    as: "Role", // Using the defined alias 'Role' from the association
                    attributes: ["id", "nama"], // Attributes from the Role table to retrieve
                },
            ],

            order: [["createdAt", "DESC"]],
        });

        res.json({
            result: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Gagal memuat data Users!",
            error: error?.message,
        });
    }
};

const getUsersById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findOne({
            where: {
                id: id,
            },
            include: [
                {
                    model: Role,
                    as: "Role", // Using the defined alias 'Role' from the association
                    attributes: ["id", "nama"], // Attributes from the Role table to retrieve
                },
            ],
        });
        if (!user) {
            res.status(400).json({ message: "User Tidak Ditemukan" });
        } else {
            res.json(user);
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Gagal memuat data detail Users!",
            error: error?.message,
        });
    }
};

module.exports = {
    getUsersById,
    getUsers,
};
