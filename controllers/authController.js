const { User } = require("../models");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();

const secretKey = process.env.SECRET_KEY;

const register = async (req, res) => {
    const { nik, nama, notelpon, password } = req.body;

    if (!nik || !nama || !notelpon || !password) {
        return res.status(400).json({
            success: false,
            message: "Harap mengisi form yang kosong!",
        });
    }

    if (!/^\d{16}$/.test(nik)) {
        return res.status(400).json({
            success: false,
            message: "NIK harus terdiri dari 16 angka.",
        });
    }

    try {
        const existingUser = await User.findOne({ where: { nik } });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "NIK Sudah Terdaftar!",
            });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = await User.create({
            id: nik,
            nama,
            nik,
            notelpon,
            password: hashedPassword,
            roleid: 2,
        });

        return res.status(201).json({
            success: true,
            message: "Register berhasil!",
            data: newUser,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Register Gagal!",
            error: error.message,
        });
    }
};

const login = async (req, res) => {
    const { nik, password } = req.body;

    if (!nik || !password) {
        return res
            .status(400)
            .json({ message: "NIK atau password tidak boleh kosong!" });
    }

    try {
        // Check if the user with the provided NIK exists in the database
        const user = await User.findOne({ where: { nik } });

        if (!user) {
            return res.status(404).json({
                message: "NIK tidak terdaftar!",
            });
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Password salah! ",
            });
        }

        // User is authenticated, generate a JWT token
        const token = jwt.sign({ userId: user.id, nik: user.nik }, secretKey, {
            expiresIn: "365d", // 1 Tahun Token Kadaluarsa
        });

        return res.status(200).json({
            token,
            role: user.roleid,
            nama: user.nama,
            nik: user.nik,
            notelpon: user.notelpon,
            message: "Login berhasil",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Login Gagal!",
            error: error?.message,
        });
    }
};

const logout = (req, res) => {
    // Tanggapi permintaan logout dengan respons status 200 OK
    res.status(200).json({ message: "Logout successful" });
};

module.exports = { register, login, logout };
