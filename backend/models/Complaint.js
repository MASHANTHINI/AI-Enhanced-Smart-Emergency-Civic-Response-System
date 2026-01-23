const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
      default: null,
    },

    location: {
      lat: Number,
      lng: Number,
    },

    urgency: {
      type: String,
      default: "Low",
    },

    category: {
      type: String,
      default: "General",
    },

    priority: {
      type: Number,
      default: 1,
    },

    agentStatus: {
      type: String,
      default: "Waiting",
    },

    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
