const express = require("express");
const router = express.Router();
const axios = require("axios");
const Complaint = require("../models/Complaint");

/* -----------------------------------
   CREATE COMPLAINT (AI OPTIONAL)
------------------------------------ */
router.post("/", async (req, res) => {
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
      urgency,
      category,
      priority,
      agentStatus: "Waiting",
      status: "Pending",
    });

    await c.save();
    res.json(c);
  } catch (err) {
    console.error("❌ Create complaint error:", err);
    res.status(500).json({ error: "Complaint creation failed" });
  }
});

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
  }
});

module.exports = router;
