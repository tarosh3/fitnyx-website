import { useRef, useEffect } from 'react'

export default function ScrollScene() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !window.THREE) return

    const THREE = window.THREE

    // ══════════════════════════════════════════
    // SCREENS — identical to original screens.js
    // ══════════════════════════════════════════
    const SCREENS = []
    for (let i = 1; i <= 5; i++) {
      const c = document.createElement('canvas')
      c.width = 1170
      c.height = 2532
      const ctx = c.getContext('2d')
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, 1170, 2532)

      const img = new Image()
      img.src = `${import.meta.env.BASE_URL}assets/iphoneImage${i}.png`
      img.onload = () => {
        c.width = 1170
        c.height = 2532
        c.getContext('2d').drawImage(img, 0, 0, 1170, 2532)
        if (i === 1) window.dispatchEvent(new Event('splashRendered'))
        window.dispatchEvent(new Event('screenRendered'))
      }
      img.onerror = () => {
        ctx.fillStyle = '#e73c3c'
        ctx.fillRect(0, 0, 1170, 2532)
        ctx.fillStyle = '#ffffff'
        ctx.textAlign = 'center'
        ctx.font = '700 80px sans-serif'
        ctx.fillText(`MISSING: iphoneImage${i}.png`, 1170 / 2, 2532 / 2)
        if (i === 1) window.dispatchEvent(new Event('splashRendered'))
        window.dispatchEvent(new Event('screenRendered'))
      }
      SCREENS.push(c)
    }

    // ══════════════════════════════════════════
    // THREE-UTILS — identical to original three-utils.js
    // ══════════════════════════════════════════
    var _screenMesh = null
    var _uvsNormalized = false

    function _makeTexture(screenCanvas) {
      var tex = new THREE.CanvasTexture(screenCanvas)
      tex.encoding = THREE.sRGBEncoding
      tex.flipY = false
      tex.center.set(0.5, 0.5)
      tex.rotation = Math.PI / 2
      tex.repeat.x = -1
      tex.wrapS = THREE.ClampToEdgeWrapping
      tex.wrapT = THREE.ClampToEdgeWrapping
      tex.generateMipmaps = false
      tex.minFilter = THREE.LinearFilter
      tex.magFilter = THREE.LinearFilter
      tex.needsUpdate = true
      return tex
    }

    function _normalizeUVs(mesh) {
      var geom = mesh.geometry
      if (!geom || _uvsNormalized) return
      var uv = geom.attributes.uv
      if (!uv) return
      var minU = Infinity, maxU = -Infinity, minV = Infinity, maxV = -Infinity
      for (var i = 0; i < uv.count; i++) {
        var u = uv.getX(i), v = uv.getY(i)
        if (u < minU) minU = u
        if (u > maxU) maxU = u
        if (v < minV) minV = v
        if (v > maxV) maxV = v
      }
      var rangeU = maxU - minU || 1
      var rangeV = maxV - minV || 1
      for (var i = 0; i < uv.count; i++) {
        uv.setXY(i, (uv.getX(i) - minU) / rangeU, (uv.getY(i) - minV) / rangeV)
      }
      uv.needsUpdate = true
      _uvsNormalized = true
    }

    function applyScreenTexture(phoneScene, screenCanvas, directTex) {
      var tex = directTex ? directTex : _makeTexture(screenCanvas)
      if (_screenMesh) {
        _screenMesh.material.map = tex
        _screenMesh.material.needsUpdate = true
        return
      }
      var screenMeshFound = null
      phoneScene.traverse(function (child) {
        if (!child.isMesh) return
        var mats = Array.isArray(child.material) ? child.material : [child.material]
        var matName = (mats[0] && mats[0].name || '').toLowerCase()
        if (matName.includes('screen_glass') || matName.includes('screen glass')) {
          child.material.transparent = true
          child.material.opacity = 0.08
          child.material.needsUpdate = true
        }
        if (matName.includes('screen_bg') || matName.includes('screen bg') || matName.includes('display') || matName.includes('wallpaper')) {
          screenMeshFound = child
        }
      })
      if (!screenMeshFound) {
        console.warn('No screen mesh matched recursively!')
        return
      }
      _normalizeUVs(screenMeshFound)
      var screenMat = new THREE.MeshBasicMaterial({ map: tex, color: 0xffffff, toneMapped: false })
      screenMat.name = 'ScreenTexture'
      screenMeshFound.material = screenMat
      _screenMesh = screenMeshFound
    }

    // ══════════════════════════════════════════
    // SCROLL SCENE — identical to original scroll-scene.js
    // ══════════════════════════════════════════
    var W = function () { return innerWidth }, H = function () { return innerHeight }
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.setSize(W(), H())
    renderer.setClearColor(0, 0)
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    renderer.shadowMap.enabled = true

    var scene = new THREE.Scene()
    var cam = new THREE.PerspectiveCamera(36, W() / H(), 0.1, 100)
    cam.position.set(0, 0, 7)
    cam.lookAt(0, 0, 0)

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.35))
    var key = new THREE.SpotLight(0xffffff, 30, 20, Math.PI * 0.15, 0.3, 1.5)
    key.position.set(3, 6, 5)
    key.target.position.set(0, 0, 0)
    key.castShadow = true
    scene.add(key)
    scene.add(key.target)
    var rimG = new THREE.PointLight(0x61c894, 8, 18)
    rimG.position.set(-4, 2, -2)
    scene.add(rimG)
    var rimT = new THREE.PointLight(0x3DFFD4, 5, 15)
    rimT.position.set(4, 3, 3)
    scene.add(rimT)

    // Floor
    var floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial({ color: 0x050508, metalness: 0.8, roughness: 0.3, transparent: true, opacity: 0.4 })
    )
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -2.8
    scene.add(floor)

    var phone = null, currentScreen = 0
    var loader2 = new THREE.GLTFLoader()
    var lastScreen = -1

    loader2.load(`${import.meta.env.BASE_URL}3d-models/iphone 17_4.glb`, function (gltf) {
      phone = gltf.scene
      phone.scale.setScalar(getPhoneScale())
      phone.position.set(0, 0, 0)
      phone.rotation.set(0, 0.3, 0)
      scene.add(phone)
      phone.traverse(function (c) { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true } })
      if (lastScreen === -1) applyScreenTexture(phone, SCREENS[0])
    }, undefined, function (e) { console.warn('Scroll GLB:', e) })

    var onSplash = function () {
      if (phone && lastScreen === -1) applyScreenTexture(phone, SCREENS[0])
    }
    window.addEventListener('splashRendered', onSplash)

    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)) }

    function getPhoneScale() {
      var w = innerWidth
      if (w <= 480) return 0.38
      if (w <= 768) return 0.42
      if (w <= 1024) return 0.50
      return 0.6
    }
    function getSwingAmplitude() {
      var w = innerWidth
      if (w <= 480) return 0
      if (w <= 768) return 0
      if (w <= 1024) return 1.6
      return 2.2
    }
    function getPhoneYOffset() {
      var w = innerWidth
      if (w <= 768) return 0
      if (w <= 1024) return -0.1
      return -0.1
    }

    var curX = 0, curY = 0, curRY = 0, curRX = 0, curRZ = 0
    var clk2 = 0
    var mobileAnchor = null

    let scrollElTop = 0
    let scrollElHeight = 0
    let scrollResizeObserver = null

    function updateLayout() {
      const scrollEl = document.getElementById('phone-scroll')
      if (scrollEl) {
        const rect = scrollEl.getBoundingClientRect()
        scrollElTop = rect.top + window.scrollY
        scrollElHeight = scrollEl.offsetHeight
      }
    }
    updateLayout()

    const scrollEl = document.getElementById('phone-scroll')
    if (scrollEl && typeof ResizeObserver !== 'undefined') {
      scrollResizeObserver = new ResizeObserver(updateLayout)
      scrollResizeObserver.observe(scrollEl)
    }
    window.addEventListener('phoneScrollLayoutChange', updateLayout)

    function getScrollState() {
      if (scrollElHeight <= innerHeight) return { prog: 0, sectionIdx: -1, steppedRaw: -1 }
      const scrolled = clamp(window.scrollY - scrollElTop, 0, scrollElHeight - innerHeight)
      const prog = scrolled / (scrollElHeight - innerHeight)
      const raw = prog * 4 - 1
      const currentSection = Math.floor(raw)
      const f = raw - currentSection
      
      let mappedF = 0
      if (f < 0.15) mappedF = 0
      else if (f > 0.85) mappedF = 1
      else { 
        const t = (f - 0.15) / 0.70
        mappedF = t * t * (3 - 2 * t) 
      }
      
      const steppedRaw = currentSection + mappedF
      const sectionIdx = clamp(Math.round(steppedRaw), -1, 3)
      return { prog, sectionIdx, steppedRaw }
    }

    function getMobileTargetY(sectionIdx) {
      const sections = document.querySelectorAll('#phone-scroll .phone-section')
      if (!sections.length) return 0

      const safeIdx = clamp(sectionIdx < 0 ? 0 : sectionIdx, 0, sections.length - 1)
      const activeSection = sections[safeIdx]
      const content = activeSection.querySelector('.ps-content')
      const fallbackAnchor = activeSection.dataset.copyPlacement === 'top' ? 'bottom' : 'top'

      if (!content) {
        mobileAnchor = mobileAnchor || fallbackAnchor
        return mobileAnchor === 'top' ? 1.1 : -1.1
      }

      const nav = document.querySelector('nav')
      const safeTop = (nav ? nav.getBoundingClientRect().bottom : 0) + 18
      const safeBottom = innerHeight - 28
      const rect = content.getBoundingClientRect()
      const topSpace = clamp(rect.top - safeTop, 0, innerHeight)
      const bottomSpace = clamp(safeBottom - rect.bottom, 0, innerHeight)
      const preferredAnchor = topSpace >= bottomSpace ? 'top' : 'bottom'

      if (!mobileAnchor) mobileAnchor = fallbackAnchor

      const currentSpace = mobileAnchor === 'top' ? topSpace : bottomSpace
      const preferredSpace = preferredAnchor === 'top' ? topSpace : bottomSpace
      const minClearance = Math.min(innerHeight * 0.34, 300)

      if (preferredAnchor !== mobileAnchor && (preferredSpace > currentSpace + 32 || currentSpace < minClearance * 0.8)) {
        mobileAnchor = preferredAnchor
      }

      const anchorSpace = mobileAnchor === 'top' ? topSpace : bottomSpace
      const breathingRoom = clamp((anchorSpace - minClearance * 0.75) / (innerHeight * 0.2), 0, 1)
      const offset = THREE.MathUtils.lerp(1.05, 1.78, breathingRoom)

      return mobileAnchor === 'top' ? offset : -offset
    }

    var rafId
    function animate() {
      rafId = requestAnimationFrame(animate)
      if (phone) phone.visible = true
      clk2 += 0.007

      var state = getScrollState()
      var sectionIdx = state.sectionIdx
      var steppedRaw = state.steppedRaw
      var swingAmp = getSwingAmplitude()
      var yOff = getPhoneYOffset()
      var isMobile = innerWidth <= 768

      var targetX = -Math.cos(steppedRaw * Math.PI) * swingAmp
      var targetY = yOff
      var targetRY, targetRX, targetRZ
      if (isMobile) {
        targetX = 0
        targetY = getMobileTargetY(sectionIdx)
        targetRY = steppedRaw * -Math.PI * 2 + (targetY * -0.08)
        targetRX = 0.08 + Math.sin(steppedRaw * Math.PI) * 0.18
        targetRZ = 0
      } else {
        targetY += Math.sin(steppedRaw * Math.PI) * -0.5
        targetRY = steppedRaw * -Math.PI * 2 + (targetX * -0.06)
        targetRX = 0.08 + Math.sin(steppedRaw * Math.PI) * 0.15
        targetRZ = -targetX * 0.015
      }

      var damp = isMobile ? 0.09 : 0.07
      curX += (targetX - curX) * damp
      var yDamp = isMobile ? 0.32 : damp
      curY += (targetY - curY) * yDamp
      curRY += (targetRY - curRY) * (isMobile ? 0.18 : damp)
      curRX += (targetRX - curRX) * (isMobile ? 0.18 : damp)
      curRZ += (targetRZ - curRZ) * damp

      if (phone) {
        phone.position.x = curX
        phone.position.y = curY + Math.sin(clk2 * 0.5) * 0.025
        phone.rotation.y = curRY
        phone.rotation.x = curRX
        phone.rotation.z = curRZ
        var targetScale = getPhoneScale()
        var currentScale = phone.scale.x
        phone.scale.setScalar(currentScale + (targetScale - currentScale) * 0.05)
        if (sectionIdx !== lastScreen) {
          lastScreen = sectionIdx
          applyScreenTexture(phone, SCREENS[sectionIdx + 1])
        }
      }

      rimG.intensity = 7 + 2 * Math.sin(clk2 * 1.8)
      rimT.intensity = 4.5 + 1.5 * Math.sin(clk2 * 2.1 + 1)
      renderer.render(scene, cam)
    }
    animate()

    function onResize() {
      renderer.setSize(W(), H())
      cam.aspect = W() / H()
      cam.updateProjectionMatrix()
      updateLayout()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafId)
      scrollResizeObserver?.disconnect()
      window.removeEventListener('phoneScrollLayoutChange', updateLayout)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('splashRendered', onSplash)
      renderer.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} id="phone-canvas" />
}
