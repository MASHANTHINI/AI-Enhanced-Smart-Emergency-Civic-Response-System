const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const complaintRoutes = require("./routes/complaints");
const authRoutes = require("./routes/auth");

const app = express();

// -------- MIDDLEWARE --------
app.use(cors());
app.use(express.json());

// -------- ROUTES --------
app.use("/api/complaints", complaintRoutes);
app.use("/api/auth", authRoutes);


// -------- DB CONNECTION --------
mongoose
  .connect("mongodb://127.0.0.1:27017/ai_complaints")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Mongo Error:", err));


// -------- START SERVER --------
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
