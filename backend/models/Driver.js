const mongoose = require("mongoose"); 
const driverSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    telegramChatId: {
      type: String, // Telegram chat ID can be numeric but stored as string
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
  },
  { timestamps: true }
);
 
module.exports = mongoose.model("Driver", driverSchema);