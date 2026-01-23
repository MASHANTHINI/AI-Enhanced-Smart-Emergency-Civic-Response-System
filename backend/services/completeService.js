const Complaint = require("../models/Complaint");
const Driver = require("../models/Driver");

/*
  Reusable completion logic
  Used by:
  ✅ Admin route
  ✅ Telegram webhook
*/
async function completeComplaint(complaintId) {
  const complaint = await Complaint.findById(complaintId).populate(
    "assignedDriver"
  );

  if (!complaint) return;

  /* mark complaint complete */
  complaint.status = "Completed";
  complaint.driverStatus = "Completed";
  complaint.resolvedTime = new Date();

  /* free driver */
  if (complaint.assignedDriver) {
    complaint.assignedDriver.available = true;
    await complaint.assignedDriver.save();
  }

  await complaint.save();

  console.log("✅ Complaint completed:", complaintId);
}

module.exports = { completeComplaint };
