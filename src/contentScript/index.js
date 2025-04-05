console.log('contentScript is running')

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "playSound") {
      const audio = new Audio(chrome.runtime.getURL("fart.mp3"));
      audio.play();
    }
  });