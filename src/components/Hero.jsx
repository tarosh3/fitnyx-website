import ParticleCanvas from './ParticleCanvas'
import HeroScene from '../three/HeroScene'
import useIsMobileViewport from '../hooks/useIsMobileViewport'

export default function Hero({ onPreReg }) {
  const isMobileViewport = useIsMobileViewport()

  const handleScroll = (e) => {
    e.preventDefault()
    document.getElementById('snapshot-s')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section id="hero">
      <ParticleCanvas />
      {!isMobileViewport && <HeroScene />}
      <div className="hero-left">
        <div className="hero-tag">
          <span className="htdot"></span>AI-Powered Fitness Intelligence
        </div>
        <h1 className="hero-h1" style={{ fontSize: 'clamp(46px,7vw,80px)', letterSpacing: 0, lineHeight: 1 }}>
          <span className="w">Train with a plan.</span><br />
          <span className="d">Eat with purpose.</span><br />
          <span className="a">Improve with context.</span>
        </h1>
        <p className="hero-sub">
          FitNyx combines personalized workouts, nutrition guidance, progress tracking, and an AI coach that understands your training history, goals, and recent performance.
        </p>
        <div className="hero-ctas">
          <button onClick={onPreReg} className="btn-p">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V4a1 1 0 00-2 0v1.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Pre-Register for Early Access
          </button>
          <a href="#snapshot-s" className="btn-s" onClick={handleScroll}>
            See How It Works{' '}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
        <p className="hero-note">Launching soon on iOS &amp; Android. Built for muscle gain, fat loss, and consistency.</p>
      </div>
      <div className="scroll-hint">
        <div className="scroll-pill"><div className="scroll-dot"></div></div>
        Scroll to explore
      </div>
    </section>
  )
}
