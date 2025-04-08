export const getAuthToken = () =>
    new Promise((resolve) => {
      chrome.storage.local.get(['authToken'], (res) => resolve(res.authToken));
});

export const getActiveTab = () =>
    new Promise((resolve) => {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => resolve(tabs[0]))
});