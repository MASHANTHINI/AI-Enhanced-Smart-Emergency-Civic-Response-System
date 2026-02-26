// services/dispatchAgent.js

const Driver = require("../models/Driver");
const axios = require("axios");

/**
 * Send Telegram message helper
 */
async function sendTelegramMessage(chatId, text) {
  if (!chatId) return;

  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    await axios.post(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        chat_id: chatId,
        text,
      }
    );
  } catch (err) {
    console.error("Telegram send error:", err.message);
  }
}

/**
 * Auto-assign driver ONLY for emergency complaints
 */
async function autoDispatchAgent(complaint) {
  try {
    //Define emergency categories
    const emergencyCategories = ["Accident", "Fire", "Medical"];

    //If not emergency → do NOT assign driver
    if (!emergencyCategories.includes(complaint.category)) {
      console.log(
        `Complaint ${complaint._id} is not emergency. No driver assigned.`
      );
      return;
    }

    //Find available driver
    const driver = await Driver.findOne({ available: true });

    if (!driver) {
      console.log("No available drivers for complaint:", complaint._id);
      return;
    }

    // ✅ Assign driver
    complaint.assignedDriver = driver._id;
    complaint.driverStatus = "Assigned";
    complaint.status = "Approved"; // Auto-approve emergency
    complaint.agentStatus = "Driver Assigned";

    await complaint.save();

    // 🔄 Mark driver as busy
    driver.available = false;
    await driver.save();

    console.log(
      `Complaint ${complaint._id} assigned to driver ${driver.name}`
    );

    // Notify driver
    if (driver.telegramChatId) {
      await sendTelegramMessage(
        driver.telegramChatId,
        `EMERGENCY ASSIGNED\n\n` +
          `Complaint: ${complaint.text}\n` +
          `Category: ${complaint.category}\n` +
          `Location: ${complaint.location.lat}, ${complaint.location.lng}`
      );
    }
  } catch (err) {
    console.error("AUTO DISPATCH ERROR:", err);
  }
}

module.exports = { autoDispatchAgent, sendTelegramMessage };