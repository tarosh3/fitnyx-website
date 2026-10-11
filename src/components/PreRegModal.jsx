import { useState, useEffect, useRef } from 'react'

export default function PreRegModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  const handleClose = () => {
    setEmail('')
    setWebsite('')
    setStatus('idle')
    setErrorMsg('')
    onClose()
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) handleClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || status === 'loading') return

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), website }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.status === 400) {
        throw new Error(data?.error || 'Please enter a valid email.')
      }
      if (!res.ok) throw new Error('unavailable')
      setStatus('success')
    } catch (err) {
      if (err.message !== 'unavailable' && !(err instanceof TypeError)) {
        setStatus('error')
        setErrorMsg(err.message)
        return
      }
      // Signup API not reachable/configured (no endpoint, missing keys,
      // network): never lose the signup — fall back to emailing support.
      const subject = encodeURIComponent('FitNyx Pre-Registration')
      const body = encodeURIComponent(`Hi FitNyx team,\n\nPlease add me to early access.\n\nEmail: ${email.trim()}\n\nThanks`)
      window.open(`mailto:support@fitnyx.in?subject=${subject}&body=${body}`, '_self')
      setStatus('success')
    }
  }

  const success = status === 'success'
  const loading = status === 'loading'

  return (
    <div className={`modal-overlay${isOpen ? ' open' : ''}`} onClick={handleOverlayClick}>
      <div className="modal-card">
        <button className="modal-close" onClick={handleClose} aria-label="Close">&times;</button>
        <div className="modal-badge">Coming Soon</div>
        <h3 className="modal-title">Get early access to <span>FitNyx</span></h3>
        <p className="modal-sub">We're launching on iOS and Android soon. Pre-register to be the first to know.</p>
        <div className="modal-platforms">
          <div className="platform-badge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#61c894" strokeWidth="1.8"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"/><path d="M14.31 8l4.19 7.17a10 10 0 01-12.98 0L9.69 8h4.62z"/><path d="M9.69 8h4.62L12 2.83 9.69 8z"/></svg>
            <div><strong>Android</strong><span>Coming Soon</span></div>
          </div>
          <div className="platform-badge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#61c894" strokeWidth="1.8"><path d="M12 2a10 10 0 0110 10 10 10 0 01-10 10A10 10 0 012 12 10 10 0 0112 2z"/><path d="M15 9.354a4 4 0 11-6 0"/></svg>
            <div><strong>iOS</strong><span>Coming Soon</span></div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="email"
            placeholder="Enter your email address"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading || success}
            id="prereg-email"
          />
          {/* honeypot — hidden from humans, bots fill it */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', opacity: 0, pointerEvents: 'none' }}
            aria-hidden="true"
          />
          <button
            type="submit"
            className={`modal-submit${success ? ' success' : ''}`}
            disabled={loading || success}
          >
            {success
              ? "Registered! Check your inbox."
              : loading
              ? 'Registering…'
              : 'Pre-Register for Early Access'}
          </button>
          {status === 'error' && (
            <p className="modal-error" style={{ color: '#ff6b6b', fontSize: '13px', marginTop: '8px' }}>
              {errorMsg}
            </p>
          )}
        </form>
        <p className="modal-note">No spam. Just a launch notification.</p>
      </div>
    </div>
  )
}
