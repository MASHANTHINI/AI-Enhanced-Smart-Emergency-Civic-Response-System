const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    // 📍 LOCATION FROM MAP / GPS
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

    imageUrl: {
      type: String, // base64 image
    },

    category: {
      type: String,
      default: "General",
    },

    urgency: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    priority: {
      type: Number,
      default: 1,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved"],
      default: "Pending",
    },

    riskScore: {
      type: Number,
      default: 50,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
