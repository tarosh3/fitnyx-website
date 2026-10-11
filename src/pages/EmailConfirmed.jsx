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
            <div style={{ fontSize: 56, lineHeight: 1, marginBottom: 18 }} aria-hidden="true">{failed ? '⏳' : '✅'}</div>
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
                Need help? <Link to="/help">Help &amp; FAQ</Link> · <a href="mailto:support@fitnyx.in">support@fitnyx.in</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
