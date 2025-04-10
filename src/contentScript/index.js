chrome.runtime.onMessage.addListener((message) => {

  if (message.action === "playSound") {
    const audio = new Audio(chrome.runtime.getURL("creaking.mp3"));
    audio.play();
  }

  if (message.action === "JUMPSCARE") {
    // Create full-screen overlay
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.zIndex = "999999";
    overlay.style.backgroundColor = "black";
    overlay.style.backgroundImage = `url("${chrome.runtime.getURL('img/scary-image.png')}")`;
    overlay.style.backgroundSize = "cover";
    overlay.style.backgroundPosition = "center";
    overlay.style.transition = "opacity 0.2s ease-in-out";
    overlay.style.opacity = "0";
    document.body.appendChild(overlay);

    // Fade it in
    requestAnimationFrame(() => {
      overlay.style.opacity = "1";
    });

    // Optional: scary scream
    const scream = new Audio(chrome.runtime.getURL("scream.mp3"));
    scream.play();

    // Wait ~2 seconds then close the tab
    setTimeout(() => {
      window.close(); // Will close the popup if it's a separate window (not all tabs can be closed via script)
    }, 2000);
  }
});