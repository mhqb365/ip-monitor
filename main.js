const { app, BrowserWindow, Tray, Menu } = require("electron");
const path = require("path");
const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");

// Constants and configurations
const CONFIG = {
  API_URL: "https://api.ipify.org",
  INTERVAL: 30 * 60 * 1000,
  WINDOW: {
    WIDTH: 300,
    HEIGHT: 200,
  },
};

const { BOT_TOKEN, CHAT_ID } = require("./config.json");
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Global state
let mainWindow = null;
let tray = null;
let initialIP = null;

// Telegram functionality
const sendTelegramMessage = async (message) => {
  try {
    await bot.sendMessage(CHAT_ID, message);
  } catch (error) {
    console.error("Failed to send Telegram message:", error);
  }
};

// IP monitoring
const fetchAPI = async () => {
  const timestamp = new Date().toISOString();
  try {
    const { data: currentIP } = await axios.get(CONFIG.API_URL);
    console.log(`[${timestamp}]: ${currentIP}`);

    mainWindow?.webContents.send("ip-update", currentIP);

    if (!initialIP) {
      initialIP = currentIP;
      await sendTelegramMessage(`Initial IP: ${initialIP}`);
    } else if (currentIP !== initialIP) {
      await sendTelegramMessage(`IP changed: ${currentIP}`);
    }

    return currentIP;
  } catch (error) {
    console.error(`[${timestamp}] Error:`, error);
    return null;
  }
};

// Window management
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: CONFIG.WINDOW.WIDTH,
    height: CONFIG.WINDOW.HEIGHT,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    show: false,
  });

  mainWindow.loadFile("index.html");
  mainWindow.on("close", (e) => {
    e.preventDefault();
    mainWindow.hide();
  });
};

// Tray functionality
const getTrayIconPath = () => {
  return app.isPackaged
    ? path.join(process.resourcesPath, "tray-icon.ico")
    : path.join(__dirname, "tray-icon.ico");
};

const setupTray = () => {
  try {
    tray = new Tray(getTrayIconPath());
    const contextMenu = Menu.buildFromTemplate([
      { label: "Show App", click: () => mainWindow.show() },
      { label: "Quit", click: () => app.quit() },
    ]);

    tray.setToolTip("IP Monitor");
    tray.setContextMenu(contextMenu);
    tray.on("click", () => mainWindow.show());
  } catch (error) {
    console.error("Failed to create tray:", error);
  }
};

// Main functionality
const startIPMonitoring = () => {
  const makeCall = async () => {
    await fetchAPI();
    setTimeout(makeCall, CONFIG.INTERVAL);
  };
  setTimeout(makeCall, 0);
};

// App initialization
app.whenReady().then(() => {
  createWindow();
  setupTray();
  startIPMonitoring();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    // Keep app running in background on non-macOS platforms
  }
});
