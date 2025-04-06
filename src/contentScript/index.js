console.log('contentScript is running')
console.warn('CONTENT SCRIPT LOADED SUCCESSFULLY');


// Glitch animation functions
let layerIntervals = [];
let warningInterval = null;

// Updated CSS for a much scarier glitch effect
// Add this to your injectGlitchCSS function

function injectGlitchCSS() {
  const style = document.createElement('style');
  style.textContent = `
    .productivity-glitch-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 9999;
      pointer-events: all;
      overflow: hidden;
      display: none;
      background-color: rgba(0, 0, 0, 0.25);
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
      animation: glitch-animation 0.2s infinite steps(2);
      background-color: rgba(255, 0, 0, 0.1);
    }
    
    /* Scanlines for VHS horror effect */
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
      z-index: 10002;
      pointer-events: none;
      animation: scanline-animation 8s linear infinite;
    }
    
    /* Flicker effect for the whole screen */
    .glitch-flicker {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      background-color: rgba(255, 255, 255, 0.1);
      z-index: 10003;
      pointer-events: none;
      animation: flicker-animation 0.2s infinite;
    }
    
    /* Vignette effect for horror ambiance */
    .glitch-vignette {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(
        circle at center,
        transparent 0%,
        rgba(0, 0, 0, 0) 40%,
        rgba(0, 0, 0, 0.8) 100%
      );
      z-index: 10001;
      pointer-events: none;
    }
    
    /* Noise texture */
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
      animation: noise-animation 0.2s infinite;
    }
    
    /* Enhanced warning message */
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
        -3px -3px 0 rgba(0,0,255,0.7),
        0 0 20px rgba(255,0,0,0.5),
        0 0 40px rgba(255,0,0,0.3);
      z-index: 10004;
      letter-spacing: 0.3rem;
      animation: warning-pulse 2s infinite, glitch-text 3s infinite;
      text-align: center;
      white-space: nowrap;
    }
    
    /* Creepy face that randomly appears and disappears */
    .glitch-face {
      position: absolute;
      width: 300px;
      height: 300px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      opacity: 0;
      z-index: 10005;
      filter: invert(1) contrast(1.5) brightness(0.8);
      animation: face-animation 10s infinite;
      pointer-events: none;
    }
    
    /* Blood drip overlay */
    .blood-drip {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 0;
      background: linear-gradient(to bottom, rgba(255,0,0,0.7) 0%, rgba(128,0,0,0.5) 80%, transparent 100%);
      z-index: 10001;
      animation: blood-drip-animation 6s infinite;
      opacity: 0.7;
    }
    
    .intensified .glitch-layer {
      opacity: 0.7;
      animation-duration: 0.05s !important;
      mix-blend-mode: color-burn;
    }
    
    .intensified .glitch-warning {
      font-size: 7rem;
      color: white;
      text-shadow: 
        5px 5px 0 rgba(255,0,0,0.9),
        -5px -5px 0 rgba(0,0,255,0.9),
        0 0 30px rgba(255,0,0,0.7),
        0 0 60px rgba(255,0,0,0.5);
      animation: warning-pulse 0.5s infinite, glitch-text 1s infinite;
    }
    
    .intensified .glitch-scanlines {
      opacity: 0.8;
      background: repeating-linear-gradient(
        to bottom,
        transparent 0px,
        rgba(0, 0, 0, 0.2) 1px,
        rgba(0, 0, 0, 0.2) 2px,
        transparent 3px
      );
    }
    
    .intensified .glitch-face {
      opacity: 0.9 !important;
      animation: face-animation-intense 2s infinite;
    }
    
    .intensified .blood-drip {
      height: 100%;
      animation: none;
      background: linear-gradient(to bottom, rgba(255,0,0,0.8) 0%, rgba(128,0,0,0.6) 100%);
    }
    
    @keyframes glitch-animation {
      0% { transform: translate(0); filter: hue-rotate(0deg); }
      10% { transform: translate(-5px, 5px); filter: hue-rotate(90deg); }
      20% { transform: translate(5px, -5px); filter: hue-rotate(180deg); }
      30% { transform: translate(-3px, -5px); filter: hue-rotate(270deg); }
      40% { transform: translate(5px, 5px); filter: hue-rotate(360deg); }
      50% { transform: translate(-5px, 3px); filter: hue-rotate(0deg); }
      60% { transform: translate(3px, -5px); filter: hue-rotate(90deg); }
      70% { transform: translate(-5px, -3px); filter: hue-rotate(180deg); }
      80% { transform: translate(5px, 5px); filter: hue-rotate(270deg); }
      90% { transform: translate(-3px, 5px); filter: hue-rotate(360deg); }
      100% { transform: translate(0); filter: hue-rotate(0deg); }
    }
    
    @keyframes warning-pulse {
      0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.05); }
      52% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      54% { opacity: 0.7; transform: translate(-50%, -50%) scale(0.95); }
      100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
    
    @keyframes glitch-text {
      0% { transform: translate(-50%, -50%); }
      1% { transform: translate(-49%, -48%) skew(1deg, -1deg); }
      2% { transform: translate(-50%, -50%); }
      15% { transform: translate(-50%, -50%); }
      16% { transform: translate(-51%, -49%) skew(-1deg, 1deg); }
      17% { transform: translate(-50%, -50%); }
      35% { transform: translate(-50%, -50%); }
      36% { transform: translate(-52%, -50%) skew(2deg, 0); }
      37% { transform: translate(-50%, -50%); }
      76% { transform: translate(-50%, -50%); }
      77% { transform: translate(-50%, -52%) skew(0, 2deg); }
      78% { transform: translate(-50%, -50%); }
      96% { transform: translate(-50%, -50%); }
      97% { transform: translate(-48%, -50%) skew(-2deg, 0); }
      98% { transform: translate(-50%, -50%); }
    }
    
    @keyframes shake {
      0% { transform: translate3d(0, 0, 0) rotate(0deg); }
      10% { transform: translate3d(-5px, 0, 0) rotate(-1deg); }
      20% { transform: translate3d(5px, 0, 0) rotate(1deg); }
      30% { transform: translate3d(-7px, 0, 0) rotate(-2deg); }
      40% { transform: translate3d(7px, 0, 0) rotate(2deg); }
      50% { transform: translate3d(-10px, 0, 0) rotate(-3deg); }
      60% { transform: translate3d(10px, 0, 0) rotate(3deg); }
      70% { transform: translate3d(-7px, 0, 0) rotate(-2deg); }
      80% { transform: translate3d(7px, 0, 0) rotate(2deg); }
      90% { transform: translate3d(-5px, 0, 0) rotate(-1deg); }
      100% { transform: translate3d(0, 0, 0) rotate(0deg); }
    }
    
    @keyframes scanline-animation {
      0% { background-position: 0 0; }
      100% { background-position: 0 100%; }
    }
    
    @keyframes flicker-animation {
      0% { opacity: 0; }
      5% { opacity: 0.5; }
      10% { opacity: 0; }
      15% { opacity: 0; }
      20% { opacity: 0.8; }
      25% { opacity: 0; }
      30% { opacity: 0; }
      35% { opacity: 0.3; }
      40% { opacity: 0; }
      45% { opacity: 0; }
      50% { opacity: 0.6; }
      55% { opacity: 0; }
      60% { opacity: 0; }
      65% { opacity: 0.3; }
      70% { opacity: 0; }
      75% { opacity: 0; }
      80% { opacity: 0.8; }
      85% { opacity: 0; }
      90% { opacity: 0; }
      95% { opacity: 0.2; }
      100% { opacity: 0; }
    }
    
    @keyframes noise-animation {
      0% { transform: translate(0, 0); }
      10% { transform: translate(-2%, -2%); }
      20% { transform: translate(2%, 2%); }
      30% { transform: translate(-1%, 1%); }
      40% { transform: translate(1%, -1%); }
      50% { transform: translate(-2%, 2%); }
      60% { transform: translate(2%, -2%); }
      70% { transform: translate(-1%, -1%); }
      80% { transform: translate(1%, 1%); }
      90% { transform: translate(-2%, -2%); }
      100% { transform: translate(0, 0); }
    }
    
    @keyframes face-animation {
      0% { opacity: 0; top: 30%; left: 30%; transform: scale(0.2) rotate(-10deg); }
      1% { opacity: 0.9; }
      2% { opacity: 0; }
      20% { opacity: 0; top: 70%; left: 40%; transform: scale(0.2) rotate(10deg); }
      21% { opacity: 0.9; }
      22% { opacity: 0; }
      70% { opacity: 0; top: 40%; left: 65%; transform: scale(0.2) rotate(-10deg); }
      71% { opacity: 0.9; }
      72% { opacity: 0; }
      100% { opacity: 0; top: 30%; left: 30%; transform: scale(0.2) rotate(-10deg); }
    }
    
    @keyframes face-animation-intense {
      0% { opacity: 0.9; top: 40%; left: 30%; transform: scale(0.5) rotate(-10deg); }
      25% { opacity: 0.8; top: 60%; left: 70%; transform: scale(0.7) rotate(10deg); }
      50% { opacity: 0.9; top: 30%; left: 50%; transform: scale(1) rotate(0deg); }
      75% { opacity: 0.8; top: 70%; left: 30%; transform: scale(0.7) rotate(-10deg); }
      100% { opacity: 0.9; top: 40%; left: 30%; transform: scale(0.5) rotate(-10deg); }
    }
    
    @keyframes blood-drip-animation {
      0% { height: 0; }
      30% { height: 0; }
      50% { height: 15%; }
      80% { height: 30%; }
      100% { height: 0; }
    }
  `;
  document.head.appendChild(style);
}

