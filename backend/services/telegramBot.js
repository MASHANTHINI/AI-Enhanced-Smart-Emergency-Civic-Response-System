const TelegramBot = require("node-telegram-bot-api");
const Driver = require("../models/Driver");
const Complaint = require("../models/Complaint");

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true, // ⭐ NO WEBHOOK
});

console.log("🤖 Telegram polling started...");

// Listen for messages
bot.on("message", async (msg) => {
  const text = msg.text?.toLowerCase();
  const chatId = msg.chat.id;

  if (text === "completed") {
    try {
      // find driver by chatId
      const driver = await Driver.findOne({ telegramChatId: chatId });

      if (!driver) return;

      // find assigned complaint
      const complaint = await Complaint.findOne({
        assignedDriver: driver._id,
        driverStatus: "Assigned",
      });

      if (!complaint) return;

      // complete complaint
      complaint.status = "Completed";
      complaint.driverStatus = "Completed";
      await complaint.save();

      // make driver available
      driver.available = true;
      await driver.save();

      bot.sendMessage(chatId, "✅ Complaint marked completed. You are available now.");

      console.log("✅ Auto completed via polling");
    } catch (err) {
      console.log(err);
    }
  }
});
