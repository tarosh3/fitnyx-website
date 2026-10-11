import { Link } from 'react-router-dom'

export default function Footer({ onPreReg }) {
  return (
    <footer>
      <div className="ftg">
        <div className="fb">
          <div className="logo">Fit<span style={{ color: 'var(--g)' }}>Nyx</span></div>
          <p>Train with a plan. Eat with purpose. Improve with context. Your AI fitness coach that actually remembers you.</p>
          <button type="button" onClick={onPreReg} className="f-cta">Pre-Register</button>
          <div className="f-socials" aria-label="Social media">
            <a href="https://www.instagram.com/fitnyx.in" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="f-social">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>
        </div>
        <div className="fcols">
          <div className="fc">
            <h5>Product</h5>
            <a href="/#insights">AI Fitness Coach</a>
            <a href="/#how-works-s">How It Works</a>
            <a href="/#goals-s">Goals</a>
            <a href="/#price-s">Pricing</a>
            <a href="/#faq-s">FAQ</a>
          </div>
          <div className="fc">
            <h5>Guides</h5>
            <Link to="/blog/hypertrophy-101-how-muscle-grows">Muscle Gain</Link>
            <Link to="/blog/calorie-deficit-calculator-how-much-to-eat">Fat Loss</Link>
            <Link to="/blog/how-to-start-working-out-at-home">Home Workouts</Link>
            <Link to="/blog/the-beginners-guide-to-building-muscle-without-overthinking">Beginner Plans</Link>
            <Link to="/blog/ai-workout-planner-vs-personal-trainer">AI vs Personal Trainer</Link>
          </div>
          <div className="fc fc-wide">
            <h5>Company</h5>
            <a href="/#why-exists-s">About FitNyx</a>
            <Link to="/blog">Blog</Link>
            <Link to="/help">Help &amp; FAQ</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-of-service">Terms of Service</Link>
            <Link to="/delete-account">Delete Account</Link>
            <a href="mailto:support@fitnyx.in">Contact &amp; Support</a>
          </div>
        </div>
      </div>
      <div className="fbot">
        <span>&copy; {new Date().getFullYear()} FitNyx. All rights reserved.</span>
        <span className="fbot-meta">
          <a href="mailto:support@fitnyx.in">support@fitnyx.in</a>
          <span className="fbot-dot" aria-hidden="true">•</span>
          <span>iOS &amp; Android</span>
        </span>
      </div>
    </footer>
  )
}
