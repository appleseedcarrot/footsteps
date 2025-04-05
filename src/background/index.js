// Sample websites to block
const blockedSites = ["youtube.com", "reddit.com", "twitter.com"];

// Add listener to check every 5 minutes
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("checkTab", { periodInMinutes: 0.1 });
});

// Listener for alarm
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "checkTab") {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab && tab.url) {
        // Check if user is on a blocked site
        //
        if (blockedSites.some(site => tab.url.includes(site))) {
          console.log("You're on a blocked site!!!");
        }
        else {
          console.log("you're safe!");
        }
      }
    });
  }
});
