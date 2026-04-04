import { useEffect, useState } from 'react'

const MOBILE_BREAKPOINT = '(max-width: 768px)'

function getIsMobileViewport() {
  if (typeof window === 'undefined') return false
  return window.matchMedia(MOBILE_BREAKPOINT).matches
}

export default function useIsMobileViewport() {
  const [isMobileViewport, setIsMobileViewport] = useState(getIsMobileViewport)

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT)
    const syncViewport = () => setIsMobileViewport(mediaQuery.matches)

    syncViewport()

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', syncViewport)
      return () => mediaQuery.removeEventListener('change', syncViewport)
    }

    mediaQuery.addListener(syncViewport)
    return () => mediaQuery.removeListener(syncViewport)
  }, [])

  return isMobileViewport
}
