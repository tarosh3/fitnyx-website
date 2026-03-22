// ══════════════════════════════════════════════════
// HERO SCENE — phone floating, subtle background
// ══════════════════════════════════════════════════
(function(){
  const canvas=document.getElementById('hero-canvas');
  if(!canvas)return;
  const W=()=>innerWidth,H=()=>innerHeight;
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setSize(W(),H());
  renderer.setClearColor(0,0);
  renderer.outputEncoding=THREE.sRGBEncoding;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.1;
  renderer.shadowMap.enabled=true;

  const scene=new THREE.Scene();
  const cam=new THREE.PerspectiveCamera(40,W()/H(),.1,100);
  cam.position.set(2.5,0,7);
  cam.lookAt(1,0,0);

  scene.add(new THREE.AmbientLight(0xffffff,.4));
  const rim=new THREE.PointLight(0x61c894,4,20);rim.position.set(-3,3,2);scene.add(rim);
  const fill=new THREE.PointLight(0x3DFFD4,2,15);fill.position.set(5,2,5);scene.add(fill);

  let phone=null;
  const loader=new THREE.GLTFLoader();
  loader.load('metal_dumbell.glb',gltf=>{
    phone=gltf.scene;
    // The raw metal dumbbell is exported at a completely massive scale.
    // Reducing from 1.8 down to 0.35 to tuck it neatly into the right half.
    phone.scale.setScalar(0.35);
    phone.position.set(2.2,-.2,0);
    phone.rotation.set(.05,-.3,.05);
    phone.traverse(c=>{if(c.isMesh){c.castShadow=true;c.receiveShadow=true;}});
    scene.add(phone);
  },undefined,e=>console.warn('GLB load:',e));

  let mx=.5,my=.5,clk=0;
  let targetMX=.5,targetMY=.5;
  document.addEventListener('mousemove',e=>{targetMX=e.clientX/innerWidth;targetMY=e.clientY/innerHeight;});

  function animate(){
    requestAnimationFrame(animate);
    clk+=.006;
    
    // Smooth damping for cursor movements
    mx += (targetMX - mx) * 0.08;
    my += (targetMY - my) * 0.08;

    if(phone){
      // 120% total horizontal rotation (60% of a full 360 circle per side)
      // 60% of 2PI is 1.2 * PI (approx 3.77 radians).
      // (mx - 0.5) gives [-0.5, 0.5]. We multiply by (2.4 * Math.PI) to get ±3.77 rad.
      phone.rotation.y = -.3 + Math.sin(clk*.4)*.04 + (mx-.5) * (2.4 * Math.PI);
      
      // Vertical tilt (±28 degrees = ±0.5 rad)
      phone.rotation.x = .05 + (my-.5)*1.0;
      
      phone.position.y = -.2 + Math.sin(clk*.5)*.04;
    }
    rim.intensity=3.5+1.5*Math.sin(clk*1.2);
    renderer.render(scene,cam);
  }
  animate();
  window.addEventListener('resize',()=>{renderer.setSize(W(),H());cam.aspect=W()/H();cam.updateProjectionMatrix();});
})();
