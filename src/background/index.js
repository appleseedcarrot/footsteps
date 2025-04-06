
console.log("running script");

// Default settings
const DEFAULT_SETTINGS = {
  blocklist: ["youtube.com", "reddit.com", "twitter.com", "facebook.com", "instagram.com"],
  glitchEnabled: true,
  checkIntervalMinutes: 0.1 // 6 seconds
};

// Get the initial blocked sites set in options
let blockedSites = []
let glitchEnabled = true;
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
  if (areaName === "sync" && changes.blocklist) {
    blockedSites = changes.blocklist.newValue
  }
})
  

// Listener for settings changes
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "sync") {
    if (changes.blocklist) {
      blockedSites = changes.blocklist.newValue;
    }
    if (changes.glitchEnabled) {
      glitchEnabled = changes.glitchEnabled.newValue;
    }
    if (changes.checkIntervalMinutes) {
      checkInterval = changes.checkIntervalMinutes.newValue;
      updateCheckInterval();
    }
  }
});

// // Add listener to check on the set interval
// chrome.runtime.onInstalled.addListener(() => {
//   chrome.alarms.create("checkTab", { periodInMinutes: checkInterval });
// });

const checkIfOnBlockedSite = (glitchEnabled = false) => {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (tab && tab.url) {
      if (blockedSites.some((site) => tab.url.includes(site))) {
        console.log("You're on a blocked site!!!");

        chrome.tabs.sendMessage(tab.id, {
          action: "playSound",
          glitchEnabled: glitchEnabled,
        });
      }
    }
  });
};

// Listener for alarm
// chrome.alarms.onAlarm.addListener((alarm) => {
//   if (alarm.name === "checkTab") {
//     chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
//       const tab = tabs[0];
//       if (tab && tab.url) {
//         // Check if user is on a blocked site
//         if (blockedSites.some(site => tab.url.includes(site))) {
//           console.log("You're on a blocked site!!!");

//           // Send to content script to play sound and activate glitch
//           chrome.tabs.sendMessage(tab.id, { 
//             action: "playSound",
//             glitchEnabled: glitchEnabled
//           });
//         }
//       }
//     });
//   }
// });

const startPinging = () => {

  // grab token
  const loop = async () => {
    const token = await new Promise((resolve) => {
      chrome.storage.local.get(['authToken'], (result) => {
        resolve(result.authToken);
      });
    });
    
    if (!token) { return; }

    // update status online
    const url = `${import.meta.env.VITE_APP_BACKEND_URL}/auth/ping`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log('[PING] Response:', data);
    } catch (err) {
      console.error('[PING] Error:', err.message || err);
    }

    setTimeout(loop, 1500); // schedule the next ping only after this one is done
  };

  loop(); // start
};

startPinging();

const startPollingJumpscares = () => {
  setInterval(async () => {
    const token = await new Promise((resolve) =>
      chrome.storage.local.get(['authToken'], (res) => resolve(res.authToken))
    );

    if (!token) return;

    try {

      console.log
      const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/jumpscare/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data && data.id) {
        console.log('JUMPSCARE INCOMING:', data);
        checkIfOnBlockedSite(true);
      }
      else {
        console.log('no jumpscares');
      }
    } catch (err) {
      console.error('Polling error:', err);
    }
  }, 3000);
};

startPollingJumpscares();

