import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer>
      <div className="ftg">
        <div className="fb">
          <div className="logo">Fit<span style={{ color: 'var(--g)' }}>Nyx</span></div>
          <p>Train with a plan. Eat with purpose. Improve with context. Your AI fitness coach that actually remembers you.</p>
          <a href="#pre-register" className="f-cta">Pre-Register</a>
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
            <a href="ai-fitness-coach.html">AI Fitness Coach</a>
            <a href="workout-planner-app.html">Workout Planner</a>
            <a href="diet-planner-app.html">Diet Planner</a>
            <a href="fitness-progress-tracker.html">Progress Tracker</a>
            <a href="offline-workout-tracker.html">Offline Tracking</a>
          </div>
          <div className="fc">
            <h5>Goals</h5>
            <a href="muscle-gain-app.html">Muscle Gain</a>
            <a href="fat-loss-workout-app.html">Fat Loss</a>
            <a href="home-workout-planner.html">Home Workouts</a>
            <a href="beginner-workout-app.html">Beginner Plans</a>
            <a href="gym-workout-planner.html">Gym Performance</a>
          </div>
          <div className="fc fc-wide">
            <h5>Company</h5>
            <a href="#">About FitNyx</a>
            <a href="#">Blog / Guides</a>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-of-service">Terms of Service</Link>
            <Link to="/delete-account">Delete Account</Link>
            <a href="mailto:support@fitnyx.in">Contact &amp; Support</a>
          </div>
        </div>
      </div>
      <div className="fbot">
        <span>&copy; 2025 FitNyx. All rights reserved.</span>
        <span className="fbot-meta">
          <a href="mailto:support@fitnyx.in">support@fitnyx.in</a>
          <span className="fbot-dot" aria-hidden="true">•</span>
          <span>iOS &amp; Android</span>
        </span>
      </div>
    </footer>
  )
}
