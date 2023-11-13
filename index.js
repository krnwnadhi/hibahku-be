const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyparser = require("body-parser");
const app = express();

const dotenv = require("dotenv");

// Routes dan middleware lainnya
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const permohonanRoute = require("./routes/permohonanRoute");
const cekagamaRoute = require("./routes/cekagamaRoute");
const agamaRoute = require("./routes/agamaRoute");
const persetujuanRoute = require("./routes/admin/persetujuanRoute");
const periodeRoute = require("./routes/admin/periodeRoute");

global.__basedir = __dirname;

dotenv.config();

const PORT = process.env.PORT;
// Mengizinkan akses dari semua origin
app.use(cors());

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({ msg: "Selamat Datang di HIBAHKU API v1 ..." });
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/permohonan", permohonanRoute);
app.use("/api/v1/cek-status", cekagamaRoute);
app.use("/api/v1/rumah-ibadah", agamaRoute);
app.use("/api/v1/persetujuan", persetujuanRoute);
app.use("/api/v1/periode", periodeRoute);

// Start your server
app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});
