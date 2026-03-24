import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function PolicyPage({ title, lastUpdated, children }) {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="policy-page rv in">
      <div className="si-inner">
        <div className="policy-container">
          <Link to="/" className="back-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          
          <h1 className="policy-title">{title}</h1>
          {lastUpdated && <p className="policy-meta">Last Updated: {lastUpdated}</p>}
          
          <div className="policy-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
