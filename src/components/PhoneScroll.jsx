import { useEffect, useRef } from 'react'
import ScrollScene from '../three/ScrollScene'
import useIsMobileViewport from '../hooks/useIsMobileViewport'

function AsideCoach() {
  return (
    <div className="ps-aside ps-aside--coach" aria-hidden="true">
      <div className="ps-aside-head">
        <span className="ps-aside-dot" />
        <span className="ps-aside-title">FitNyx Coach</span>
        <span className="ps-aside-meta">online</span>
      </div>
      <div className="ps-chat">
        <div className="ps-chat-row ps-chat-row--user">
          <div className="ps-bubble ps-bubble--user">
            Should I push squats today? Hamstrings still tight.
          </div>
        </div>
        <div className="ps-chat-row ps-chat-row--ai">
          <div className="ps-bubble ps-bubble--ai">
            <span className="ps-bubble-label">Based on your last 3 sessions</span>
            Skip heavy squats. Front-load posterior chain mobility 12 min, then RDLs at 70% — protects the hamstring you tweaked Tuesday.
          </div>
        </div>
      </div>
      <div className="ps-aside-tags">
        <span>context · 14 sessions</span>
        <span>injury aware</span>
      </div>
    </div>
  )
}

function AsideWorkout() {
  return (
    <div className="ps-aside ps-aside--workout" aria-hidden="true">
      <div className="ps-aside-head">
        <span className="ps-aside-eyebrow">Today · Push Day</span>
        <span className="ps-aside-meta">Week 6 · Day 24</span>
      </div>
      <ul className="ps-sets">
        <li className="ps-set ps-set--done">
          <div className="ps-set-name">Incline DB Press</div>
          <div className="ps-set-grid">
            <span>4 × 8</span><span>32.5kg</span><span className="ps-set-tick">✓</span>
          </div>
        </li>
        <li className="ps-set ps-set--done">
          <div className="ps-set-name">Cable Fly</div>
          <div className="ps-set-grid">
            <span>3 × 12</span><span>18kg</span><span className="ps-set-tick">✓</span>
          </div>
        </li>
        <li className="ps-set ps-set--active">
          <div className="ps-set-name">Overhead Press<span className="ps-set-pulse" /></div>
          <div className="ps-set-grid">
            <span>3 × 6</span><span>45kg</span><span className="ps-set-now">NOW</span>
          </div>
        </li>
        <li className="ps-set">
          <div className="ps-set-name">Lateral Raise</div>
          <div className="ps-set-grid">
            <span>4 × 12</span><span>8kg</span><span>—</span>
          </div>
        </li>
      </ul>
      <div className="ps-aside-foot">
        <div className="ps-aside-bar"><div style={{ width: '62%' }} /></div>
        <span>62% complete</span>
      </div>
    </div>
  )
}

function AsideNutrition() {
  const radius = 46
  const circ = 2 * Math.PI * radius
  const macros = [
    { name: 'Protein', val: 168, goal: 195, color: '#61c894' },
    { name: 'Carbs', val: 224, goal: 280, color: '#7cd8ff' },
    { name: 'Fats', val: 58, goal: 72, color: '#ffb46b' },
  ]
  return (
    <div className="ps-aside ps-aside--nutrition" aria-hidden="true">
      <div className="ps-aside-head">
        <span className="ps-aside-eyebrow">Today's macros</span>
        <span className="ps-aside-meta">Lean bulk · 2,640 kcal</span>
      </div>
      <div className="ps-macro-grid">
        <div className="ps-rings">
          <svg viewBox="0 0 120 120" width="132" height="132">
            <circle cx="60" cy="60" r={radius} className="ps-ring-track" />
            {macros.map((m, i) => {
              const pct = m.val / m.goal
              const offset = circ * (1 - pct)
              const r = radius - i * 10
              const c = 2 * Math.PI * r
              return (
                <circle
                  key={m.name}
                  cx="60"
                  cy="60"
                  r={r}
                  className="ps-ring-arc"
                  style={{
                    stroke: m.color,
                    strokeDasharray: c,
                    strokeDashoffset: c * (1 - pct),
                  }}
                />
              )
            })}
          </svg>
          <div className="ps-rings-center">
            <span className="ps-rings-val">1,940</span>
            <span className="ps-rings-lbl">of 2,640</span>
          </div>
        </div>
        <ul className="ps-macros">
          {macros.map((m) => (
            <li key={m.name}>
              <span className="ps-macro-dot" style={{ background: m.color }} />
              <span className="ps-macro-name">{m.name}</span>
              <span className="ps-macro-val">{m.val}<i>/{m.goal}g</i></span>
            </li>
          ))}
        </ul>
      </div>
      <div className="ps-aside-foot ps-aside-foot--meal">
        <div>
          <span className="ps-meal-eyebrow">Next meal · 7:30 PM</span>
          <span className="ps-meal-name">Salmon · jasmine rice · greens</span>
        </div>
        <span className="ps-meal-kcal">640 kcal</span>
      </div>
    </div>
  )
}

