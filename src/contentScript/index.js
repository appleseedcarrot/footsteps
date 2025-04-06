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










// Add these functions to distort the underlying webpage content

// Variables to store the distortion state
let distortionInterval = null;
let originalStyles = new Map();
let distortedElements = [];

// Function to start distorting the webpage
function startWebpageDistortion() {
  // Store the original state of elements for restoration later
  storeOriginalStyles();
  
  // Apply initial distortion to elements
  distortPageElements();
  
  // Start continuous distortion
  startDistortionInterval();
}

// Function to stop distorting and restore the webpage
function stopWebpageDistortion() {
  // Clear the distortion interval
  if (distortionInterval) {
    clearInterval(distortionInterval);
    distortionInterval = null;
  }
  
  // Restore original styles
  restoreOriginalStyles();
}

// Store original styles of elements to restore later
function storeOriginalStyles() {
  originalStyles.clear();
  distortedElements = [];
  
  // Select important elements to distort
  const elements = document.querySelectorAll('div, p, h1, h2, h3, h4, h5, img, a, button, input, section, article');
  
  elements.forEach(el => {
    // Skip very small elements or invisible elements
    if (el.offsetWidth < 10 || el.offsetHeight < 10 || 
        window.getComputedStyle(el).display === 'none' ||
        window.getComputedStyle(el).visibility === 'hidden') {
      return;
    }
    
    // Store original styles
    originalStyles.set(el, {
      transform: el.style.transform || '',
      filter: el.style.filter || '',
      position: el.style.position || '',
      zIndex: el.style.zIndex || '',
      transition: el.style.transition || '',
      opacity: el.style.opacity || '',
      color: el.style.color || '',
      backgroundColor: el.style.backgroundColor || '',
      overflow: el.style.overflow || '',
      left: el.style.left || '',
      top: el.style.top || '',
      width: el.style.width || '',
      height: el.style.height || '',
      borderRadius: el.style.borderRadius || '',
      letterSpacing: el.style.letterSpacing || '',
      textShadow: el.style.textShadow || ''
    });
    
    distortedElements.push(el);
  });
  
  console.log(`Stored original styles for ${distortedElements.length} elements`);
}

// Restore the original styles
function restoreOriginalStyles() {
  distortedElements.forEach(el => {
    if (originalStyles.has(el)) {
      const styles = originalStyles.get(el);
      
      // Restore all stored properties
      for (const [prop, value] of Object.entries(styles)) {
        el.style[prop] = value;
      }
    }
  });
  
  // Also restore any text nodes we might have distorted
  restoreTextNodes();
}

// Initialize and store original text nodes
let originalTextNodes = new Map();
function storeTextNodes() {
  originalTextNodes.clear();
  
  // Find text nodes in the document
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  
  let node;
  while (node = walker.nextNode()) {
    // Only store non-empty text nodes in visible elements
    if (node.nodeValue.trim() !== '' && isNodeVisible(node)) {
      originalTextNodes.set(node, node.nodeValue);
    }
  }
}

// Check if a node is visible
function isNodeVisible(node) {
  if (!node.parentElement) return false;
  const style = window.getComputedStyle(node.parentElement);
  return style.display !== 'none' && style.visibility !== 'hidden';
}

// Restore original text nodes
function restoreTextNodes() {
  originalTextNodes.forEach((value, node) => {
    if (node.nodeValue !== value) {
      node.nodeValue = value;
    }
  });
}

// Apply distortion to page elements
function distortPageElements() {
  // Get viewport dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  distortedElements.forEach(el => {
    // Different distortion based on element type
    if (el.tagName === 'IMG') {
      distortImage(el);
    } else if (el.tagName.match(/^H[1-6]$/)) {
      distortHeading(el);
    } else if (el.tagName === 'P' || el.textContent.length > 20) {
      distortTextBlock(el);
    } else {
      distortGenericElement(el);
    }
    
    // Occasionally add extra glitchy effects
    if (Math.random() > 0.9) {
      applyGlitchEffects(el);
    }
  });
  
  // Distort some text nodes
  distortTextNodes();
}

