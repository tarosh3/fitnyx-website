export default function OfflineSection() {
  return (
    <div className="std-section" style={{ background: 'linear-gradient(180deg,transparent,rgba(13,13,21,.6))' }}>
      <div className="si-inner" style={{ textAlign: 'center' }}>
        <span className="slbl rv">Reliability</span>
        <h2 className="stit rv" style={{ transitionDelay: '.08s', margin: '0 auto' }}>
          Built for real life,<br />not <em>perfect Wi-Fi</em>
        </h2>
        <p className="sbod rv" style={{ transitionDelay: '.16s', maxWidth: 540, margin: '18px auto 0' }}>
          Train in the gym, at home, or on the move. FitNyx supports offline-friendly workout logging and sync-aware session handling so your progress does not disappear when your connection does.
        </p>
      </div>
    </div>
  )
}
