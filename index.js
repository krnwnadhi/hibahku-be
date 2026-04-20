const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyparser = require("body-parser");
const app = express();

const dotenv = require("dotenv");

dotenv.config({
    origin: true,
    credentials: true,
});

// Routes dan middleware lainnya
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const rumahIbadahRoute = require("./routes/rumahIbadahRoute");
const cekStatusRumahIbadahRoute = require("./routes/cekStatusRumahIbadahRoute");
const permohonanRoute = require("./routes/permohonanRoute");
const persetujuanRoute = require("./routes/persetujuanRoute");
const periodeRoute = require("./routes/periodeRoute");

global.__basedir = __dirname;

const PORT = process.env.PORT;

// Mengizinkan akses dari semua origin
const corsOptions = {
    origin: "*",
    credentials: true,
};

app.use(cors(corsOptions));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

// Penangkap error jika ada kiriman JSON yang rusak (seperti "test_data")
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        console.error("Invalid JSON detected:", err.message);
        return res.status(400).json({
            status: false,
            message:
                "Format JSON tidak valid! Pastikan request body berupa JSON objek.",
        });
    }
    next();
});
// --------------------------------

app.get("/", (req, res) => {
    res.json({ message: "HIBAHKU API v1.1.0.beta" });
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept",
    );
    next();
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/cek-status", cekStatusRumahIbadahRoute);
app.use("/api/v1/rumah-ibadah", rumahIbadahRoute);
app.use("/api/v1/permohonan", permohonanRoute);
app.use("/api/v1/persetujuan", persetujuanRoute);
app.use("/api/v1/periode", periodeRoute);

//Error Handler Global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: false,
        message: "Something broke!",
        error: err.message,
    });
});

// Start your server
app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});
