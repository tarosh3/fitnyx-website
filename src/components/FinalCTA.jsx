export default function FinalCTA({ onPreReg }) {
  return (
    <section id="fc">
      <div className="fcg"></div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="rv">
          <h2 className="fch" style={{ fontSize: 'clamp(40px,6vw,84px)', lineHeight: 1.1, marginBottom: 30 }}>
            Be the first<br />to <span>train smarter</span>
          </h2>
        </div>
        <div className="rv" style={{ transitionDelay: '.12s' }}>
          <p className="fcs">FitNyx is launching soon. Pre-register now to get early access, launch pricing, and be part of the first wave.</p>
        </div>
        <div className="rv" style={{ transitionDelay: '.22s' }}>
          <button onClick={onPreReg} className="btn-p" style={{ fontSize: 15, padding: '15px 34px', display: 'inline-flex', border: 'none' }}>
            Pre-Register Now{' '}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 5 }}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
