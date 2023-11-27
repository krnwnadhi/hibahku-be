const { User } = require("../models");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const config = require("../config/config.json");
// const secretKey = config.development.secretKey;

const dotenv = require("dotenv");
dotenv.config();

const secretKey = process.env.SECRET_KEY;

const register = async (req, res) => {
    const securePassword = async (password) => {
        try {
            const salt = await bcryptjs.genSalt(10);
            const passwordHash = await bcryptjs.hash(password, salt);
            return passwordHash;
        } catch (error) {
            throw new Error("Failed to hash the password");
        }
    };

    try {
        const nik = parseInt(req?.body?.nik, 10); // Parse the input to an integer

        if (isNaN(nik)) {
            return res.status(400).json({
                success: false,
                message: "NIK harus angka.",
            });
        } else {
            const nikStr = nik.toString(); // Convert it back to a string
            if (nikStr.length < 16) {
                return res.status(400).json({
                    success: false,
                    message: "NIK terlalu pendek. Minimal 16 angka.",
                });
            } else if (nikStr.length > 16) {
                return res.status(400).json({
                    success: false,
                    message: "NIK terlalu panjang. Maksimal 16 Angka",
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
                message: "Harap mengisi form yang kosong!",
            });
        }

        const spassword = await securePassword(req?.body?.password);

        const existingUser = await User.findOne({
            where: { nik: nik }, // Use the parsed 'nik' for lookup
        });

        if (existingUser) {
            return res
                .status(409)
                .json({ success: false, message: "NIK Sudah Terdaftar." });
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
        const newUser = await user.save();

        return res.status(201).json({
            success: true,
            message: "Register berhasil",
            data: newUser,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const login = async (req, res) => {
    const { nik, password } = req.body;

    if (!nik || !password) {
        return res
            .status(400)
            .json({ message: "NIK atau password tidak boleh kosong" });
    }

    try {
        // Check if the user with the provided NIK exists in the database
        const user = await User.findOne({ where: { nik } });

        if (!user) {
            return res.status(404).json({ message: "NIK tidak terdaftar!" });
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Password salah" });
        }

        // User is authenticated, generate a JWT token
        const token = jwt.sign({ userId: user.id, nik: user.nik }, secretKey, {
            expiresIn: "1d", // 24 Jam Token Kadaluarsa
        });

        if (user.roleid === 1) {
            return res.status(200).json({
                token,
                role: user?.roleid,
                nama: user?.nama,
            });
        } else if (user.roleid === 2) {
            return res.status(200).json({
                token,
                role: user?.roleid,
                nama: user?.nama,
            });
        } else {
            return res.status(200).json({
                token,
                role: user?.roleid,
                nama: user?.nama,
                message: "Login berhasil",
            });
        }
        // return res.status(200).json({
        //     token,
        //     role: user?.roleid,
        // });
    } catch (error) {
        console.error(error);
        // res.status(500).json({ message: "Internal Server Error" });
        return res.status(500).json({ success: false, message: error.message });
    }
};

const logout = (req, res) => {
    // Tanggapi permintaan logout dengan respons status 200 OK
    res.status(200).json({ message: "Logout successful" });
};

module.exports = { register, login, logout };