// Distort image elements
function distortImage(element) {
  const distortionAmount = Math.random() * 20;
  const filterValues = [
    `hue-rotate(${Math.random() * 180}deg)`,
    `invert(${Math.random() * 0.7})`,
    `saturate(${1 + Math.random() * 3})`,
    `contrast(${1 + Math.random()})`,
    `blur(${Math.random() * 2}px)`
  ];
  
  // Apply random distortion
  element.style.transform = `skew(${Math.random() * 10 - 5}deg, ${Math.random() * 10 - 5}deg) scale(${0.9 + Math.random() * 0.2})`;
  element.style.filter = filterValues.join(' ');
  
  // Random positioning changes
  if (Math.random() > 0.5) {
    if (element.style.position !== 'fixed' && element.style.position !== 'absolute') {
      element.style.position = 'relative';
    }
    element.style.left = `${Math.random() * 20 - 10}px`;
    element.style.top = `${Math.random() * 20 - 10}px`;
  }
  
  // Set transition for smooth/glitchy movement
  element.style.transition = `transform ${0.1 + Math.random() * 0.2}s, filter ${0.1 + Math.random() * 0.2}s`;
}

// Distort heading elements
function distortHeading(element) {
  // Randomize text properties
  element.style.letterSpacing = `${Math.random() * 4 - 2}px`;
  element.style.transform = `skew(${Math.random() * 5 - 2.5}deg) rotate(${Math.random() * 2 - 1}deg)`;
  
  // Occasionally add text shadow for glitch effect
  if (Math.random() > 0.7) {
    const textShadows = [
      `${Math.random() * 4 - 2}px ${Math.random() * 4 - 2}px 0px rgba(255,0,0,0.7)`,
      `${Math.random() * 4 - 2}px ${Math.random() * 4 - 2}px 0px rgba(0,0,255,0.7)`
    ];
    element.style.textShadow = textShadows.join(', ');
  }
  
  // Random color changes
  if (Math.random() > 0.7) {
    element.style.color = getRandomDistortedColor();
  }
  
  // Set transition for smooth/glitchy movement
  element.style.transition = `all ${0.1 + Math.random() * 0.3}s`;
}

// Distort text blocks like paragraphs
function distortTextBlock(element) {
  // Subtle distortion for readability
  element.style.transform = `skew(${Math.random() * 3 - 1.5}deg)`;
  
  // Occasional letter spacing changes
  if (Math.random() > 0.7) {
    element.style.letterSpacing = `${Math.random() * 2 - 1}px`;
  }
  
  // Random text effects
  if (Math.random() > 0.8) {
    element.style.filter = `blur(${Math.random() * 0.5}px)`;
  }
  
  // Set transition for smooth/glitchy movement
  element.style.transition = `all ${0.2 + Math.random() * 0.3}s`;
}

