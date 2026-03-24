const steps = [
  { num: '1', title: 'Tell FitNyx about you', desc: 'Goal, training experience, schedule, injuries, equipment access, and preferences.' },
  { num: '2', title: 'Get a structure', desc: 'A workout plan and nutrition direction that fits your real life.' },
  { num: '3', title: 'Log your sessions', desc: 'Record workouts, body metrics, and consistency over time.' },
  { num: '4', title: 'Deploy the AI coach', desc: 'Ask smarter questions based on your actual progress, not generic advice.' },
]

export default function HowItWorks() {
  return (
    <div className="std-section" id="how-works-s">
      <div className="si-inner" style={{ maxWidth: 900 }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <span className="slbl rv">Process</span>
          <h2 className="stit rv" style={{ textAlign: 'center', margin: '0 auto', transitionDelay: '.08s' }}>
            How FitNyx <em>works</em>
          </h2>
        </div>
        <div className="hw-grid">
          {steps.map((step, i) => (
            <div className="hw-step rv" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="hw-num">{step.num}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
