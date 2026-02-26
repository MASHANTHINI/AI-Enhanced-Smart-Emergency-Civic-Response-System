const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  telegramChatId: {
    type: String,
  },
  serviceType: {
    type: String,
    enum: ["Ambulance", "Firefighter", "Plumber", "Electrician"],
    required: true,
  },
  location: {
    lat: Number,
    lng: Number,
  },
  available: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Driver", driverSchema);