const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
  text: String,
  imageUrl: String,
  urgency: String,
  category: String,
  priority: Number,
  location: {
    lat: Number,
    lng: Number
  },
  status: {
    type: String,
    default: "Pending"
  }
});

module.exports = mongoose.model("Complaint", ComplaintSchema);
