// routes/complaints.js
const express = require("express");
const axios = require("axios");
const multer = require("multer");

const Complaint = require("../models/Complaint");
const Driver = require("../models/Driver"); // Driver model
const protect = require("../middleware/authMiddleware");
const { autoDispatchAgent, sendTelegramMessage } = require("../services/dispatchAgent");

const router = express.Router();

/* =====================================================
   MULTER CONFIG (for image upload)
===================================================== */
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

    const latitude = Number(lat);
    const longitude = Number(lng);

    // 🔥 Call AI Service
    const aiRes = await axios.post("http://localhost:8000/analyze", { text });
    const { urgency, priority, category } = aiRes.data;

    // Save complaint
    const complaint = new Complaint({
      user: req.user.id,
      text,
      location: { lat: latitude, lng: longitude },
      imageUrl: req.file ? req.file.buffer.toString("base64") : "",
      urgency,
      priority,
      category,
      riskScore: priority * 10,
      status: "Approved",       // Auto-approve after driver assignment
      driverStatus: "Not Assigned",
    });

    await complaint.save();

    // Auto-assign nearest driver
    await autoDispatchAgent(complaint);

    res.status(201).json(complaint);
  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   GET COMPLAINTS FOR CURRENT USER
===================================================== */
router.get("/my", protect(), async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id })
      .populate("assignedDriver", "name phone telegramChatId") // show driver info
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    console.error("FETCH MY COMPLAINTS ERROR:", err);
    res.status(500).json({ message: "Fetch failed" });
  }
});

/* =====================================================
   GET ALL COMPLAINTS (ADMIN)
===================================================== */
router.get("/", protect(["admin"]), async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user", "name email")
      .populate("assignedDriver", "name phone telegramChatId")
      .sort({ priority: -1 });

    res.json(complaints);
  } catch (err) {
    console.error("FETCH ALL COMPLAINTS ERROR:", err);
    res.status(500).json({ message: "Fetch failed" });
  }
});

/* =====================================================
   APPROVE COMPLAINT (ADMIN OVERRIDE)
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
    console.error("APPROVE ERROR:", err);
    res.status(500).json({ message: "Approval failed" });
  }
});

/* =====================================================
   COMPLETE JOB (MARK DRIVER FREE + notify)
===================================================== */
router.put("/:id/complete", protect(["admin"]), async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate(
      "assignedDriver"
    );

    if (!complaint) {
      return res.status(404).json({ message: "Not found" });
    }

    // Mark complaint as completed
    complaint.driverStatus = "Completed";
    complaint.status = "Completed";
    complaint.resolvedTime = new Date();

    // Free the driver and notify
    if (complaint.assignedDriver) {
      complaint.assignedDriver.available = true;
      await complaint.assignedDriver.save();

      // Notify driver
      if (complaint.assignedDriver.telegramChatId) {
        await sendTelegramMessage(
          complaint.assignedDriver.telegramChatId,
          `✅ Complaint "${complaint.text}" has been marked as completed. You are now available for new assignments.`
        );
      }
    }

    await complaint.save();

    res.json({ message: "Job completed and driver is available" });
  } catch (err) {
    console.error("COMPLETE JOB ERROR:", err);
    res.status(500).json({ message: "Complete failed" });
  }
});

module.exports = router;
