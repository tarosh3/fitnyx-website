import { useEffect, useRef } from 'react'

export default function Cursor() {
  const crRef = useRef(null)
  const crrRef = useRef(null)

  useEffect(() => {
    if (window.innerWidth < 768) return

    const cr = crRef.current
    const crr = crrRef.current
    let mx = 0, my = 0, rx = 0, ry = 0

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      cr.style.left = mx + 'px'
      cr.style.top = my + 'px'
    }

    document.addEventListener('mousemove', onMove)

    let rafId
    function loop() {
      rx += (mx - rx) * 0.11
      ry += (my - ry) * 0.11
      crr.style.left = rx + 'px'
      crr.style.top = ry + 'px'
      rafId = requestAnimationFrame(loop)
    }
    loop()

    const hoverEls = document.querySelectorAll('a,button,.card,.gc,.rc,.pc')
    const enter = () => {
      cr.style.width = '16px'
      cr.style.height = '16px'
      crr.style.width = '50px'
      crr.style.height = '50px'
    }
    const leave = () => {
      cr.style.width = '8px'
      cr.style.height = '8px'
      crr.style.width = '32px'
      crr.style.height = '32px'
    }

    // Use MutationObserver to handle dynamic elements
    const attachHovers = () => {
      document.querySelectorAll('a,button,.card,.gc,.rc,.pc').forEach((el) => {
        el.removeEventListener('mouseenter', enter)
        el.removeEventListener('mouseleave', leave)
        el.addEventListener('mouseenter', enter)
        el.addEventListener('mouseleave', leave)
      })
    }

    attachHovers()
    const observer = new MutationObserver(attachHovers)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div id="cr" ref={crRef}></div>
      <div id="cr-r" ref={crrRef}></div>
    </>
  )
}
