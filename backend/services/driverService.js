const Driver = require("../models/Driver");

// Find nearest available driver
async function findNearestDriver(lat, lng) {
  const drivers = await Driver.find({ available: true });
  if (!drivers.length) return null;

  // simple Euclidean distance
  let nearest = drivers[0];
  let minDist = distance(lat, lng, nearest.location.lat, nearest.location.lng);

  for (const d of drivers) {
    const dist = distance(lat, lng, d.location.lat, d.location.lng);
    if (dist < minDist) {
      minDist = dist;
      nearest = d;
    }
  }
  return nearest;
}

function distance(lat1, lng1, lat2, lng2) {
  return Math.sqrt((lat1 - lat2) ** 2 + (lng1 - lng2) ** 2);
}

module.exports = { findNearestDriver };
