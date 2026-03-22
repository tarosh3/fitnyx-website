// ══════════════════════════════════════════════════
// APPLY SCREEN TEXTURE to phone's Display material
// ══════════════════════════════════════════════════

var _screenMesh = null;
var _uvsNormalized = false;

function _makeTexture(screenCanvas) {
  // Create texture directly from portrait canvas — no intermediate rotation
  var tex = new THREE.CanvasTexture(screenCanvas);
  tex.encoding = THREE.sRGBEncoding;
  tex.flipY = false;
  // Rotate texture 90° clockwise in UV space
  tex.center.set(0.5, 0.5);
  tex.rotation = Math.PI / 2;
  tex.repeat.x = -1;  // flip horizontally to un-mirror
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.generateMipmaps = false;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

// Normalize UV coordinates of a mesh to span exactly 0–1
function _normalizeUVs(mesh) {
  const geom = mesh.geometry;
  if (!geom || _uvsNormalized) return;
  const uv = geom.attributes.uv;
  if (!uv) return;

  let minU = Infinity, maxU = -Infinity, minV = Infinity, maxV = -Infinity;
  for (let i = 0; i < uv.count; i++) {
    const u = uv.getX(i), v = uv.getY(i);
    if (u < minU) minU = u;
    if (u > maxU) maxU = u;
    if (v < minV) minV = v;
    if (v > maxV) maxV = v;
  }

  const rangeU = maxU - minU || 1;
  const rangeV = maxV - minV || 1;

  for (let i = 0; i < uv.count; i++) {
    uv.setXY(i,
      (uv.getX(i) - minU) / rangeU,
      (uv.getY(i) - minV) / rangeV
    );
  }
  uv.needsUpdate = true;
  _uvsNormalized = true;
}

function applyScreenTexture(phoneScene, screenCanvas, directTex){
  var tex = directTex ? directTex : _makeTexture(screenCanvas);

  // If screen mesh already found, just update the texture
  if(_screenMesh){
    _screenMesh.material.map = tex;
    _screenMesh.material.needsUpdate = true;
    return;
  }

  // Find the screen mesh in the phone model
  let screenMeshFound = null;
  phoneScene.traverse(child => {
    if(!child.isMesh) return;
    const mats = Array.isArray(child.material) ? child.material : [child.material];
    const matName = (mats[0]?.name || '').toLowerCase();

    if(matName.includes('screen_glass') || matName.includes('screen glass')){
      child.material.transparent = true;
      child.material.opacity = 0.08;
      child.material.needsUpdate = true;
    }

    if(matName.includes('screen_bg') || matName.includes('screen bg') || matName.includes('display') || matName.includes('wallpaper')){
      screenMeshFound = child;
    }
  });

  if(!screenMeshFound) {
    console.warn('No screen mesh matched recursively!');
    return;
  }

  // Normalize UVs to 0–1 so the full texture is visible (fixes zoom)
  _normalizeUVs(screenMeshFound);

  const screenMat = new THREE.MeshBasicMaterial({ map: tex, color: 0xffffff, toneMapped: false });
  screenMat.name = 'ScreenTexture';
  screenMeshFound.material = screenMat;
  _screenMesh = screenMeshFound;
}

function updateScreenTexture(screenCanvas) {
  if (!_screenMesh) return;
  const tex = _makeTexture(screenCanvas);
  _screenMesh.material.map = tex;
  _screenMesh.material.needsUpdate = true;
}
