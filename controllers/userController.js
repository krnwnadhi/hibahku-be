const { User, Role } = require("../models");

const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            include: [
                {
                    model: Role,
                    as: "Role", // Using the defined alias 'Role' from the association
                    attributes: ["id", "nama"], // Attributes from the Role table to retrieve
                },
            ],
        });

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                msg: "Belum ada user",
            });
        }

        return res.status(200).json({
            success: true,
            msg: "User ditemukan",
            data: users,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: error.message,
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
        res.json(error);
    }
};

module.exports = {
    getUsersById,
    getUsers,
};
