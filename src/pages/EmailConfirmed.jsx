import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

// Landing page for the signup confirmation email (Supabase redirect_to).
// Supabase has already confirmed the email by the time it sends the user
// here. On a phone we hand off to the app (which signs the user in when it's
// the phone they signed up on); on a computer there's no app to open, so we
// just say it worked. Browsers don't let a page close a tab it didn't open,
// so handing off to the app is the "close" on mobile.

const APP_SCHEME = 'fitnyxmobile://auth/callback'
const LINK = { color: 'var(--g)', textDecoration: 'none', fontWeight: 600 }

function readParams() {
  const query = new URLSearchParams(window.location.search)
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  const get = (k) => query.get(k) || hash.get(k)
  return {
    code: get('code'),
    error: get('error_description') || get('error'),
    errorCode: get('error_code'),
  }
}

function initialState() {
  if (typeof window === 'undefined') return { ready: false, mobile: false, appLink: APP_SCHEME, error: null, expired: false }
  const { code, error, errorCode } = readParams()
  return {
    ready: true,
    mobile: /android|iphone|ipad|ipod/i.test(navigator.userAgent),
    appLink: code ? `${APP_SCHEME}?code=${encodeURIComponent(code)}&type=signup` : `${APP_SCHEME}?type=signup`,
    error,
    expired: errorCode === 'otp_expired' || /expired|invalid/i.test(error || ''),
  }
}

// Mail-with-check / mail-with-x line icon in a tinted halo (matches the app).
function StatusIcon({ failed }) {
  const color = failed ? '#ef4444' : 'var(--g)'
  return (
    <div aria-hidden="true" style={{
      width: 112, height: 112, borderRadius: '50%', margin: '0 auto 28px', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: failed ? 'rgba(239,68,68,.06)' : 'rgba(97,200,148,.06)',
      border: `1px solid ${failed ? 'rgba(239,68,68,.16)' : 'rgba(97,200,148,.16)'}`,
    }}>
      <div style={{
        width: 76, height: 76, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: failed ? 'rgba(239,68,68,.12)' : 'rgba(97,200,148,.12)',
      }}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          {failed ? <><path d="m17 17 4 4" /><path d="m21 17-4 4" /></> : <path d="m16 19 2 2 4-4" />}
        </svg>
      </div>
    </div>
  )
}

export default function EmailConfirmed() {
  const [state] = useState(initialState)

  useEffect(() => {
    // Keep the one-time code out of the address bar (screenshots, sharing).
    window.history.replaceState(null, '', window.location.pathname)
    // Same phone or not, try the app once; the button below is the fallback.
    if (state.mobile && !state.error) window.location.href = state.appLink
  }, [state])

  const { ready, mobile, appLink, error, expired } = state
  const failed = ready && !!error

  return (
    <>
      <Helmet>
        <title>{failed ? 'Link expired · FitNyx' : 'Email confirmed · FitNyx'}</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="policy-page rv in">
        <div className="si-inner">
          <div className="policy-container" style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
            <StatusIcon failed={failed} />
            <h1 className="policy-title">{failed ? 'This link has expired' : 'Email confirmed'}</h1>

            <div className="policy-content">
              {failed ? (
                <p>
                  {expired
                    ? 'Confirmation links work once and expire after a while. '
                    : 'We couldn’t confirm your email with this link. '}
                  Open FitNyx and log in — if your email still isn’t confirmed, sign up again with the same address to get a fresh link.
                </p>
              ) : mobile ? (
                <p>You’re all set. We’re opening FitNyx — if it doesn’t open, tap the button below and log in.</p>
              ) : (
                <p>
                  You’re all set — you can close this tab. Open <strong>FitNyx</strong> on your phone and log in with
                  the email and password you signed up with.
                </p>
              )}

              {mobile && (
                <p style={{ marginTop: 28 }}>
                  <a href={appLink} className="btn-p">Open FitNyx</a>
                </p>
              )}

              <p style={{ marginTop: 28, fontSize: 14 }}>
                Need help? <Link to="/help" style={LINK}>Help &amp; FAQ</Link> · <a href="mailto:support@fitnyx.in" style={LINK}>support@fitnyx.in</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
