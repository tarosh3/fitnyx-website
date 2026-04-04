export default function PricingSection({ onPreReg }) {
  return (
    <div className="std-section" id="price-s">
      <div className="si-inner">
        <div style={{ textAlign: 'center' }}>
          <span className="slbl rv">Pricing</span>
          <h2 className="stit rv" style={{ textAlign: 'center', margin: '0 auto', transitionDelay: '.08s' }}>
            Simple, <em>transparent</em> pricing
          </h2>
          <p className="rv" style={{ color: 'var(--mu)', fontSize: 14, marginTop: 10, transitionDelay: '.16s' }}>
            Start free. Upgrade when you&apos;re ready.
          </p>
        </div>
        <div className="pg">
          {/* Starter */}
          <div className="pc rv">
            <div className="ppl">Starter</div>
            <div className="pam">Free</div>
            <div className="ppe">Forever</div>
            <div className="ppe" style={{ marginTop: 8 }}>
              First few users who pre-register get Elite features free for a limited time.
            </div>
            <div className="pdiv"></div>
            <ul className="pfl">
              <li className="pf">Basic workout tracking</li>
              <li className="pf">Limited AI insights</li>
              <li className="pf">Progress overview</li>
              <li className="pf dm">7-day history only</li>
              <li className="pf dm">No custom plans</li>
            </ul>
            <button onClick={onPreReg} className="bpl bso">Pre-Register</button>
          </div>

          {/* Pro */}
          <div className="pc fe rv" style={{ transitionDelay: '.1s' }}>
            <div className="ptop">Most Popular</div>
            <div className="ppl">Pro</div>
            <div className="pam"><sup>₹</sup>129</div>
            <div className="ppe">per month · 7-day free trial</div>
            <div className="pdiv"></div>
            <ul className="pfl">
              <li className="pf">Full workout tracking</li>
              <li className="pf">Personalized workout plans</li>
              <li className="pf">AI Coach with memory</li>
              <li className="pf">Nutrition planning</li>
              <li className="pf">Progress analytics &amp; trends</li>
              <li className="pf">Offline mode + cloud sync</li>
              <li className="pf">Unlimited history</li>
            </ul>
            <button onClick={onPreReg} className="bpl bo">Notify Me at Launch</button>
          </div>

          {/* Elite */}
          <div className="pc rv" style={{ transitionDelay: '.2s' }}>
            <div className="ppl">Elite</div>
            <div className="pam"><sup>₹</sup>229</div>
            <div className="ppe">per month</div>
            <div className="pdiv"></div>
            <ul className="pfl">
              <li className="pf">Everything in Pro</li>
              <li className="pf">Priority support</li>
              <li className="pf">Advanced analytics</li>
              <li className="pf">Early feature access</li>
              <li className="pf">Custom templates</li>
              <li className="pf">Export &amp; reports</li>
            </ul>
            <button onClick={onPreReg} className="bpl bo">Notify Me at Launch</button>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <p style={{ fontSize: 11, color: 'var(--di)' }}>Cancel anytime · Secure payments · No hidden fees</p>
        </div>
      </div>
    </div>
  )
}
