const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  name: String,
  type: String,   // Ambulance | Fire | Maintenance
  lat: Number,
  lng: Number,
  available: Boolean
});

module.exports = mongoose.model("Resource", resourceSchema);
