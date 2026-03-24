import { useState } from 'react'

const faqs = [
  { q: 'What makes FitNyx different from a normal workout app?', a: 'Most workout apps track. FitNyx guides. The difference is an AI coach that holds your entire training history, connects your workouts to your nutrition, and gives answers that evolve as your fitness does.' },
  { q: 'Does FitNyx include both workouts and nutrition?', a: 'Yes. FitNyx handles workout planning, session logging, nutrition guidance, and progress tracking as one connected system. Your nutrition plan is aware of your training goals.' },
  { q: "Can I use FitNyx if I'm a complete beginner?", a: 'Absolutely. You set your experience level when onboarding and your entire plan calibrates to match. Beginners get structure, guidance, and a clear path forward.' },
  { q: 'Does the AI coach actually use my progress data?', a: 'Yes. The AI coach uses your real training history, recent session data, and goal context to give answers specific to you — not generic responses that apply to anyone.' },
  { q: 'Can I track workouts offline?', a: 'Yes. FitNyx is offline-first. Log a full session without internet and it syncs automatically when you reconnect.' },
  { q: 'Is FitNyx available on Android and iPhone?', a: 'Yes, available on both iOS and Android. One subscription across all devices with seamless sync.' },
]

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(null)

  const toggle = (i) => {
    setOpenIdx(openIdx === i ? null : i)
  }

  return (
    <div className="std-section" id="faq-s">
      <div className="si-inner" style={{ maxWidth: 740 }}>
        <div style={{ textAlign: 'center', marginBottom: 46 }}>
          <span className="slbl rv">Questions</span>
          <h2 className="stit rv" style={{ textAlign: 'center', margin: '0 auto', transitionDelay: '.08s' }}>
            Frequently asked <em>questions</em>
          </h2>
        </div>
        <div>
          {faqs.map((faq, i) => (
            <div className={`fi${openIdx === i ? ' op' : ''}`} key={i}>
              <button className="fq" onClick={() => toggle(i)}>
                {faq.q} <span className="fqi">+</span>
              </button>
              <div className="fa">
                <div className="fai">{faq.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
