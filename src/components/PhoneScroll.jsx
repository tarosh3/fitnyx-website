import { useEffect, useRef } from 'react'
import ScrollScene from '../three/ScrollScene'
import useIsMobileViewport from '../hooks/useIsMobileViewport'

const sections = [
  {
    id: 'ps-1',
    revealClass: 'rv-r',
    label: 'AI Coach',
    title: <>A coach that <em>remembers</em> everything</>,
    body: "Long-lived fitness context. Recent training activity. Conversation history. FitNyx's AI coach gives answers that evolve with your progress.",
    bullets: [
      'Context-aware across every session',
      'Progress-based responses, not generic advice',
      'Separate threads per goal or phase',
      'Fresh answers after new workouts logged',
    ],
  },
  {
    id: 'ps-2',
    revealClass: 'rv-l',
    label: 'Workout Planning',
    title: <>Structured training without the <em>chaos</em></>,
    body: 'Build or follow plans that match your goal, track sessions with real exercise logs, and keep momentum even when life gets messy.',
    bullets: [
      'Custom plans by goal and experience',
      'Session logging — sets, reps, weight',
      'Always know which day and exercise is next',
      'Offline-friendly, no internet needed',
    ],
  },
  {
    id: 'ps-3',
    revealClass: 'rv-r',
    label: 'Nutrition Planning',
    title: <>Nutrition that supports the <em>goal</em></>,
    body: 'AI-assisted nutrition planning designed to support performance, recovery, and consistency — not random meal ideas.',
    bullets: [
      'Goal-aware (bulk, cut, maintain)',
      'Diet preferences and restrictions',
      'Macro-conscious, not just calories',
      'Regenerate when your needs change',
    ],
  },
  {
    id: 'ps-4',
    revealClass: 'rv-l',
    label: 'Progress Tracking',
    title: <>Progress you can actually <em>understand</em></>,
    body: "Session history, volume trends, body metrics, consistency scores — one connected view that shows what's actually working.",
    bullets: [
      'Session history and frequency trends',
      'Volume progression week over week',
      'Weight and body metric tracking',
      'Performance snapshots by movement',
    ],
  },
]

export default function PhoneScroll() {
  const rootRef = useRef(null)
  const isMobileViewport = useIsMobileViewport()

  useEffect(() => {
    const rootEl = rootRef.current
    if (!rootEl) return

    let frameId = 0

    const syncMobileSpacing = () => {
      if (window.innerWidth > 768) {
        rootEl.style.removeProperty('--ps-copy-height')
        window.dispatchEvent(new Event('phoneScrollLayoutChange'))
        return
      }

      const copyBlocks = Array.from(rootEl.querySelectorAll('.ps-copy-measure'))
      if (!copyBlocks.length) return

      const maxCopyHeight = copyBlocks.reduce((tallest, block) => {
        return Math.max(tallest, Math.ceil(block.getBoundingClientRect().height))
      }, 0)

      if (maxCopyHeight > 0) {
        rootEl.style.setProperty('--ps-copy-height', `${maxCopyHeight}px`)
        window.dispatchEvent(new Event('phoneScrollLayoutChange'))
      }
    }

    const requestSync = () => {
      cancelAnimationFrame(frameId)
      frameId = requestAnimationFrame(syncMobileSpacing)
    }

    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(requestSync)

    rootEl.querySelectorAll('.ps-copy-measure').forEach((block) => resizeObserver?.observe(block))

    requestSync()
    window.addEventListener('resize', requestSync)
    window.addEventListener('orientationchange', requestSync)
    if (document.fonts?.ready) {
      document.fonts.ready.then(requestSync).catch(() => {})
    }

    return () => {
      cancelAnimationFrame(frameId)
      resizeObserver?.disconnect()
      window.removeEventListener('resize', requestSync)
      window.removeEventListener('orientationchange', requestSync)
    }
  }, [])

  return (
    <div id="phone-scroll" ref={rootRef}>
      {!isMobileViewport && (
        <div id="phone-sticky">
          <ScrollScene />
        </div>
      )}
      {sections.map((s, index) => {
        const copyPlacement = index % 2 === 0 ? 'top' : 'bottom'

        return (
          <div
            className={`phone-section phone-section--${copyPlacement}`}
            data-copy-placement={copyPlacement}
            id={s.id}
            key={s.id}
          >
            <div className="ps-content">
              <div className={`${s.revealClass} ps-copy-shell`}>
                <div className="ps-copy-measure">
                  <span className="slbl">{s.label}</span>
                  <h2 className="stit">{s.title}</h2>
                  <p className="sbod">{s.body}</p>
                  <ul className="bul">
                    {s.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
