// routes/complaints.js

const express = require("express");
const router = express.Router();
const axios = require("axios");
const multer = require("multer");

const Complaint = require("../models/Complaint");
const Driver = require("../models/Driver");
const protect = require("../middleware/authMiddleware");
const { autoDispatchAgent, sendTelegramMessage } = require("../services/dispatchAgent");

/* =====================================================
   MULTER CONFIG (Image Upload - memory storage)
===================================================== */
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* =====================================================
   CREATE COMPLAINT
===================================================== */
router.post("/", protect(), upload.single("image"), async (req, res) => {
  try {
    // ✅ SUPPORT BOTH JSON & FORM DATA
    const text = req.body.text;

    const latitude =
      req.body.lat ||
      req.body?.location?.lat;

    const longitude =
      req.body.lng ||
      req.body?.location?.lng;

    if (!text || !latitude || !longitude) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const lat = Number(latitude);
    const lng = Number(longitude);

    let urgency = "Low";
    let priority = 1;
    let category = "General";

    /* ---------- AI SERVICE (Optional) ---------- */
    try {
      const aiRes = await axios.post("http://localhost:8000/analyze", { text });

      urgency = aiRes.data?.urgency || "Low";
      priority = aiRes.data?.priority || 1;
      category = aiRes.data?.category || "General";
    } catch (err) {
      console.log("⚠️ AI service not reachable, using defaults");
    }

    /* ---------- CREATE COMPLAINT ---------- */
    const complaint = new Complaint({
      user: req.user.id,
      text,
      location: { lat, lng },
      imageUrl: req.file ? req.file.buffer.toString("base64") : "",
      urgency,
      category,
      priority,
      riskScore: priority * 10,
      agentStatus: "Waiting",
      status: "Pending",
      driverStatus: "Not Assigned",
    });

    await complaint.save();

    /* ---------- AUTO DISPATCH ---------- */
    await autoDispatchAgent(complaint);

    res.status(201).json(complaint);

  } catch (err) {
    console.error("❌ Create complaint error:", err);
    res.status(500).json({ message: "Complaint creation failed" });
  }
});

/* =====================================================
   GET MY COMPLAINTS (USER)
===================================================== */
router.get("/my", protect(), async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id })
      .populate("assignedDriver", "name phone telegramChatId")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    console.error("FETCH MY COMPLAINTS ERROR:", err);
    res.status(500).json({ message: "Fetch failed" });
  }
});

/* =====================================================
   GET ALL COMPLAINTS (ADMIN ONLY)
===================================================== */
router.get("/", protect(["admin"]), async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user", "name email")
      .populate("assignedDriver", "name phone telegramChatId")
      .sort({ priority: -1, createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    console.error("FETCH ALL COMPLAINTS ERROR:", err);
    res.status(500).json({ message: "Fetch failed" });
  }
});

/* =====================================================
   APPROVE COMPLAINT (ADMIN)
===================================================== */
router.put("/:id/approve", protect(["admin"]), async (req, res) => {
  try {
    const updated = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("APPROVE ERROR:", err);
    res.status(500).json({ message: "Approval failed" });
  }
});

/* =====================================================
   COMPLETE JOB (ADMIN)
===================================================== */
router.put("/:id/complete", protect(["admin"]), async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("assignedDriver");

    if (!complaint) {
      return res.status(404).json({ message: "Not found" });
    }

    complaint.driverStatus = "Completed";
    complaint.status = "Completed";
    complaint.resolvedTime = new Date();

    if (complaint.assignedDriver) {
      complaint.assignedDriver.available = true;
      await complaint.assignedDriver.save();

      if (complaint.assignedDriver.telegramChatId) {
        await sendTelegramMessage(
          complaint.assignedDriver.telegramChatId,
          ` Complaint "${complaint.text}" completed. You are now available.`
        );
      }
    }

    await complaint.save();

    res.json({ message: "Job completed successfully" });

  } catch (err) {
    console.error("COMPLETE JOB ERROR:", err);
    res.status(500).json({ message: "Complete failed" });
  }
});

module.exports = router;