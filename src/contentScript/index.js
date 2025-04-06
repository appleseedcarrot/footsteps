console.log('contentScript is running')
console.warn('CONTENT SCRIPT LOADED SUCCESSFULLY');

chrome.runtime.onMessage.addListener((message) => {
    console.log('Message received for sound');
    if (message.action === "playSound") {
      const audio = new Audio(chrome.runtime.getURL("footsteps.mp3"));
      audio.play();
    }
});