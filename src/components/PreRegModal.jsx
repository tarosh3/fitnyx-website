import { useState, useEffect, useRef } from 'react'

export default function PreRegModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)
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
    setSuccess(false)
    onClose()
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) handleClose()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    const subject = encodeURIComponent('FitNyx Pre-Registration')
    const body = encodeURIComponent(
      `Hi FitNyx team,\n\nI would like to pre-register for early access.\n\nEmail: ${email}\n\nPlease notify me when the app launches!\n\nThanks`
    )
    window.open(`mailto:support@fitnyx.in?subject=${subject}&body=${body}`, '_self')
    setSuccess(true)
  }

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
            id="prereg-email"
          />
          <button type="submit" className={`modal-submit${success ? ' success' : ''}`}>
            {success ? "Registered! We'll be in touch." : 'Pre-Register for Early Access'}
          </button>
        </form>
        <p className="modal-note">No spam. Just a launch notification.</p>
      </div>
    </div>
  )
}
