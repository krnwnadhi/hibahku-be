const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyparser = require("body-parser");
const app = express();

const dotenv = require("dotenv");

// Routes dan middleware lainnya
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const rumahIbadahRoute = require("./routes/rumahIbadahRoute");
const cekStatusRumahIbadahRoute = require("./routes/cekStatusRumahIbadahRoute");
const permohonanRoute = require("./routes/permohonanRoute");
const persetujuanRoute = require("./routes/persetujuanRoute");
const periodeRoute = require("./routes/periodeRoute");

global.__basedir = __dirname;

dotenv.config({
    origin: true,
    credentials: true,
});

const PORT = process.env.PORT;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

// Mengizinkan akses dari semua origin
const corsOptions = {
    origin: "*",
    credentials: true,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
    res.json({ message: "HIBAHKU API v1.0.0.beta" });
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/cek-status", cekStatusRumahIbadahRoute);
app.use("/api/v1/rumah-ibadah", rumahIbadahRoute);
app.use("/api/v1/permohonan", permohonanRoute);
app.use("/api/v1/persetujuan", persetujuanRoute);
app.use("/api/v1/periode", periodeRoute);

// Start your server
app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});
