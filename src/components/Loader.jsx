import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { onLoadingChange } from '../three/loadingManager'
import FitNyxLogoAnimation from './FitNyxLogoAnimation'

const MIN_SHOW_MS = 3700
const FADE_MS = 700
const FALLBACK_MS = 8000

const IS_PRERENDER = typeof window !== 'undefined' && (window.__PRERENDER__ === true || /[?&]prerender=1\b/.test(window.location.search))

export default function Loader() {
  const [hidden, setHidden] = useState(IS_PRERENDER)
  const [fadeOut, setFadeOut] = useState(false)
  const mountedAt = useRef(Date.now())
  const finishedRef = useRef(false)
  const animRef = useRef(null)

  useLayoutEffect(() => {
    let raf1 = 0, raf2 = 0, t = 0
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        t = setTimeout(() => {
          animRef.current?.play()
        }, 120)
      })
    })
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      clearTimeout(t)
    }
  }, [])

  useEffect(() => {
    const finish = () => {
      if (finishedRef.current) return
      finishedRef.current = true
      const elapsed = Date.now() - mountedAt.current
      const wait = Math.max(0, MIN_SHOW_MS - elapsed) + 280
      setTimeout(() => {
        setFadeOut(true)
        setTimeout(() => setHidden(true), FADE_MS)
      }, wait)
    }

    const unsub = onLoadingChange((s) => {
      if (s.done) finish()
    })

    const fallback = setTimeout(finish, FALLBACK_MS)

    return () => { unsub(); clearTimeout(fallback) }
  }, [])

  useEffect(() => {
    document.body.style.overflow = hidden ? '' : 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [hidden])

  if (hidden) return null

  return (
    <div
      className={`app-loader${fadeOut ? ' app-loader--out' : ''}`}
      role="status"
      aria-label="Loading"
    >
      <div className="app-loader-stage">
        <div className="app-loader-mark" aria-hidden="true">
          <FitNyxLogoAnimation ref={animRef} size={260} autoPlay={false} />
        </div>
      </div>
    </div>
  )
}
