// services/dispatchAgent.js
const Driver = require("../models/Driver");
const Complaint = require("../models/Complaint");
const axios = require("axios");

/**
 * Send Telegram message helper
 */
async function sendTelegramMessage(chatId, text) {
  if (!chatId) return;
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text,
    });
  } catch (err) {
    console.error("Telegram send error:", err.message);
  }
}

/**
 * Auto-assign nearest available driver
 */
async function autoDispatchAgent(complaint) {
  try {
    // Find nearest available driver
    const driver = await Driver.findOne({ available: true });
    if (!driver) {
      console.log("No available drivers for complaint:", complaint._id);
      return;
    }

    // Assign driver
    complaint.assignedDriver = driver._id;
    complaint.driverStatus = "Assigned";     
    complaint.status = "Approved"; // <-- Mark complaint as approved once driver is assigned
    await complaint.save();

    // Mark driver as busy
    driver.available = false;
    await driver.save();

    console.log(`Complaint ${complaint._id} assigned to driver ${driver.name}`);

    // Notify driver only
    if (driver.telegramChatId) {
      await sendTelegramMessage(
        driver.telegramChatId,
        `🚨 New complaint assigned: ${complaint.text}\nLocation: ${complaint.location.lat}, ${complaint.location.lng}`
      );
    }
  } catch (err) {
    console.error("AUTO DISPATCH ERROR:", err);
  }
}

module.exports = { autoDispatchAgent };
