let isGlitchActive = false;
let glitchInterval = null;
let jumpScareTimeout = null;

function injectGlitchCSS() {
  const style = document.createElement('style');
  style.textContent = `
    .glitch-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 9999;
      pointer-events: all;
      display: none;
      background-color: rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(2px);
    }
    
    .glitch-layer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      mix-blend-mode: color-dodge;
      opacity: 0.4;
      z-index: 10000;
      background-color: rgba(255, 0, 0, 0.1);
    }
    
    .glitch-scanlines {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: repeating-linear-gradient(
        to bottom,
        transparent 0px,
        rgba(0, 0, 0, 0.05) 1px,
        rgba(0, 0, 0, 0.05) 2px,
        transparent 3px
      );
      z-index: 10001;
      pointer-events: none;
    }
    
    .glitch-noise {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E");
      opacity: 0.15;
      z-index: 10001;
      pointer-events: none;
    }
    
    .glitch-warning {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-family: 'Arial Black', sans-serif;
      font-size: 5rem;
      font-weight: 900;
      color: #ff0000;
      text-shadow: 
        3px 3px 0 rgba(255,255,255,0.7),
        -3px -3px 0 rgba(0,0,255,0.7);
      z-index: 10002;
      text-align: center;
      white-space: nowrap;
      animation: warningPulse 2s infinite;
    }
    
    .scary-face {
      position: fixed;
      width: 60vw;
      height: 60vh; 
      background-size: contain;
      background-repeat: no-repeat;
      z-index: 10003;
      transform: scale(0);
      transition: transform 0.1s;
      filter: contrast(1.2) brightness(0.8);
      top: 0;
      left: 0;
      min-width: 100vw;
      min-height: 100vh;
      will-change: transform;
    }
    
    .face-visible {
      transform: scale(1) !important;
    }
    
    @keyframes warningPulse {
      0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.05); }
      100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
    
    @keyframes shake {
      0% { transform: translate(0, 0); }
      25% { transform: translate(-5px, -5px); }
      50% { transform: translate(5px, 5px); }
      75% { transform: translate(-5px, 5px); }
      100% { transform: translate(0, 0); }
    }
  `;
  document.head.appendChild(style);
}

function createGlitchOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'glitch-overlay';
  overlay.id = 'glitch-overlay';
  
  const glitchLayer = document.createElement('div');
  glitchLayer.className = 'glitch-layer';
  overlay.appendChild(glitchLayer);
  
  const scanlines = document.createElement('div');
  scanlines.className = 'glitch-scanlines';
  overlay.appendChild(scanlines);
  
  const noise = document.createElement('div');
  noise.className = 'glitch-noise';
  overlay.appendChild(noise);
  
  const warning = document.createElement('div');
  warning.className = 'glitch-warning';
  warning.textContent = 'YOU\'VE BEEN CAUGHT';
  overlay.appendChild(warning);
  
  const face = document.createElement('div');
  face.className = 'scary-face';
  face.style.backgroundImage = `url("${chrome.runtime.getURL('img/scary-image.png')}")`;
  overlay.appendChild(face);

  document.body.appendChild(overlay);
  
  return overlay;
}

// Random glitch effect
function applyRandomGlitchEffect(element) {
  const glitchLayer = element.querySelector('.glitch-layer');
  if (glitchLayer) {
    const offsetX = (Math.random() - 0.5) * 20;
    const offsetY = (Math.random() - 0.5) * 20;
    const skewX = (Math.random() - 0.5) * 10;
    const skewY = (Math.random() - 0.5) * 10;
    
    glitchLayer.style.transform = `translate(${offsetX}px, ${offsetY}px) skew(${skewX}deg, ${skewY}deg)`;
    
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 30);
    const b = Math.floor(Math.random() * 255);
    glitchLayer.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.15)`;
  }
  
  if (Math.random() > 0.8) {
    document.body.style.animation = 'shake 0.2s';
    setTimeout(() => {
      document.body.style.animation = '';
    }, 200);
  }
  
  if (Math.random() > 0.85) {
    triggerJumpScare(element);
  }
}

function triggerJumpScare(overlay) {
  const face = overlay.querySelector('.scary-face');
  if (face) {
    const faceWidth = window.innerWidth * 0.3;
    const faceHeight = window.innerHeight * 0.3;
    
    const maxX = window.innerWidth - faceWidth;
    const maxY = window.innerHeight - faceHeight;
    
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    
    face.style.left = `${randomX}px`;
    face.style.top = `${randomY}px`;
    
    face.style.transform = 'scale(1)';
    face.classList.add('face-visible');
    
    setTimeout(() => {
      face.classList.remove('face-visible');
      face.style.transform = 'scale(0)';
    }, 800);
  }
}

// Start the glitch effect
function activateGlitch() {
  // Initialize if needed
  if (!document.getElementById('glitch-overlay')) {
    injectGlitchCSS();
    createGlitchOverlay();
  }
  
  const overlay = document.getElementById('glitch-overlay');
  if (!overlay) return;
  
  overlay.style.display = 'block';
  isGlitchActive = true;
  
  glitchInterval = setInterval(() => {
    applyRandomGlitchEffect(overlay);
  }, 200);

  scheduleRandomJumpScare(overlay);
  
  overlay.addEventListener('click', deactivateGlitch);
}

function freezeScreen() {
  document.body.style.overflow = "hidden";
}

function scheduleRandomJumpScare(overlay) {
  if (jumpScareTimeout) {
    clearTimeout(jumpScareTimeout);
  }
  
  const delay = 1000 + Math.random() * 3000;
  jumpScareTimeout = setTimeout(() => {
    triggerJumpScare(overlay);
    
    if (isGlitchActive) {
      scheduleRandomJumpScare(overlay);
    }
  }, delay);
}

function deactivateGlitch() {
  const overlay = document.getElementById('glitch-overlay');
  if (!overlay) return;
  
  overlay.style.display = 'none';
  isGlitchActive = false;
  
  if (glitchInterval) {
    clearInterval(glitchInterval);
    glitchInterval = null;
  }
  
  if (jumpScareTimeout) {
    clearTimeout(jumpScareTimeout);
    jumpScareTimeout = null;
  }
  
  document.body.style.animation = '';
  document.body.style.overflow = "";
}

function initGlitch() {
  injectGlitchCSS();
  createGlitchOverlay();
}

chrome.runtime.onMessage.addListener((message) => {
    console.log('Message received for sound');
    if (message.action === "playSound") {
      const audio = new Audio(chrome.runtime.getURL("footsteps.mp3"));
      audio.play();

      freezeScreen();
      activateGlitch();
    }
});

window.addEventListener('load', initGlitch);