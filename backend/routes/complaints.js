const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
const axios = require("axios");


/* =================================================
   CREATE COMPLAINT — WITH AI NLP ANALYSIS
================================================= */
router.post("/", async (req, res) => {
  try {
    const { text, imageUrl, location } = req.body;

    // 🔥 Call AI microservice
    const aiRes = await axios.post("http://localhost:8000/analyze", {
      text: text
    });

    const complaint = new Complaint({
      text,
      imageUrl,
      location,
      urgency: aiRes.data.urgency,
      category: aiRes.data.category,
      priority: aiRes.data.priority,
      status: "Pending"
    });

    await complaint.save();
    res.json(complaint);

  } catch (err) {
    console.error("AI CREATE ERROR:", err.message);
    res.status(500).json({ error: "AI analysis or DB save failed" });
  }
});


/* =================================================
   GET ALL COMPLAINTS (SORTED BY PRIORITY)
================================================= */
router.get("/", async (req, res) => {
  try {
    const data = await Complaint.find().sort({ priority: -1 });
    res.json(data);
  } catch (err) {
    console.error("FETCH ERROR:", err.message);
    res.status(500).json({ error: "Fetch failed" });
  }
});


/* =================================================
   APPROVE COMPLAINT (HUMAN IN LOOP)
================================================= */
router.put("/:id/approve", async (req, res) => {
  try {
    const updated = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" },
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    console.error("APPROVE ERROR:", err.message);
    res.status(500).json({ error: "Approval failed" });
  }
});

module.exports = router;
