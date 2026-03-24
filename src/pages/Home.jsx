import { useState, useEffect } from 'react'
import Hero from '../components/Hero'
import Snapshot from '../components/Snapshot'
import WhySection from '../components/WhySection'
import HowItWorks from '../components/HowItWorks'
import PhoneScroll from '../components/PhoneScroll'
import StatsBand from '../components/StatsBand'
import OfflineSection from '../components/OfflineSection'
import GoalsSection from '../components/GoalsSection'
import ReviewsSection from '../components/ReviewsSection'
import PricingSection from '../components/PricingSection'
import FAQSection from '../components/FAQSection'
import PremiumVisual from '../components/PremiumVisual'
import FinalCTA from '../components/FinalCTA'

export default function Home({ openPreReg }) {
  // Scroll reveal observer
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('in')
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    const observe = () => {
      document.querySelectorAll('.rv,.rv-l,.rv-r,.card,.gc,.rc,.pc,.sbi,.hw-step').forEach((el) => io.observe(el))
    }

    requestAnimationFrame(observe)

    ;['.card', '.gc', '.rc', '.pc', '.sbi', '.hw-step'].forEach((sel) => {
      document.querySelectorAll(sel).forEach((el, i) => {
        if (!el.style.transitionDelay) el.style.transitionDelay = (i * 0.08) + 's'
      })
    })

    return () => io.disconnect()
  }, [])

  // 3D card tilt effect
  useEffect(() => {
    if (window.innerWidth < 1024) return

    const handleMouseMove = (e) => {
      const card = e.currentTarget
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = (y - centerY) / centerY * -4
      const rotateY = (x - centerX) / centerX * 4
      card.style.transform = `translateY(-8px) perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    }

    const handleMouseLeave = (e) => {
      e.currentTarget.style.transform = ''
    }

    const attach = () => {
      document.querySelectorAll('.card, .hw-step, .rc').forEach((card) => {
        card.addEventListener('mousemove', handleMouseMove)
        card.addEventListener('mouseleave', handleMouseLeave)
      })
    }

    requestAnimationFrame(attach)

    return () => {
      document.querySelectorAll('.card, .hw-step, .rc').forEach((card) => {
        card.removeEventListener('mousemove', handleMouseMove)
        card.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [])

  return (
    <>
      <Hero onPreReg={openPreReg} />
      <Snapshot />
      <WhySection />
      <HowItWorks />
      <PhoneScroll />
      <div className="glow-line"></div>
      <StatsBand />
      <OfflineSection />
      <GoalsSection />
      <ReviewsSection />
      <PricingSection onPreReg={openPreReg} />
      <FAQSection />
      <PremiumVisual />
      <FinalCTA onPreReg={openPreReg} />
    </>
  )
}
