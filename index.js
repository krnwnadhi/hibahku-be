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

app.use("/api", userRoute);
app.use("/api", authRoute);
app.use("/api", permohonanRoute);
app.use("/api", cekagamaRoute);
app.use("/api", agamaRoute);
app.use("/api", persetujuanRoute);
app.use("/api", periodeRoute);

// Start your server
app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});
