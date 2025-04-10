import { startRealTimeJumpscareListener } from './jumpscarePoller';
import { startPinging } from './ping';

// Default settings
const DEFAULT_SETTINGS = {
  blocklist: ["youtube.com", "reddit.com", "twitter.com", "facebook.com", "instagram.com"],
  glitchEnabled: true,
  checkIntervalMinutes: 0.1 // 6 seconds
};

// Get the initial blocked sites set in options
let blockedSites = DEFAULT_SETTINGS.blocklist;
let glitchEnabled = DEFAULT_SETTINGS.glitchEnabled;
let checkInterval = DEFAULT_SETTINGS.checkIntervalMinutes;

// Load settings
function loadSettings() {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
    blockedSites = settings.blocklist;
    glitchEnabled = settings.glitchEnabled;
    checkInterval = settings.checkIntervalMinutes;
    
    // Update alarm interval if needed
    updateCheckInterval();
  });
}

// Update check interval if the setting has changed
function updateCheckInterval() {
  chrome.alarms.clear("checkTab", () => {
    chrome.alarms.create("checkTab", { periodInMinutes: checkInterval });
  });
}

// Initial settings load
loadSettings();

// Listener for blocklist (if user updates blocklist)
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "sync") return;

  if (changes.blocklist) blocklist = changes.blocklist.newValue;
  if (changes.glitchEnabled) glitchEnabled = changes.glitchEnabled.newValue;
  if (changes.checkIntervalMinutes) {
    checkIntervalMinutes = changes.checkIntervalMinutes.newValue;
    updateCheckAlarm();
  }
});

let hasInitialized = false;

chrome.storage.local.get(['userId'], ({ userId }) => {
  if (userId) {
    startListeners(userId);
  }
});

// Listen for login or logout
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'local') return;

  if (changes.userId && changes.userId.newValue && !hasInitialized) {
    startListeners(changes.userId.newValue);
  }

  if (changes.userId && changes.userId.newValue === undefined) {
    // User logged out
    console.log('[BG] User logged out. Stopping listeners.');
    hasInitialized = false;
    // Optionally stop real-time subscriptions here if you have a cleanup function
  }
});

function startListeners(userId) {
  if (hasInitialized) return;
  hasInitialized = true;

  console.log('[BG] User logged in. Starting ping and realtime listeners...');
  startPinging();
  startRealTimeJumpscareListener(userId);
}