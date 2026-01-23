const axios = require("axios");
const qs = require("qs"); // Make sure to install: npm i qs

/**
 * Send Telegram message to a single driver
 */
async function sendTelegramToDriver(chatId, message) {
  if (!chatId) {
    console.log("⚠️ No chatId provided for driver!");
    return;
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    console.log("⚠️ TELEGRAM_BOT_TOKEN is missing!");
    return;
  }

  console.log("➡️ Sending Telegram to:", chatId);

  try {
    // Telegram requires URL-encoded form data
    const response = await axios.post(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      qs.stringify({ chat_id: chatId, text: message }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    console.log("✅ Telegram sent successfully:", response.data);
    return response.data;
  } catch (err) {
    console.error(
      "❌ Telegram send failed:",
      err.response?.data || err.message
    );
  }
}

/**
 * Send Telegram message to multiple drivers
 */
async function sendTelegramToMultiple(drivers, message) {
  for (const driver of drivers) {
    await sendTelegramToDriver(driver.telegramChatId, message);
  }
}

module.exports = { sendTelegramToDriver, sendTelegramToMultiple };
