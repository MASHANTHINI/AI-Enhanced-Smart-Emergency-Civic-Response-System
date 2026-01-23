const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    /* ======================================
       👤 USER INFO
    ====================================== */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    /* ======================================
       📍 LOCATION (GPS)
    ====================================== */
    location: {
      lat: {
        type: Number,
        required: true,
        index: true, // faster geo search
      },
      lng: {
        type: Number,
        required: true,
        index: true,
      },
    },

    imageUrl: {
      type: String, // base64 image
      default: "",
    },

    /* ======================================
       🤖 AI ANALYSIS
    ====================================== */
    category: {
      type: String,
      default: "General",
    },

    urgency: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
      index: true,
    },

    priority: {
      type: Number,
      default: 1,
    },

    riskScore: {
      type: Number,
      default: 50,
    },

    /* ======================================
       📌 MAIN STATUS
    ====================================== */
    status: {
      type: String,
      enum: [
        "Pending",     // created
        "Approved",    // admin approved
        "Dispatched",  // ambulance assigned
        "Completed",   // finished
        "Cancelled",
      ],
      default: "Pending",
      index: true,
    },

    /* ======================================
       🚑 DISPATCH SYSTEM
    ====================================== */

    // Assigned ambulance/driver
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },

    // Driver progress
    driverStatus: {
      type: String,
      enum: [
        "Not Assigned",
        "Assigned",
        "On The Way",
        "Reached",
        "Completed",
      ],
      default: "Not Assigned",
    },

    // dispatch time
    dispatchTime: {
      type: Date,
      default: null,
    },

    // finished time
    resolvedTime: {
      type: Date,
      default: null,
    },

    // estimated arrival time (minutes)
    etaMinutes: {
      type: Number,
      default: null,
    },

    // admin notes
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

/* ======================================
   🔥 INDEXES (performance)
====================================== */

// sort by priority quickly
complaintSchema.index({ priority: -1 });

// sort newest quickly
complaintSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Complaint", complaintSchema);
