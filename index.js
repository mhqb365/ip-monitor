const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");

const BOT_TOKEN = process.env.CHECKIP_BOT_TOKEN; // get it from t.me/BotFather
const CHAT_ID = process.env.CHECKIP_CHAT_ID; // get it from t.me/userinfobot

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

async function getPublicIP(maxRetries = 3, retryDelay = 300000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.get("https://api.ipify.org", {
        timeout: 10000,
      });
      return response.data;
    } catch (error) {
      const currentTime = new Date()
        .toISOString()
        .replace("T", " ")
        .substring(0, 19);
      console.log(
        `[${currentTime}] Network error (Attempt ${attempt}/${maxRetries}): ${error.message}`
      );
      if (attempt < maxRetries) {
        console.log(`Retrying in ${retryDelay / 60000} minutes...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      } else {
        console.log("Max retries reached. Skipping this check.");
        return null;
      }
    }
  }
}

async function sendTelegramMessage(message) {
  await bot.sendMessage(CHAT_ID, message);
}

async function main() {
  let previousIP = null;
  console.log("IP monitoring started");

  while (true) {
    const currentIP = await getPublicIP();
    if (currentIP) {
      const currentTime = new Date()
        .toISOString()
        .replace("T", " ")
        .substring(0, 19);
      console.log(`[${currentTime}] Current IP: ${currentIP}`);

      if (previousIP && currentIP !== previousIP) {
        const message = `Time: ${currentTime}\nIP address: ${currentIP}`;
        await sendTelegramMessage(message);
        console.log("IP changed! Notification sent to Telegram.");
      }

      previousIP = currentIP;
    }

    await new Promise((resolve) => setTimeout(resolve, 900000));
  }
}

(async () => {
  const currentIP = await getPublicIP();
  if (currentIP) {
    const currentTime = new Date()
      .toISOString()
      .replace("T", " ")
      .substring(0, 19);
    const message = `Time: ${currentTime}\nIP address: ${currentIP}`;
    await sendTelegramMessage(message);
  }
})();

main().catch((error) => {
  console.error("Error in main loop:", error);
});
