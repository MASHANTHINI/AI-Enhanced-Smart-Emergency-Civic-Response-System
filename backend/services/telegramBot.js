// services/telegramBot.js

const TelegramBot = require("node-telegram-bot-api");
const Driver = require("../models/Driver");
const { completeComplaint } = require("./completeService"); // correct path

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
console.log("🤖 Telegram polling started...");

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text?.toLowerCase() || "";

  try {
    let driver = await Driver.findOne({ telegramChatId: chatId });

    // Auto-register driver if not found
    if (!driver) {
      driver = new Driver({
        name: msg.from.first_name || "Unknown",
        telegramChatId: chatId,
        available: true,
      });
      await driver.save();
      bot.sendMessage(chatId, `✅ Welcome ${driver.name}! You are now registered as a driver.`);
      return; // stop here, wait for next message
    }

    if (text === "completed") {
      const result = await completeComplaint(driver._id, true);

      if (result.success) {
        bot.sendMessage(
          chatId,
          `✅ ${result.count} complaint(s) marked completed. You are now available.`
        );
      } else {
        bot.sendMessage(chatId, "⚠️ You have no active complaints to complete.");
      }
    } else {
      bot.sendMessage(chatId, 'ℹ️ Send "completed" when you finish a complaint.');
    }
  } catch (err) {
    console.error("❌ Telegram bot error:", err);
    bot.sendMessage(chatId, "❌ Something went wrong. Try again later.");
  }
});