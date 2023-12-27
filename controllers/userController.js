const { Op } = require("sequelize");
const { User, Role } = require("../models");

const getUsers = async (req, res) => {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.nama || "";

    const offset = limit * page;

    const totalRows = await User.count({
        where: {
            nama: {
                [Op.like]: `%${search}%`,
            },
        },
    });

    const totalPage = Math.ceil(totalRows / limit);

    try {
        const result = await User.findAll({
            where: {
                nama: {
                    [Op.like]: `%${search}%`,
                },
            },
            include: [
                {
                    model: Role,
                    as: "Role", // Using the defined alias 'Role' from the association
                    attributes: ["id", "nama"], // Attributes from the Role table to retrieve
                },
            ],
            offset: offset,
            limit: limit,
            order: [["createdAt", "DESC"]],
        });

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Tidak ada user",
            });
        }

        res.json({
            result: result,
            page: page + 1,
            limit: limit,
            totalItems: totalRows,
            totalPage: totalPage,
            hasMore: result.length >= limit ? true : false,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Gagal memuat data." + error.message,
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
