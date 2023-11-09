const { User, Role } = require("../models");
const bcryptjs = require("bcryptjs");

const securePassword = async (password) => {
    try {
        const passwordHash = await bcryptjs.hash(password, 10);
        return passwordHash;
    } catch (error) {
        throw new Error("Failed to hash the password");
    }
};

const register = async (req, res) => {
    try {
        const nik = parseInt(req.body.nik, 10); // Parse the input to an integer

        if (isNaN(nik)) {
            return res.status(400).json({
                success: false,
                msg: "NIK harus angka.",
            });
        } else {
            const nikStr = nik.toString(); // Convert it back to a string
            if (nikStr.length < 16) {
                return res.status(400).json({
                    success: false,
                    msg: "NIK terlalu pendek. Minimal 16 angka.",
                });
            } else if (nikStr.length > 16) {
                return res.status(400).json({
                    success: false,
                    msg: "NIK terlalu panjang. Maksimal 16 Angka",
                });
            }
        }

        if (
            !req.body.nik ||
            !req.body.nama ||
            !req.body.notelpon ||
            !req.body.password
        ) {
            return res.status(400).json({
                success: false,
                msg: "Harap mengisi form yang kosong",
            });
        }

        const spassword = await securePassword(req.body.password);

        const existingUser = await User.findOne({
            where: { nik: nik }, // Use the parsed 'nik' for lookup
        });

        if (existingUser) {
            return res
                .status(409)
                .json({ success: false, msg: "NIK Sudah digunakan." });
        }

        // Create a new User instance with id equal to nik
        const user = new User({
            id: nik, // Set id to the parsed 'nik' value
            nama: req?.body?.nama,
            nik: nik, // Set nik to the parsed 'nik' value
            notelpon: req?.body?.notelpon,
            password: spassword,
            roleid: 2, // Set roleid to 2 (or as required)
        });

        //save user to database
        const user_data = await user.save();

        return res.status(201).json({
            success: true,
            msg: "Register berhasil",
            data: user_data,
        });
    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message });
    }
};

const getusers = async (req, res) => {
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
                msg: "No users found.",
            });
        }

        return res.status(200).json({
            success: true,
            msg: "Users ditemukan",
            data: users,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: error.message,
        });
    }
};

module.exports = {
    register,
    getusers,
};