function AsideProgress() {
  const pts = [22, 28, 26, 34, 32, 40, 38, 46, 52, 48, 58, 64]
  const max = Math.max(...pts)
  const min = Math.min(...pts)
  const w = 240
  const h = 90
  const step = w / (pts.length - 1)
  const norm = (v) => h - ((v - min) / (max - min)) * (h - 12) - 6
  const path = pts.map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${norm(v)}`).join(' ')
  const area = `${path} L ${w} ${h} L 0 ${h} Z`
  return (
    <div className="ps-aside ps-aside--progress" aria-hidden="true">
      <div className="ps-aside-head">
        <span className="ps-aside-eyebrow">Weekly volume</span>
        <span className="ps-aside-meta ps-aside-meta--up">▲ 18.4%</span>
      </div>
      <div className="ps-chart">
        <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="psFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(97,200,148,.35)" />
              <stop offset="100%" stopColor="rgba(97,200,148,0)" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#psFill)" />
          <path d={path} className="ps-chart-line" />
          <circle cx={w} cy={norm(pts[pts.length - 1])} r="4" className="ps-chart-dot" />
        </svg>
        <div className="ps-chart-axis">
          <span>W1</span><span>W4</span><span>W8</span><span>W12</span>
        </div>
      </div>
      <ul className="ps-stats">
        <li>
          <span className="ps-stat-val">12,840<i>kg</i></span>
          <span className="ps-stat-lbl">This week</span>
        </li>
        <li>
          <span className="ps-stat-val">+4.2<i>kg</i></span>
          <span className="ps-stat-lbl">Bench 1RM · 8w</span>
        </li>
        <li>
          <span className="ps-stat-val">86<i>%</i></span>
          <span className="ps-stat-lbl">Consistency</span>
        </li>
      </ul>
    </div>
  )
}

const sections = [
  {
    id: 'ps-1',
    revealClass: 'rv-r',
    label: 'AI Coach',
    image: '/assets/iphoneImage1.png',
    title: <>A coach that <em>remembers</em> everything</>,
    body: "Long-lived fitness context. Recent training activity. Conversation history. FitNyx's AI coach gives answers that evolve with your progress.",
    bullets: [
      'Context-aware across every session',
      'Progress-based responses, not generic advice',
      'Separate threads per goal or phase',
      'Fresh answers after new workouts logged',
    ],
    Aside: AsideCoach,
  },
  {
    id: 'ps-2',
    revealClass: 'rv-l',
label: 'Workout Planning',
    image: '/assets/iphoneImage2.png',
    title: <>Structured training without the <em>chaos</em></>,
    body: 'Build or follow plans that match your goal, track sessions with real exercise logs, and keep momentum even when life gets messy.',
    bullets: [
      'Custom plans by goal and experience',
      'Session logging — sets, reps, weight',
      'Always know which day and exercise is next',
      'Offline-friendly, no internet needed',
    ],
    Aside: AsideWorkout,
  },
  {
    id: 'ps-3',
    revealClass: 'rv-r',
label: 'Nutrition Planning',
    image: '/assets/iphoneImage3.png',
    title: <>Nutrition that supports the <em>goal</em></>,
    body: 'AI-assisted nutrition planning designed to support performance, recovery, and consistency — not random meal ideas.',
    bullets: [
      'Goal-aware (bulk, cut, maintain)',
      'Diet preferences and restrictions',
      'Macro-conscious, not just calories',
      'Regenerate when your needs change',
    ],
    Aside: AsideNutrition,
  },
  {
    id: 'ps-4',
    revealClass: 'rv-l',
label: 'Progress Tracking',
    image: '/assets/iphoneImage4.png',
    title: <>Progress you can actually <em>understand</em></>,
    body: "Session history, volume trends, body metrics, consistency scores — one connected view that shows what's actually working.",
    bullets: [
      'Session history and frequency trends',
      'Volume progression week over week',
      'Weight and body metric tracking',
      'Performance snapshots by movement',
    ],
    Aside: AsideProgress,
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
      if (window.innerWidth > 1024) {
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
      <div id="phone-sticky">
        <ScrollScene />
      </div>

<div className="ps-card-grid">
        <div className="ps-card-grid-item ps-card-grid-item--tl"><AsideCoach /></div>
        <div className="ps-card-grid-item ps-card-grid-item--tr"><AsideWorkout /></div>
        <div className="ps-card-grid-item ps-card-grid-item--bl"><AsideNutrition /></div>
        <div className="ps-card-grid-item ps-card-grid-item--br"><AsideProgress /></div>
      </div>

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
            <img
              className="ps-mobile-img"
              src={`${import.meta.env.BASE_URL}assets/iphoneImage${index + 1}.png`}
              alt={s.label}
              loading="lazy"
            />
          </div>
        )
      })}
    </div>
  )
}
