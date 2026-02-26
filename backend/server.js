// =============================
// IMPORTS
// =============================
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// =============================
// CREATE EXPRESS APP
// =============================
const app = express();

// =============================
// MIDDLEWARE
// =============================
app.use(cors());
app.use(express.json());

// =============================
// ROUTES IMPORT
// =============================
const complaintRoutes = require("./routes/complaints");
const authRoutes = require("./routes/auth");
const driverRoutes = require("./routes/drivers");

// =============================
// ROUTES
// =============================
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/drivers", driverRoutes);

// =============================
// HEALTH CHECK ROUTE
// =============================
app.get("/", (req, res) => {
  res.send("🚨 Emergency AI Backend Running");
});

// =============================
// DATABASE CONNECTION
// =============================
const mongoURI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/emergency_ai";

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    // =============================
    // START SERVER ONLY AFTER DB CONNECTS
    // =============================
    const PORT = process.env.PORT || 5001;

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });

    // =============================
    // START TELEGRAM BOT
    // =============================
    require("./services/telegramBot");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err);
    process.exit(1);
  });