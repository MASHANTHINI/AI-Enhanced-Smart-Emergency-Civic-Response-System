const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
<<<<<<< HEAD

const complaintRoutes = require("./routes/complaints");
const authRoutes = require("./routes/auth");
=======
require("dotenv").config();
>>>>>>> adc84def6f5cbc6115ac06c6b0c331365685d0b0

/* =============================
   CREATE APP FIRST  ⭐ IMPORTANT
============================= */
const app = express();

<<<<<<< HEAD
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
=======
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

>>>>>>> adc84def6f5cbc6115ac06c6b0c331365685d0b0
