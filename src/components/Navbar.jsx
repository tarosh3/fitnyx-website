import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function Navbar({ onPreReg }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => {
    setMenuOpen(false)
    document.body.style.overflow = ''
  }

  const toggleMenu = () => {
    const next = !menuOpen
    setMenuOpen(next)
    document.body.style.overflow = next ? 'hidden' : ''
  }

  const handleNav = (e, href) => {
    e.preventDefault()
    closeMenu()
    
    if (location.pathname !== '/') {
      navigate('/' + href)
      // Small delay to allow home to mount before scrolling
      setTimeout(() => {
        const el = document.querySelector(href)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } else {
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      <nav id="nav" className={scrolled ? 'sc' : ''}>
        <Link to="/" className="logo">Fit<span>Nyx</span></Link>
        <ul className="nl">
          <li><a href="#phone-scroll" onClick={(e) => handleNav(e, '#phone-scroll')}>Features</a></li>
          <li><a href="#goals-s" onClick={(e) => handleNav(e, '#goals-s')}>Goals</a></li>
          <li><a href="#price-s" onClick={(e) => handleNav(e, '#price-s')}>Pricing</a></li>
          <li><a href="#faq-s" onClick={(e) => handleNav(e, '#faq-s')}>FAQ</a></li>
        </ul>
        <button className="nbtn" onClick={onPreReg}>Pre-Register</button>
        <button className={`ham${menuOpen ? ' active' : ''}`} aria-label="Toggle menu" onClick={toggleMenu}>
          <span></span><span></span><span></span>
        </button>
      </nav>

      <div className={`mob-menu${menuOpen ? ' open' : ''}`}>
        <a href="#phone-scroll" onClick={(e) => handleNav(e, '#phone-scroll')}>Features</a>
        <a href="#goals-s" onClick={(e) => handleNav(e, '#goals-s')}>Goals</a>
        <a href="#price-s" onClick={(e) => handleNav(e, '#price-s')}>Pricing</a>
        <a href="#faq-s" onClick={(e) => handleNav(e, '#faq-s')}>FAQ</a>
        <button className="nbtn" style={{ marginTop: '10px' }} onClick={() => { closeMenu(); onPreReg() }}>Pre-Register</button>
      </div>
    </>
  )
}