// Distort generic elements
function distortGenericElement(element) {
  const translateX = Math.random() * 20 - 10;
  const translateY = Math.random() * 20 - 10;
  const rotate = Math.random() * 5 - 2.5;
  const skewX = Math.random() * 10 - 5;
  const skewY = Math.random() * 10 - 5;
  
  // Apply random transforms
  element.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg) skew(${skewX}deg, ${skewY}deg)`;
  
  // Sometimes change the element's dimensions slightly
  if (Math.random() > 0.8) {
    const scaleFactor = 0.95 + Math.random() * 0.1;
    element.style.transform += ` scale(${scaleFactor})`;
  }
  
  // Random opacity changes
  if (Math.random() > 0.8) {
    element.style.opacity = 0.7 + Math.random() * 0.3;
  }
  
  // Occasionally add a filter
  if (Math.random() > 0.8) {
    element.style.filter = `contrast(${1 + Math.random() * 0.3}) brightness(${0.9 + Math.random() * 0.2})`;
  }
  
  // Set transition for smooth/glitchy movement
  element.style.transition = `all ${0.1 + Math.random() * 0.2}s`;
}

// Apply extra glitchy effects to an element
function applyGlitchEffects(element) {
  const effect = Math.floor(Math.random() * 5);
  
  switch (effect) {
    case 0: // Color shifting
      element.style.filter = `hue-rotate(${Math.random() * 360}deg) saturate(${1 + Math.random() * 3})`;
      break;
      
    case 1: // Extreme skewing
      element.style.transform += ` skew(${Math.random() * 30 - 15}deg, ${Math.random() * 30 - 15}deg)`;
      break;
      
    case 2: // Extreme displacement
      if (element.style.position !== 'fixed' && element.style.position !== 'absolute') {
        element.style.position = 'relative';
      }
      element.style.left = `${Math.random() * 40 - 20}px`;
      element.style.top = `${Math.random() * 40 - 20}px`;
      break;
      
    case 3: // Flip or rotate
      element.style.transform += ` rotateY(${Math.random() > 0.5 ? '180deg' : '0deg'}) rotateX(${Math.random() > 0.5 ? '180deg' : '0deg'})`;
      break;
      
    case 4: // Extreme blur and contrast
      element.style.filter = `blur(${Math.random() * 3}px) contrast(${1 + Math.random() * 2})`;
      break;
  }
}

// Get a random distorted color
function getRandomDistortedColor() {
  const colors = [
    '#ff0000', // Red
    '#ff00ff', // Magenta
    '#0000ff', // Blue
    '#00ffff', // Cyan
    '#ffffff', // White
    '#000000'  // Black
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Distort text nodes for even more glitchy appearance
function distortTextNodes() {
  // Store original text if we haven't already
  if (originalTextNodes.size === 0) {
    storeTextNodes();
  }
  
  // Only distort some text nodes to maintain partial readability
  originalTextNodes.forEach((originalText, node) => {
    // Random chance to distort this specific node
    if (Math.random() > 0.9) {
      const distortType = Math.floor(Math.random() * 4);
      
      switch (distortType) {
        case 0: // Character replacement
          node.nodeValue = distortWithRandomChars(originalText);
          break;
        case 1: // Reverse text
          node.nodeValue = originalText.split('').reverse().join('');
          break;
        case 2: // Case change
          node.nodeValue = Math.random() > 0.5 ? 
            originalText.toUpperCase() : originalText.toLowerCase();
          break;
        case 3: // Letter spacing (HTML might not work in text nodes)
          // Just scramble a bit
          node.nodeValue = scrambleText(originalText);
          break;
      }
    }
  });
}

// Replace some characters with random ones
function distortWithRandomChars(text) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  return text.split('').map(char => {
    return Math.random() > 0.9 ? chars.charAt(Math.floor(Math.random() * chars.length)) : char;
  }).join('');
}

// Scramble parts of text
function scrambleText(text) {
  // Split into words
  const words = text.split(' ');
  
  // Scramble some words
  return words.map(word => {
    if (word.length > 3 && Math.random() > 0.8) {
      // Keep first and last letter, scramble middle
      const first = word[0];
      const last = word[word.length - 1];
      const middle = word.substring(1, word.length - 1).split('');
      
      // Shuffle middle letters
      for (let i = middle.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [middle[i], middle[j]] = [middle[j], middle[i]];
      }
      
      return first + middle.join('') + last;
    }
    return word;
  }).join(' ');
}

// Start continuous distortion interval
function startDistortionInterval() {
  // Clear any existing interval
  if (distortionInterval) {
    clearInterval(distortionInterval);
  }
  
  // Create new interval that regularly updates distortions
  distortionInterval = setInterval(() => {
    distortPageElements();
  }, 1000); // Update every second
}

// Modify your existing activate/deactivate functions to include webpage distortion
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
  
  // Start distorting the webpage itself
  startWebpageDistortion();
  
  console.log("Glitch effect activated");
}

function deactivateGlitch() {
  if (!overlayElement) return;
  
  // Hide the overlay
  overlayElement.style.display = 'none';
  isGlitchActive = false;
  
  // Stop animations
  stopGlitchAnimations();
  
  // Stop distorting the webpage and restore it
  stopWebpageDistortion();
  
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

