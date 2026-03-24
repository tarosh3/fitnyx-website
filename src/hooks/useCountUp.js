import { useEffect, useRef, useState } from 'react'

export function useCountUp(target, duration = 1800) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const observed = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !observed.current) {
            observed.current = true
            const start = performance.now()
            const isFloat = target % 1 !== 0

            function step(now) {
              const elapsed = now - start
              const progress = Math.min(elapsed / duration, 1)
              const eased = 1 - Math.pow(1 - progress, 3)
              const current = eased * target

              setValue(isFloat ? parseFloat(current.toFixed(1)) : Math.floor(current))

              if (progress < 1) requestAnimationFrame(step)
            }

            requestAnimationFrame(step)
          }
        })
      },
      { threshold: 0.3 }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [target, duration])

  return { ref, value }
}
