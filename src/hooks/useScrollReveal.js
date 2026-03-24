import { useEffect, useRef } from 'react'

export function useScrollReveal(options = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px', ...options }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [])

  return ref
}

export function useScrollRevealAll(selector, containerRef) {
  useEffect(() => {
    const container = containerRef?.current || document
    const elements = container.querySelectorAll(selector)
    if (!elements.length) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('in')
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    elements.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [selector])
}
