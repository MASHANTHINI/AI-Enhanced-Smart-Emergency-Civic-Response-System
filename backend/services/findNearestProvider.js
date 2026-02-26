// services/findNearestProvider.js

const Provider = require("../models/ServiceProvider"); // ⭐ UPDATED

/* =====================================================
   FIND NEAREST AVAILABLE PROVIDER
   lat, lng  → complaint location
   category → match service type (optional)
===================================================== */
async function findNearestProvider(lat, lng, category = null) {
  try {
    const query = { available: true };

    // optional service filter (ambulance/fire/etc)
    if (category) {
      query.serviceType = category;
    }

    const providers = await Provider.find(query);

    if (!providers.length) return null;

    let nearest = null;
    let minDist = Infinity;

    for (const p of providers) {
      if (!p.location) continue;

      const dist = haversineDistance(
        lat,
        lng,
        p.location.lat,
        p.location.lng
      );

      if (dist < minDist) {
        minDist = dist;
        nearest = p;
      }
    }

    return nearest;
  } catch (err) {
    console.error("Find nearest provider error:", err);
    return null;
  }
}

/* =====================================================
   HAVERSINE DISTANCE (km)
   More accurate than Euclidean
===================================================== */
function haversineDistance(lat1, lng1, lat2, lng2) {
  const toRad = (x) => (x * Math.PI) / 180;

  const R = 6371; // Earth radius in km

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

module.exports = { findNearestProvider };
