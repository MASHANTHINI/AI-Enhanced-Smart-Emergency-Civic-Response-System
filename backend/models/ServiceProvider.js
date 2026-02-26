const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    telegramChatId: {
      type: String, // stored as string
      required: true,
    },

    // ⭐ NEW FIELD (important)
    type: {
      type: String,
      required: true,
      enum: ["ambulance", "fire", "plumber", "electrician"],
      default: "ambulance",
    },

    location: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },

    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Provider", providerSchema);
