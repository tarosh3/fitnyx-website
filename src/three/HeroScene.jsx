import { useEffect, useRef } from 'react'

export default function HeroScene() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !window.THREE) return

    const THREE = window.THREE
    let w = window.innerWidth
    let h = window.innerHeight
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))
    renderer.setSize(w, h)
    renderer.setClearColor(0, 0)
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.shadowMap.enabled = true

    const scene = new THREE.Scene()
    const cam = new THREE.PerspectiveCamera(40, w / h, 0.1, 100)
    cam.position.set(2.5, 0, 7)
    cam.lookAt(1, 0, 0)

    // Enhanced lighting setup — identical to original
    scene.add(new THREE.AmbientLight(0xffffff, 0.35))

    const rim = new THREE.PointLight(0x61c894, 4, 20)
    rim.position.set(-3, 3, 2)
    scene.add(rim)

    const fill = new THREE.PointLight(0x3DFFD4, 2.5, 15)
    fill.position.set(5, 2, 5)
    scene.add(fill)

    const warm = new THREE.PointLight(0xFF6B35, 0.8, 12)
    warm.position.set(0, -3, 3)
    scene.add(warm)

    const top = new THREE.PointLight(0xffffff, 1.5, 15)
    top.position.set(0, 5, 2)
    scene.add(top)

    let phone = null
    const loader = new THREE.GLTFLoader()

    function getScale() {
      if (innerWidth <= 480) return 0.2
      if (innerWidth <= 768) return 0.25
      if (innerWidth <= 1024) return 0.3
      return 0.35
    }
    function getXPos() {
      if (innerWidth <= 768) return 0.8
      if (innerWidth <= 1024) return 1.5
      return 2.2
    }

    loader.load(`${import.meta.env.BASE_URL}metal_dumbell.glb`, (gltf) => {
      phone = gltf.scene
      phone.scale.setScalar(getScale())
      phone.position.set(getXPos(), -0.2, 0)
      phone.rotation.set(0.05, -0.3, 0.05)
      phone.traverse((c) => {
        if (c.isMesh) { c.castShadow = true; c.receiveShadow = true }
      })
      scene.add(phone)
    }, undefined, (e) => console.warn('GLB load:', e))

    let mx = 0.5, my = 0.5, targetMX = 0.5, targetMY = 0.5, clk = 0

    const onMove = (e) => { targetMX = e.clientX / innerWidth; targetMY = e.clientY / innerHeight }
    document.addEventListener('mousemove', onMove)

    let rafId
    function animate() {
      rafId = requestAnimationFrame(animate)
      clk += 0.006
      mx += (targetMX - mx) * 0.06
      my += (targetMY - my) * 0.06

      if (phone) {
        const targetScale = getScale()
        const curScale = phone.scale.x
        phone.scale.setScalar(curScale + (targetScale - curScale) * 0.03)
        const targetXPos = getXPos()
        phone.position.x += (targetXPos - phone.position.x) * 0.03
        phone.rotation.y = -0.3 + Math.sin(clk * 0.4) * 0.04 + (mx - 0.5) * (2.4 * Math.PI)
        phone.rotation.x = 0.05 + (my - 0.5) * 1.0
        phone.position.y = -0.2 + Math.sin(clk * 0.5) * 0.06
      }

      rim.intensity = 3.5 + 1.5 * Math.sin(clk * 1.2)
      fill.intensity = 2 + 1 * Math.sin(clk * 0.8 + 1)
      warm.intensity = 0.6 + 0.3 * Math.sin(clk * 1.5 + 2)

      renderer.render(scene, cam)
    }
    animate()

    const onResize = () => {
      w = window.innerWidth
      h = window.innerHeight
      renderer.setSize(w, h)
      cam.aspect = w / h
      cam.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} id="hero-canvas" />
}
