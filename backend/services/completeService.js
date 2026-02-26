// services/completeService.js

const Complaint = require("../models/Complaint");
const Driver = require("../models/Driver");

/**
 * Complete all active complaints assigned to a driver
 * @param {String} driverId - MongoDB ObjectId of driver
 * @param {Boolean} markAvailable - if true, mark driver available after completion
 * @returns {Object} { success: Boolean, count: Number }
 */
async function completeComplaint(driverId, markAvailable = true) {
  // Find all complaints assigned to this driver that are still active
  const complaints = await Complaint.find({
    assignedDriver: driverId,
    driverStatus: { $in: ["Assigned", "On The Way", "Reached"] },
  });

  if (!complaints.length) {
    return { success: false, count: 0 };
  }

  // Complete all complaints
  for (const complaint of complaints) {
    complaint.status = "Completed";
    complaint.driverStatus = "Completed";
    complaint.resolvedTime = new Date();
    await complaint.save();
  }

  // Mark driver available if requested
  if (markAvailable) {
    const driver = await Driver.findById(driverId);
    if (driver) {
      driver.available = true;
      await driver.save();
    }
  }

  return { success: true, count: complaints.length };
}

module.exports = { completeComplaint };