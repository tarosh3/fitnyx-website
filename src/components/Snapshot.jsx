const cards = [
  { icon: <><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></>, title: 'Personalized workout plans', desc: 'Custom plans by goal and experience level.' },
  { icon: <><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/><path d="M12 16v-4M12 8h.01"/></>, title: 'AI coach with memory', desc: 'Context-aware answers from your history.' },
  { icon: <><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><path d="M6 1v3M10 1v3M14 1v3"/></>, title: 'Nutrition planning', desc: 'Macros and diet direction that support your goal.' },
  { icon: <><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></>, title: 'Progress insights', desc: 'Volume, frequency, and body metrics.' },
  { icon: <><path d="M5 12.55a11 11 0 0114.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><circle cx="12" cy="20" r="1"/></>, title: 'Offline workout logging', desc: 'Track sessions completely disconnected.' },
  { icon: <><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></>, title: 'Recovery-aware guidance', desc: 'Adapts to missed days and energy levels.' },
]

export default function Snapshot() {
  return (
    <div className="std-section" id="snapshot-s">
      <div className="si-inner">
        <div className="rv">
          <h2 className="stit">Everything you need to<br /><em>stay consistent</em></h2>
        </div>
        <div className="cg rv" style={{ transitionDelay: '.1s' }}>
          {cards.map((card, i) => (
            <div className="card" key={i}>
              <div className="card-ic">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#61c894" strokeWidth="1.8">
                  {card.icon}
                </svg>
              </div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
