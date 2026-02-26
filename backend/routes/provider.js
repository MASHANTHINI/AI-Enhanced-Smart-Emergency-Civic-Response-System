const express = require("express");
const Provider = require("../models/ServiceProvider"); // renamed model
const protect = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================
   GET PROVIDERS (optional filter by type)
   /api/providers
   /api/providers?type=fire
========================= */
router.get("/", protect(["admin"]), async (req, res) => {
  try {
    const { type } = req.query;

    // filter if type provided
    const filter = type ? { type } : {};

    const providers = await Provider.find(filter);

    res.json(providers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* =========================
   ADD PROVIDER
========================= */
router.post("/add", protect(["admin"]), async (req, res) => {
  try {
    const {
      name,
      phone,
      telegramChatId,
      lat,
      lng,
      type, // ⭐ NEW FIELD
    } = req.body;

    const provider = await Provider.create({
      name,
      phone,
      telegramChatId,
      type, // ambulance/fire/plumber/electrician
      location: {
        lat,
        lng,
      },
    });

    res.json(provider);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* =========================
   DELETE PROVIDER
========================= */
router.delete("/:id", protect(["admin"]), async (req, res) => {
  try {
    await Provider.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* =========================
   TOGGLE AVAILABILITY (optional useful feature)
========================= */
router.put("/:id/toggle", protect(["admin"]), async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);

    provider.available = !provider.available;

    await provider.save();

    res.json(provider);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
