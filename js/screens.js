// ══════════════════════════════════════════════════
// FITNYX DYNAMIC SCREEN BUFFER SYSTEM (IMAGE FALLBACK)
// ══════════════════════════════════════════════════
// Completely replaced synthetic HTML5 Canvas math graphics with a 
// hard-mapped sequential image loader array pulling raw pixel binaries.

const SCREENS = [];

for (let i = 1; i <= 5; i++) {
  const canvas = document.createElement('canvas');
  // Enforce rigid 3X Retina mappings natively scaling to identically match Mobile Screenshot geometry
  canvas.width = 1170;
  canvas.height = 2532;
  const ctx = canvas.getContext('2d');
  
  // Fill absolute pitch black void behind loading frame
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 1170, 2532);
  
  const img = new Image();
  img.src = `assets/iphoneImage${i}.png`;
  
  img.onload = () => {
    // Blast original retina screenshot pixel format covering standard hardware aspect frame
    canvas.width = 1170;
    canvas.height = 2532;
    ctx.drawImage(img, 0, 0, 1170, 2532);

    // Explicitly dispatch the splashRendered event on first load to trigger scroll-scene.js bootstrap initialization logic
    if (i === 1) window.dispatchEvent(new Event('splashRendered'));
    // Also dispatch generic buffer updates to smoothly refresh any WebGL mapped textures globally
    window.dispatchEvent(new Event('screenRendered'));
  };

  img.onerror = () => {
    ctx.fillStyle = '#e73c3c';
    ctx.fillRect(0, 0, 1170, 2532);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = '700 80px sans-serif';
    ctx.fillText(`MISSING: iphoneImage${i}.png`, 1170/2, 2532/2);
    if (i === 1) window.dispatchEvent(new Event('splashRendered'));
    window.dispatchEvent(new Event('screenRendered'));
  };
  
  SCREENS.push(canvas);
}

// Global mobile image render hooks for responsive DOM swapping (Width < 1024px)
function getBase64Screen(idx){
  return SCREENS[idx].toDataURL('image/jpeg', 0.9);
}

function updateMobileImages(){
  const els=document.querySelectorAll('.mob-screen-img');
  els.forEach((el,i)=>{
    // Array natively holds 0-4 matching precisely to the 5 content blocks
    if(i < 5) el.src = getBase64Screen(i);
  });
}

// Update DOM elements the moment rendering executes
window.addEventListener('screenRendered', updateMobileImages);
window.addEventListener('splashRendered', updateMobileImages);
