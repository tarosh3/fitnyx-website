import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
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
import BlogPreview from '../sections/BlogPreview'
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

  const siteUrl = 'https://fitnyx.in'
  const homeTitle = 'FitNyx — AI Fitness Coach, Workout & Diet Planner That Remembers You'

  // react-helmet-async v3's title update is unreliable under React 19 +
  // SPA prerender, so force-set document.title here as a backup.
  useEffect(() => { document.title = homeTitle }, [homeTitle])
  const homeDesc = 'AI fitness app with context-aware coaching, personalized workout plans, diet planner, and progress tracking for muscle gain & fat loss.'
  const ogImage = `${siteUrl}/og-image.png`

  return (
    <>
      <Helmet>
        <title>{homeTitle}</title>
        <meta name="description" content={homeDesc} />
        <meta name="keywords" content="AI fitness app, AI workout planner, diet planner, fitness coach app, muscle gain app, fat loss app, gym workout tracker, offline workout tracker, personalized fitness, progress tracker" />
        <link rel="canonical" href={`${siteUrl}/`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={homeTitle} />
        <meta property="og:description" content={homeDesc} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="FitNyx" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={homeTitle} />
        <meta name="twitter:description" content={homeDesc} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="theme-color" content="#0d0d15" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'FitNyx',
          url: siteUrl,
          logo: `${siteUrl}/favicon.png`,
          sameAs: [
            'https://www.instagram.com/fitnyx.in',
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            email: 'support@fitnyx.in',
            contactType: 'customer support',
          },
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'FitNyx',
          applicationCategory: 'HealthApplication',
          operatingSystem: 'iOS, Android',
          description: homeDesc,
          url: siteUrl,
          image: ogImage,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'INR',
            availability: 'https://schema.org/PreOrder',
          },
          publisher: {
            '@type': 'Organization',
            name: 'FitNyx',
            url: siteUrl,
          },
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'FitNyx',
          url: siteUrl,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${siteUrl}/blog?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        })}</script>
      </Helmet>
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
      <BlogPreview />
      <FinalCTA onPreReg={openPreReg} />
    </>
  )
}
