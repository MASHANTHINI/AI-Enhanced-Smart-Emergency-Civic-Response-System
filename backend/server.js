const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

/* =============================
   CREATE APP FIRST  ⭐ IMPORTANT
============================= */
const app = express();

/* =============================
   MIDDLEWARE
============================= */
app.use(cors());
app.use(express.json());

/* =============================
   ROUTES IMPORT
============================= */
const complaintRoutes = require("./routes/complaints");
const authRoutes = require("./routes/auth");
const driverRoutes = require("./routes/drivers");

/* =============================
   ROUTES USE
============================= */
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/drivers", driverRoutes);

/* =============================
   DATABASE
============================= */
const mongoURI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/emergency_ai";

mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

/* =============================
   HEALTH CHECK
============================= */
app.get("/", (req, res) =>
  res.send("🚨 Emergency AI Backend Running")
);

app.use(express.json()); // VERY IMPORTANT

/* =============================
   SERVER
============================= */
const PORT = process.env.PORT || 5001;

app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
require("./services/telegramBot");

