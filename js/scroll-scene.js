// ══════════════════════════════════════════════════
// SCROLLYTELLING PHONE SCENE
// Sticky canvas — phone moves zig-zag as user scrolls
// ══════════════════════════════════════════════════
(function () {
  const canvas = document.getElementById('phone-canvas');
  if (!canvas) return;
  const W = () => innerWidth, H = () => innerHeight;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(W(), H());
  renderer.setClearColor(0, 0);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.shadowMap.enabled = true;

  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(36, W() / H(), .1, 100);
  cam.position.set(0, 0, 7);
  cam.lookAt(0, 0, 0);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, .35));
  const key = new THREE.SpotLight(0xffffff, 30, 20, Math.PI * .15, .3, 1.5);
  key.position.set(3, 6, 5); key.target.position.set(0, 0, 0);
  key.castShadow = true; scene.add(key); scene.add(key.target);
  const rimG = new THREE.PointLight(0x61c894, 8, 18); rimG.position.set(-4, 2, -2); scene.add(rimG);
  const rimT = new THREE.PointLight(0x3DFFD4, 5, 15); rimT.position.set(4, 3, 3); scene.add(rimT);

  // Floor reflection plane
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: 0x050508, metalness: .8, roughness: .3, transparent: true, opacity: .4 })
  );
  floor.rotation.x = -Math.PI / 2; floor.position.y = -2.8; scene.add(floor);

  let phone = null, currentScreen = 0;
  const loader2 = new THREE.GLTFLoader();

  // Route directly to the compiled '.glb' filename bypassing any browser-space URL parsing bugs!
  loader2.load('3d-models/iphone 17_4.glb', gltf => {
    phone = gltf.scene;
    // CRITICAL: The S21 GLB natively generates 27 units tall inside WebGL!
    // Setting 15.0 scale mathematically blows its height to >400 space units, completely swallowing the entire Perspective camera and rendering the volume totally invisible.
    phone.scale.setScalar(0.6);
    phone.position.set(0, 0, 0);
    phone.rotation.set(0, .3, 0);
    scene.add(phone);
    phone.traverse(c => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });

    // Mount the primary Splash Canvas natively! (three-utils automatically handles the -90deg mapping now)
    if (lastScreen === -1) applyScreenTexture(phone, SCREENS[0]);

  }, undefined, e => console.warn('Scroll GLB:', e));

  // Catch the splash render event to ensure the WebGL texture immediately paints once the Base64 image bytes stream into RAM
  window.addEventListener('splashRendered', () => {
    if (phone && lastScreen === -1) applyScreenTexture(phone, SCREENS[0]);
  });

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  let curX = 0, curY = 0, curRY = 0, curRX = 0, curRZ = 0;
  let clk2 = 0, lastScreen = -1;

  function getScrollState() {
    const scrollEl = document.getElementById('phone-scroll');
    if (!scrollEl) return { prog: 0, sectionIdx: 0, steppedRaw: 0 };
    const rect = scrollEl.getBoundingClientRect();
    const totalH = scrollEl.offsetHeight;
    if (totalH <= innerHeight) return { prog: 0, sectionIdx: 0, steppedRaw: 0 };

    // Smooth progress from 0 (top of sticky container) to 1 (bottom)
    const scrolled = clamp(-rect.top, 0, totalH - innerHeight);
    const prog = scrolled / (totalH - innerHeight);

    // The phone must HOLD position while the text is on screen,
    // and ONLY rapidly transition between sections.
    const raw = prog * 4 - 1;
    const currentSection = Math.floor(raw);
    const f = raw - currentSection;

    let mappedF = 0;
    // Deadzone: 15% before and after the text is centered, the phone does not move at all.
    if (f < 0.15) mappedF = 0;
    else if (f > 0.85) mappedF = 1;
    else {
      // Ease in-out during the 70% gap between the sections
      const t = (f - 0.15) / 0.70;
      mappedF = t * t * (3 - 2 * t);
    }

    const steppedRaw = currentSection + mappedF;
    const sectionIdx = clamp(Math.round(steppedRaw), -1, 3);

    return { prog, sectionIdx, steppedRaw };
  }

  function animate() {
    requestAnimationFrame(animate);
    if (window.innerWidth <= 1024) {
      if (phone) phone.visible = false;
      renderer.clear();
      return;
    } else {
      if (phone) phone.visible = true;
    }
    clk2 += .007;

    const { prog, sectionIdx, steppedRaw } = getScrollState();

    // X swings strictly based on the plateaued steps (-2.2 to +2.2)
    const targetX = -Math.cos(steppedRaw * Math.PI) * 2.2;

    // Jump exclusively during the flips
    const targetY = Math.sin(steppedRaw * Math.PI) * -0.5 - 0.1;

    // Complete 360 degree (2 PI) rotation loops per step transition. 
    const targetRY = steppedRaw * -Math.PI * 2 + (targetX * -0.06);

    // Pitch forward when settled
    const targetRX = 0.08 + Math.sin(steppedRaw * Math.PI) * 0.15;

    const targetRZ = -targetX * 0.015;

    // Physical inertia damping
    curX += (targetX - curX) * .07;
    curY += (targetY - curY) * .07;
    curRY += (targetRY - curRY) * .07;
    curRX += (targetRX - curRX) * .07;
    curRZ += (targetRZ - curRZ) * .07;

    if (phone) {
      phone.position.x = curX;
      phone.position.y = curY + Math.sin(clk2 * .5) * .025;
      phone.rotation.y = curRY;
      phone.rotation.x = curRX;
      phone.rotation.z = curRZ;

      // Change screen texture when section changes
      if (sectionIdx !== lastScreen) {
        lastScreen = sectionIdx;
        // Shift array up mathematically by 1 to accommodate SPLASH at index 0.
        applyScreenTexture(phone, SCREENS[sectionIdx + 1]);
      }
    }

    // Rim light flicker
    rimG.intensity = 7 + 2 * Math.sin(clk2 * 1.8);
    rimT.intensity = 4.5 + 1.5 * Math.sin(clk2 * 2.1 + 1);

    renderer.render(scene, cam);
  }
  animate();
  window.addEventListener('resize', () => { renderer.setSize(W(), H()); cam.aspect = W() / H(); cam.updateProjectionMatrix(); });
})();
