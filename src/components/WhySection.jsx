export default function WhySection() {
  return (
    <div className="std-section" id="why-exists-s" style={{ background: 'rgba(13,13,21,.4)' }}>
      <div className="si-inner why-flex">
        <div className="why-l rv">
          <span className="slbl">The Problem</span>
          <h2 className="stit" style={{ fontSize: 'clamp(36px,4.5vw,56px)' }}>
            Most fitness apps track.<br /><em>Very few guide.</em>
          </h2>
          <p className="sbod">
            Generic workout apps leave you with disconnected plans, shallow progress charts, and advice that forgets everything the moment you close the screen. FitNyx is built to feel like one connected system: your training, your nutrition, your trends, your context.
          </p>
        </div>
        <div className="why-r rv" style={{ transitionDelay: '.1s' }}>
          <div className="wq-card">
            <p>&ldquo;Less guesswork. More momentum.&rdquo;</p>
          </div>
        </div>
      </div>
    </div>
  )
}
