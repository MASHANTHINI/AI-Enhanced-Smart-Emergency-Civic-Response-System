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
 * Smart Auto Dispatch
 */async function autoDispatchAgent(complaint) {
  try {
    let requiredService;

    const category = complaint.category?.toLowerCase();

    if (!category) {
      console.log("No category provided");
      return;
    }

    if (category.includes("medical") || category.includes("accident")) {
      requiredService = "Ambulance";
    }
    else if (category.includes("fire")) {
      requiredService = "Firefighter";
    }
    else if (category.includes("pipe") || category.includes("leak")) {
      requiredService = "Plumber";
    }
    else if (category.includes("electric")) {
      requiredService = "Electrician";
    }
    else {
      console.log(`Complaint ${complaint._id} does not require field resource`);
      return;
    }

    const driver = await Driver.findOne({
      available: true,
      serviceType: { $regex: new RegExp(requiredService, "i") }
    });

    if (!driver) {
      console.log(`No available ${requiredService}`);
      return;
    }

    complaint.assignedDriver = driver._id;
    complaint.driverStatus = "Assigned";
    complaint.status = "Approved";
    complaint.agentStatus = "Assigned";

    await complaint.save();

    driver.available = false;
    await driver.save();

    console.log(`Assigned ${driver.name}`);

    if (driver.telegramChatId) {
      await sendTelegramMessage(
        driver.telegramChatId,
        `🚨 NEW ${requiredService.toUpperCase()} ASSIGNMENT\n\n` +
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