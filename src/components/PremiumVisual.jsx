export default function PremiumVisual() {
  return (
    <div className="std-section">
      <div className="si-inner" style={{ textAlign: 'center' }}>
        <span className="slbl rv">Experience</span>
        <h2 className="stit rv" style={{ transitionDelay: '.08s', margin: '0 auto' }}>
          What the experience<br /><em>feels like</em>
        </h2>
        <p className="sbod rv" style={{ margin: '18px auto 40px', maxWidth: 500, transitionDelay: '.12s' }}>
          Clean sessions. Focused tracking. Smarter guidance. A premium fitness app should feel calm, sharp, and useful every time you open it.
        </p>
        <div className="pv-grid rv" style={{ transitionDelay: '.2s' }}>
          <div className="pv-ph">
            <img src={`${import.meta.env.BASE_URL}assets/placeholder1.png`} alt="FitNyx Experience 1" className="pv-img" />
          </div>
          <div className="pv-ph">
            <img src={`${import.meta.env.BASE_URL}assets/placeholder2.png`} alt="FitNyx Experience 2" className="pv-img" />
          </div>
          <div className="pv-ph">
            <img src={`${import.meta.env.BASE_URL}assets/placeholder3.png`} alt="FitNyx Experience 3" className="pv-img" />
          </div>
        </div>
      </div>
    </div>
  )
}