// Updated overlay creation function with additional scare elements
function createGlitchOverlay() {
  // Create overlay container
  const overlay = document.createElement('div');
  overlay.className = 'productivity-glitch-overlay';
  overlay.id = 'productivity-glitch-overlay';
  
  // Create glitch layers
  for (let i = 0; i < 5; i++) {
    const layer = document.createElement('div');
    layer.className = 'glitch-layer';
    overlay.appendChild(layer);
  }
  
  // Add scanlines for VHS horror effect
  const scanlines = document.createElement('div');
  scanlines.className = 'glitch-scanlines';
  overlay.appendChild(scanlines);
  
  // Add vignette effect
  const vignette = document.createElement('div');
  vignette.className = 'glitch-vignette';
  overlay.appendChild(vignette);
  
  // Add noise texture
  const noise = document.createElement('div');
  noise.className = 'glitch-noise';
  overlay.appendChild(noise);
  
  // Add flicker effect
  const flicker = document.createElement('div');
  flicker.className = 'glitch-flicker';
  overlay.appendChild(flicker);
  
  // Add blood drip effect
  const bloodDrip = document.createElement('div');
  bloodDrip.className = 'blood-drip';
  overlay.appendChild(bloodDrip);
  
  // Create warning message with scarier text
  const warning = document.createElement('div');
  warning.className = 'glitch-warning';
  warning.innerHTML = '<span>GET BACK TO WORK</span><br><span style="font-size: 60%;">OR ELSE</span>';
  overlay.appendChild(warning);
  
  // Add creepy face that occasionally flashes
  const face = document.createElement('div');
  face.className = 'glitch-face';
  
  // Generate the face SVG (a simple creepy smiley)
  face.style.backgroundImage = `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cellipse cx='100' cy='100' rx='80' ry='90' fill='white' stroke='black' stroke-width='2'/%3E%3Ccircle cx='70' cy='80' r='15' fill='black'/%3E%3Ccircle cx='130' cy='80' r='15' fill='black'/%3E%3Cpath d='M60 130 Q100 170 140 130' stroke='black' stroke-width='5' fill='none'/%3E%3C/svg%3E")`;
  overlay.appendChild(face);
  
  // Add to document
  document.body.appendChild(overlay);
  
  return overlay;
}

