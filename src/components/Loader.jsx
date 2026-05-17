import { useEffect, useRef, useState } from 'react'
import { onLoadingChange } from '../three/loadingManager'

const MIN_SHOW_MS = 900
const FADE_MS = 700
const FALLBACK_MS = 8000

const RADIUS = 58
const CIRC = 2 * Math.PI * RADIUS

export default function Loader() {
  const [hidden, setHidden] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [pct, setPct] = useState(0)
  const [done, setDone] = useState(false)
  const mountedAt = useRef(Date.now())
  const targetRef = useRef(0)
  const displayRef = useRef(0)
  const rafRef = useRef(0)
  const finishedRef = useRef(false)

  // RAF-smoothed counter so the % glides instead of jumping.
  useEffect(() => {
    const tick = () => {
      const t = targetRef.current
      const c = displayRef.current
      const diff = t - c
      if (Math.abs(diff) < 0.05) {
        displayRef.current = t
        setPct((prev) => (prev !== Math.round(t) ? Math.round(t) : prev))
      } else {
        displayRef.current = c + diff * 0.09
        setPct(Math.round(displayRef.current))
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
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
      if (s.total > 0) {
        targetRef.current = Math.min(99, (s.loaded / s.total) * 100)
      }
      if (s.done) {
        targetRef.current = 100
        setDone(true)
        finish()
      }
    })

    const fallback = setTimeout(() => {
      targetRef.current = 100
      setDone(true)
      finish()
    }, FALLBACK_MS)

    return () => { unsub(); clearTimeout(fallback) }
  }, [])

  useEffect(() => {
    if (hidden) {
      document.body.style.overflow = ''
    } else {
      document.body.style.overflow = 'hidden'
    }
    return () => { document.body.style.overflow = '' }
  }, [hidden])

  if (hidden) return null

  const offset = CIRC * (1 - pct / 100)
  const status = done ? 'Ready' : pct < 25 ? 'Booting engine' : pct < 60 ? 'Loading 3D scenes' : pct < 95 ? 'Polishing pixels' : 'Almost there'

  return (
    <div
      className={`app-loader${fadeOut ? ' app-loader--out' : ''}${done ? ' app-loader--done' : ''}`}
      role="status"
      aria-live="polite"
      aria-label={`Loading ${pct} percent`}
    >
      <div className="app-loader-bg" aria-hidden="true">
        <span className="app-loader-aurora app-loader-aurora--1" />
        <span className="app-loader-aurora app-loader-aurora--2" />
        <span className="app-loader-aurora app-loader-aurora--3" />
        <span className="app-loader-grain" />
      </div>

      <div className="app-loader-stage">
        <div className="app-loader-orbit">
          <span className="app-loader-pulse" />
          <span className="app-loader-pulse app-loader-pulse--d" />
          <svg
            className="app-loader-ring"
            viewBox="0 0 140 140"
            width="156"
            height="156"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="fnLoaderArc" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#61c894" />
                <stop offset="60%" stopColor="#3DFFD4" />
                <stop offset="100%" stopColor="#61c894" />
              </linearGradient>
            </defs>
            <circle cx="70" cy="70" r={RADIUS} className="app-loader-ring-track" />
            <circle
              cx="70"
              cy="70"
              r={RADIUS}
              className="app-loader-ring-arc"
              stroke="url(#fnLoaderArc)"
              strokeDasharray={CIRC}
              strokeDashoffset={offset}
              transform="rotate(-90 70 70)"
            />
            <circle
              cx="70"
              cy="70"
              r={RADIUS}
              className="app-loader-ring-spin"
              strokeDasharray={`${CIRC * 0.18} ${CIRC}`}
            />
          </svg>
          <div className="app-loader-mark" aria-hidden="true">
            <span>F</span>
          </div>
        </div>

        <div className="app-loader-text">
          <div className="app-loader-wordmark" aria-hidden="true">
            {'FitNyx'.split('').map((c, i) => (
              <span key={i} style={{ animationDelay: `${0.18 + i * 0.06}s` }}>{c}</span>
            ))}
          </div>
          <div className="app-loader-meta">
            <span className="app-loader-pct">{String(pct).padStart(3, '0')}<i>%</i></span>
            <span className="app-loader-sep" />
            <span className="app-loader-status" key={status}>{status}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
