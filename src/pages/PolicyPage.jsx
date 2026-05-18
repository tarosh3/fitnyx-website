import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function PolicyPage({ title, lastUpdated, children }) {
  const location = useLocation()
  const siteUrl = 'https://fitnyx.in'
  const canonical = `${siteUrl}${location.pathname}`
  const description = `${title} for FitNyx — ${lastUpdated ? `last updated ${lastUpdated}. ` : ''}Read our official ${title.toLowerCase()} document covering data handling, user rights, and service usage.`

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Helmet>
        <title>{`${title} · FitNyx`}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={`${title} · FitNyx`} />
        <meta property="og:description" content={description} />
        <meta name="twitter:card" content="summary" />
      </Helmet>
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
    </>
  )
}
