const goals = [
  { icon: <><path d="M18 4a3 3 0 00-3 3v10a3 3 0 003 3M6 4a3 3 0 013 3v10a3 3 0 01-3 3M2 12h4M18 12h4M9 12h6"/></>, label: 'Muscle Gain' },
  { icon: <><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></>, label: 'Fat Loss' },
  { icon: <><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></>, label: 'General Fitness' },
  { icon: <><path d="M12 20v-6M6 20V10M18 20V4"/></>, label: 'Beginner Structure' },
  { icon: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path d="M9 22V12h6v10"/></>, label: 'Home Workouts' },
  { icon: <><circle cx="12" cy="8" r="7"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-912"/></>, label: 'Gym Performance' },
]

export default function GoalsSection() {
  return (
    <div className="std-section" id="goals-s">
      <div className="si-inner">
        <div className="rv"><span className="slbl">Use Cases</span></div>
        <div className="rv" style={{ transitionDelay: '.08s' }}>
          <h2 className="stit">Built for <em>different goals</em></h2>
        </div>
        <div className="gg">
          {goals.map((g, i) => (
            <a href="#" className="gc rv" key={i} style={{ transitionDelay: `${i * 0.06}s` }} onClick={(e) => e.preventDefault()}>
              <div className="gc-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#61c894" strokeWidth="1.8">
                  {g.icon}
                </svg>
              </div>
              <span>{g.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
