const express = require("express");
const Driver = require("../models/Driver");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================
   GET ALL RESOURCES
========================= */
router.get("/", protect(["admin"]), async (req, res) => {
  const drivers = await Driver.find();
  res.json(drivers);
});

/* =========================
   ADD RESOURCE
========================= */
router.post("/add", protect(["admin"]), async (req, res) => {
  const { name, phone, telegramChatId, lat, lng, serviceType } = req.body;

  const driver = await Driver.create({
    name,
    phone,
    telegramChatId,
    serviceType,
    location: {
      lat,
      lng,
    },
  });

  res.json(driver);
});

/* =========================
   DELETE RESOURCE
========================= */
router.delete("/:id", protect(["admin"]), async (req, res) => {
  await Driver.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
});

module.exports = router;