// Enhanced glitch animations
function startGlitchAnimations() {
  // Clear any existing intervals
  stopGlitchAnimations();
  
  const layers = document.querySelectorAll('.glitch-layer');
  
  layers.forEach((layer, index) => {
    // Randomize glitch properties
    layer.style.animationDelay = `${Math.random() * 0.5}s`;
    layer.style.animationDuration = `${0.1 + Math.random() * 0.2}s`;
    
    // Create interval for this layer
    const interval = setInterval(() => {
      if (Math.random() > 0.6) { // Increase frequency of changes
        layer.style.transform = `translate(${(Math.random() - 0.5) * 20}px, ${(Math.random() - 0.5) * 20}px) skew(${(Math.random() - 0.5) * 10}deg, ${(Math.random() - 0.5) * 10}deg)`;
        layer.style.opacity = 0.2 + Math.random() * 0.5;
        
        // More extreme color shifts
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 30);  // Keep green very low for unsettling look
        const b = Math.floor(Math.random() * 255);
        layer.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.15)`;
        
        // Randomly change blend mode for more visual distortion
        const blendModes = ['color-dodge', 'color-burn', 'hue', 'exclusion', 'difference'];
        layer.style.mixBlendMode = blendModes[Math.floor(Math.random() * blendModes.length)];
      }
    }, 50 + index * 30); // Faster intervals
    
    layerIntervals.push(interval);
  });
  
  // Make the warning text glitch more aggressively
  const warningText = document.querySelector('.glitch-warning');
  if (warningText) {
    warningInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        warningText.style.transform = `translate(${(Math.random() - 0.5) * 30}px, ${(Math.random() - 0.5) * 30}px) scale(${0.9 + Math.random() * 0.2}) skew(${(Math.random() - 0.5) * 10}deg, ${(Math.random() - 0.5) * 10}deg)`;
        warningText.style.textShadow = `
          ${(Math.random() - 0.5) * 15}px ${(Math.random() - 0.5) * 15}px ${Math.random() * 10}px rgba(255,0,0,0.7),
          ${(Math.random() - 0.5) * 15}px ${(Math.random() - 0.5) * 15}px ${Math.random() * 10}px rgba(0,0,255,0.7)
        `;
        
        // Randomly change text color for flickering effect
        if (Math.random() > 0.8) {
          warningText.style.color = Math.random() > 0.5 ? '#ff0000' : '#ffffff';
        }
      }
    }, 100);
  }
  
  // Add random sounds during glitch effect
  startRandomSounds();
}

// Random scary sound effects
let soundInterval = null;
function startRandomSounds() {
  if (soundInterval) clearInterval(soundInterval);
  
  const sounds = [
    { frequency: 100, type: 'sine' },    // Low rumble
    { frequency: 2000, type: 'sawtooth' }, // High screech
    { frequency: 500, type: 'square' },   // Digital glitch
  ];
  
  soundInterval = setInterval(() => {
    if (Math.random() > 0.9) { // Occasional sounds, not constant
      playGlitchSound();
    }
  }, 2000);
  
  function playGlitchSound() {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const sound = sounds[Math.floor(Math.random() * sounds.length)];
      
      // Create oscillator
      const oscillator = audioContext.createOscillator();
      oscillator.type = sound.type;
      oscillator.frequency.setValueAtTime(sound.frequency, audioContext.currentTime);
      
      // Create gain node for volume control
      const gainNode = audioContext.createGain();
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Low volume
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.5);
      
      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Play for a short time
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
      }, 300 + Math.random() * 200);
    } catch (e) {
      console.error("Error playing glitch sound:", e);
    }
  }
}

function stopGlitchAnimations() {
  // Clear all intervals
  layerIntervals.forEach(interval => clearInterval(interval));
  if (warningInterval) clearInterval(warningInterval);
  if (soundInterval) clearInterval(soundInterval);
  
  layerIntervals = [];
  warningInterval = null;
  soundInterval = null;
}

// Enhanced intensify function for maximum scare
function intensifyGlitch() {
  const overlay = document.getElementById('productivity-glitch-overlay');
  if (!overlay) return;
  
  overlay.classList.add('intensified');
  
  // More extreme shaking
  document.body.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both';
  
  // Play a louder sound
  const audio = new Audio(chrome.runtime.getURL("fart.mp3"));
  audio.volume = 1.0; // Maximum volume
  audio.play().catch(e => console.error("Error playing sound:", e));
  
  // Try to create a quick vibration if available
  if (navigator.vibrate) {
    navigator.vibrate([100, 50, 200, 50, 100]);
  }
  
  // Randomly change the warning message
  const warningTexts = [
    '<span>GET BACK TO WORK</span><br><span style="font-size: 60%;">OR ELSE</span>',
    '<span>FOCUS NOW</span><br><span style="font-size: 60%;">TIME IS RUNNING OUT</span>',
    '<span>STOP WASTING TIME</span>',
    '<span>PRODUCTIVITY</span><br><span style="font-size: 60%;">IS WATCHING YOU</span>'
  ];
  
  const warningElement = overlay.querySelector('.glitch-warning');
  if (warningElement) {
    warningElement.innerHTML = warningTexts[Math.floor(Math.random() * warningTexts.length)];
  }
  
  // Reset after a slightly longer period
  setTimeout(() => {
    document.body.style.animation = '';
    overlay.classList.remove('intensified');
  }, 1500);
}

// More persistent click handler - harder to dismiss
function handleGlitchClick(e) {
  if (!isGlitchActive) return;
  
  // 85% chance to intensify instead of dismiss (increased from 70%)
  if (Math.random() > 0.15) {
    e.preventDefault();
    e.stopPropagation();
    intensifyGlitch();
    return false;
  }
  
  // Only 15% chance to dismiss after delay
  setTimeout(() => {
    deactivateGlitch();
  }, 2000); // Longer delay before dismissal
}


// Initialize glitch system
let overlayElement = null;
let isGlitchActive = false;

function initGlitch() {
  injectGlitchCSS();
  overlayElement = createGlitchOverlay();
  
  // Add click handler
  document.addEventListener('click', handleGlitchClick);
}










function activateGlitch() {
  // Initialize if not already done
  if (!overlayElement) {
    initGlitch();
  }
  
  // Show the overlay
  overlayElement.style.display = 'block';
  isGlitchActive = true;
  
  // Start animations
  startGlitchAnimations();
  
  console.log("Glitch effect activated");
}

function deactivateGlitch() {
  if (!overlayElement) return;
  
  // Hide the overlay
  overlayElement.style.display = 'none';
  isGlitchActive = false;
  
  // Stop animations
  stopGlitchAnimations();
  
  console.log("Glitch effect deactivated");
}


chrome.runtime.onMessage.addListener((message) => {
    console.log('Message received for sound');
    if (message.action === "playSound") {
      const audio = new Audio(chrome.runtime.getURL("fart.mp3"));
      audio.play();

      activateGlitch();
    }
});

window.addEventListener('load', initGlitch);

