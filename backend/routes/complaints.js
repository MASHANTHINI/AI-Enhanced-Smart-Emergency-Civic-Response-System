const express = require("express");
const axios = require("axios");
const Complaint = require("../models/Complaint");
const multer = require("multer");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

/* ---------- MULTER ---------- */
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* =====================================================
   CREATE COMPLAINT
===================================================== */
router.post("/", protect(), upload.single("image"), async (req, res) => {
  try {
    const { text, lat, lng } = req.body;

    if (!text || !lat || !lng) {
      return res.status(400).json({ message: "Text and location required" });
    }

    /* 🔥 CALL FASTAPI */
    const aiRes = await axios.post("http://localhost:8000/analyze", { text });

    const { urgency, priority, category } = aiRes.data;

    const complaint = new Complaint({
      user: req.user.id,
      text,

      // ✅ MUST MATCH SCHEMA
      location: {
        lat: Number(lat),
        lng: Number(lng),
      },

      imageUrl: req.file ? req.file.buffer.toString("base64") : "",

      urgency,
      priority,
      category,
      riskScore: priority * 10,
      status: "Pending",
    });

    await complaint.save();

    res.status(201).json(complaint);
  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* =====================================================
   GET MY COMPLAINTS
===================================================== */
router.get("/my", protect(), async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
});

/* =====================================================
   GET ALL (ADMIN)
===================================================== */
router.get("/", protect(["admin"]), async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user", "name email")
      .sort({ priority: -1 });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
});

/* =====================================================
   APPROVE
===================================================== */
router.put("/:id/approve", protect(["admin"]), async (req, res) => {
  try {
    const updated = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Approval failed" });
  }
});

module.exports = router;
