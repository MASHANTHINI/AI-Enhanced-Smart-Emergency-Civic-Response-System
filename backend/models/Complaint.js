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
      index: true,
    },

    /* ======================================
       COMPLAINT DETAILS
    ====================================== */
    text: {
      type: String,
      required: true,
      trim: true,
    },

    imageUrl: {
      type: String, // base64 image (optional)
      default: "",
    },

    /* ======================================
      LOCATION (GPS)
    ====================================== */
    location: {
      lat: {
        type: Number,
        required: true,
        index: true,
      },
      lng: {
        type: Number,
        required: true,
        index: true,
      },
    },

    /* ======================================
       AI ANALYSIS
    ====================================== */
    category: {
      type: String,
      default: "General",
      index: true,
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
      index: true,
    },

    riskScore: {
      type: Number,
      default: 50,
    },

    agentStatus: {
      type: String,
      enum: ["Waiting", "Assigned", "Escalated"],
      default: "Waiting",
      index: true,
    },

    /* ======================================
      MAIN STATUS
    ====================================== */
    status: {
      type: String,
      enum: [
        "Pending",     // created
        "Approved",    // admin approved
        "Dispatched",  // driver assigned
        "Completed",   // finished
        "Cancelled",
      ],
      default: "Pending",
      index: true,
    },

    /* ======================================
       DISPATCH SYSTEM
    ====================================== */

    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },

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

    dispatchTime: {
      type: Date,
      default: null,
    },

    resolvedTime: {
      type: Date,
      default: null,
    },

    etaMinutes: {
      type: Number,
      default: null,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

/* ======================================
   INDEXES (Performance Optimization)
====================================== */

// Fast sorting
complaintSchema.index({ priority: -1 });
complaintSchema.index({ createdAt: -1 });

// Geo-style compound index (optional future use)
complaintSchema.index({ "location.lat": 1, "location.lng": 1 });

module.exports = mongoose.model("Complaint", complaintSchema);