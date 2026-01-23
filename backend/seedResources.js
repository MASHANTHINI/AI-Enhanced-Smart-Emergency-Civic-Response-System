const mongoose = require("mongoose");
const Resource = require("./models/Resource");

mongoose.connect("mongodb://127.0.0.1:27017/emergency_ai");

const data = [
  { name: "Ambulance A1", type: "Ambulance", lat: 11.02, lng: 76.96, available: true },
  { name: "Fire Truck F1", type: "Fire", lat: 11.01, lng: 76.94, available: true },
  { name: "Maintenance M1", type: "Maintenance", lat: 11.03, lng: 76.97, available: true }
];

Resource.insertMany(data).then(() => {
  console.log("Resources Seeded");
  process.exit();
});
