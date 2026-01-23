// routes/complaints.js
const express = require("express");
const router = express.Router();
const axios = require("axios");
<<<<<<< HEAD
const Complaint = require("../models/Complaint");

/* -----------------------------------
   CREATE COMPLAINT (AI OPTIONAL)
------------------------------------ */
router.post("/", async (req, res) => {
=======
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
>>>>>>> adc84def6f5cbc6115ac06c6b0c331365685d0b0
  try {
    const { text, imageUrl, location } = req.body;

    let urgency = "Low";
    let priority = 1;

    // 🔹 AI SERVICE (optional)
    try {
      const aiRes = await axios.post("http://localhost:8000/analyze", {
        complaint: text,
      });
      urgency = aiRes.data.urgency;
      priority = aiRes.data.priority;
    } catch (aiErr) {
      console.log("⚠️ AI service not reachable, using default values");
    }

<<<<<<< HEAD
    let category = "General";
    if (urgency === "High") category = "Emergency";
    else category = "Infrastructure";

    const c = new Complaint({
      text,
      imageUrl,
      location: {
        lat: location.lat,
        lng: location.lng,
      },
=======
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
>>>>>>> adc84def6f5cbc6115ac06c6b0c331365685d0b0
      urgency,
      category,
<<<<<<< HEAD
      priority,
      agentStatus: "Waiting",
      status: "Pending",
    });

    await c.save();
    res.json(c);
=======
      riskScore: priority * 10,
      status: "Approved",       // Auto-approve after driver assignment
      driverStatus: "Not Assigned",
    });

    await complaint.save();

    // Auto-assign nearest driver
    await autoDispatchAgent(complaint);

    res.status(201).json(complaint);
>>>>>>> adc84def6f5cbc6115ac06c6b0c331365685d0b0
  } catch (err) {
    console.error("❌ Create complaint error:", err);
    res.status(500).json({ error: "Complaint creation failed" });
  }
});

<<<<<<< HEAD
/* -----------------------------------
   GET ALL COMPLAINTS
------------------------------------ */
router.get("/", async (req, res) => {
  try {
    const data = await Complaint.find().sort({
      priority: -1,
      createdAt: -1,
    });
    res.json(data);
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ error: "Fetch failed" });
  }
});

/* -----------------------------------
   APPROVE COMPLAINT
------------------------------------ */
router.put("/:id/approve", async (req, res) => {
  try {
    await Complaint.findByIdAndUpdate(req.params.id, {
      status: "Approved",
    });
    res.json({ message: "Approved" });
  } catch (err) {
    console.error("❌ Approve error:", err);
    res.status(500).json({ error: "Approve failed" });
=======
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
>>>>>>> adc84def6f5cbc6115ac06c6b0c331365685d0b0
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
