import { useEffect, useRef } from 'react'

export default function ParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let particles = []
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let w, h
    let rafId

    function resize() {
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.scale(dpr, dpr)
      initParticles()
    }

    function initParticles() {
      const count = Math.min(Math.floor((w * h) / 35000), 50)
      particles = []
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          size: Math.random() * 2 + 0.5,
          alpha: Math.random() * 0.4 + 0.1,
          phase: Math.random() * Math.PI * 2,
          color: Math.random() > 0.3 ? '#61c894' : '#3DFFD4',
        })
      }
    }

    function draw(time) {
      ctx.clearRect(0, 0, w, h)

      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10
        if (p.y < -10) p.y = h + 10
        if (p.y > h + 10) p.y = -10

        const twinkle = Math.sin(time * 0.0015 + p.phase) * 0.5 + 0.5
        ctx.globalAlpha = p.alpha * (0.2 + 0.8 * twinkle)
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.strokeStyle = '#61c894'
      ctx.lineWidth = 0.3
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 90) {
            ctx.globalAlpha = (1 - dist / 90) * 0.08
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      ctx.globalAlpha = 1
      rafId = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    rafId = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return <canvas ref={canvasRef} id="particle-canvas" />
}
