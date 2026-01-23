// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Load .env variables

// Routes
const complaintRoutes = require("./routes/complaints");
const authRoutes = require("./routes/auth");

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(cors());
app.use(express.json()); // parse JSON bodies

/* ---------- DATABASE ---------- */
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/emergency_ai";

mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

/* ---------- ROUTES ---------- */
app.use("/api/auth", authRoutes);          // register & login
app.use("/api/complaints", complaintRoutes); // complaints (protected routes later)

/* ---------- HEALTH CHECK ---------- */
app.get("/", (req, res) => res.send("🚨 Emergency AI Backend Running"));

/* ---------- SERVER ---------- */
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
