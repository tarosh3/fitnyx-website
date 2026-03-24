import ScrollScene from '../three/ScrollScene'

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
  return (
    <div id="phone-scroll">
      <div id="phone-sticky">
        <ScrollScene />
      </div>
      {sections.map((s) => (
        <div className="phone-section" id={s.id} key={s.id}>
          <div className="ps-content">
            <div className={s.revealClass}>
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
      ))}
    </div>
  )
}
