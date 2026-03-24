const reviews = [
  {
    text: '"Finally stayed consistent for more than 3 months. The AI coach actually remembers my history — it feels like talking to someone who knows my training."',
    initials: 'AM', name: 'Arjun Mehta', tag: '6 months · Muscle Gain',
  },
  {
    text: '"The nutrition planning is what sold me. It adapts to my preferences and ties into my workout plan. Nothing else does both."',
    initials: 'PS', name: 'Priya Sharma', tag: '4 months · Fat Loss',
  },
  {
    text: '"I travel constantly. The offline mode is a game changer — log in the gym, syncs at the hotel. Never lost a workout since."',
    initials: 'RK', name: 'Rohan Kapoor', tag: '3 months · General Fitness',
  },
]

export default function ReviewsSection() {
  return (
    <div className="std-section" style={{ background: 'rgba(13,13,21,.6)' }}>
      <div className="si-inner">
        <div style={{ textAlign: 'center' }}>
          <span className="slbl rv">Success Stories</span>
          <h2 className="stit rv" style={{ textAlign: 'center', margin: '0 auto', transitionDelay: '.08s' }}>
            What athletes are <em>saying</em>
          </h2>
        </div>
        <div className="rg">
          {reviews.map((r, i) => (
            <div className="rc rv" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="rs">★★★★★</div>
              <p className="rt">{r.text}</p>
              <div className="rp">
                <div className="rav">{r.initials}</div>
                <div>
                  <div className="rn">{r.name}</div>
                  <div className="rta">{r.tag}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
