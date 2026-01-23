const Resource = require("../models/Resource");
const Complaint = require("../models/Complaint");

function dist(a, b) {
  return Math.sqrt((a.lat - b.lat)**2 + (a.lng - b.lng)**2);
}

async function runAgent() {

  console.log("🤖 Agent scanning...");
    const waiting = await Complaint.find({ agentStatus: "Waiting" });
console.log("🟡 Waiting complaints:", waiting.length);

 


  for (let c of waiting) {

    let need;
    if (c.urgency === "High") need = "Ambulance";
    else if (c.category === "Infrastructure") need = "Maintenance";
    else need = "Maintenance";

    const resources = await Resource.find({ type: need, available: true });

    if (resources.length === 0) {
      c.agentStatus = "Escalated";
      await c.save();
      continue;
    }

    let best = resources[0];
    let min = dist(c.location, best);

    for (let r of resources) {
      const d = dist(c.location, r);
      if (d < min) { min = d; best = r; }
    }

    best.available = false;
    await best.save();

    c.assignedResource = `${best.name} (${best.type})`;
    c.agentStatus = "Assigned";
    c.status = "Approved";
    await c.save();

    console.log("✅ Assigned:", c._id);
  }
}

module.exports = { runAgent };
