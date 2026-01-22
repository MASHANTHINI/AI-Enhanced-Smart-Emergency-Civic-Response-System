const express = require("express");
const Complaint = require("../models/Complaint");
const multer = require("multer");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

/* ---------------- MULTER CONFIG ---------------- */
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* =====================================================
   CREATE COMPLAINT (USER)
===================================================== */
router.post(
  "/",
  protect(),               // authenticated user
  upload.single("image"),  // image is optional
  async (req, res) => {
    try {
      const { text, lat, lng, urgency, category, priority } = req.body;

      /* ---------- VALIDATION ---------- */
      if (!text || !lat || !lng) {
        return res.status(400).json({
          message: "Text and location required",
        });
      }

      /* ---------- IMAGE ---------- */
      const image = req.file
        ? req.file.buffer.toString("base64")
        : "";

      /* ---------- CREATE COMPLAINT ---------- */
      const complaint = new Complaint({
        user: req.user.id,
        text,
        location: {
          lat: Number(lat),
          lng: Number(lng),
        },
        urgency: urgency || "Medium",
        category: category || "General",
        priority: priority ? Number(priority) : 1,
        imageUrl: image,
        status: "Pending",
      });

      await complaint.save();

      res.status(201).json(complaint);
    } catch (err) {
      console.error("CREATE COMPLAINT ERROR:", err);
      res.status(500).json({
        message: "Complaint creation failed",
      });
    }
  }
);

/* =====================================================
   GET MY COMPLAINTS (USER)
===================================================== */
router.get(
  "/my",
  protect(),
  async (req, res) => {
    try {
      const complaints = await Complaint.find({
        user: req.user.id,
      }).sort({ createdAt: -1 });

      res.json(complaints);
    } catch (err) {
      console.error("FETCH MY COMPLAINTS ERROR:", err);
      res.status(500).json({
        message: "Fetch failed",
      });
    }
  }
);

/* =====================================================
   GET ALL COMPLAINTS (ADMIN)
===================================================== */
router.get(
  "/",
  protect(["admin"]),
  async (req, res) => {
    try {
      const complaints = await Complaint.find()
        .populate("user", "name email")
        .sort({ priority: -1, createdAt: -1 });

      res.json(complaints);
    } catch (err) {
      console.error("FETCH ALL COMPLAINTS ERROR:", err);
      res.status(500).json({
        message: "Fetch failed",
      });
    }
  }
);

/* =====================================================
   APPROVE COMPLAINT (ADMIN)
===================================================== */
router.put(
  "/:id/approve",
  protect(["admin"]),
  async (req, res) => {
    try {
      const updated = await Complaint.findByIdAndUpdate(
        req.params.id,
        { status: "Approved" },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({
          message: "Complaint not found",
        });
      }

      res.json(updated);
    } catch (err) {
      console.error("APPROVE COMPLAINT ERROR:", err);
      res.status(500).json({
        message: "Approval failed",
      });
    }
  }
);

module.exports = router;
