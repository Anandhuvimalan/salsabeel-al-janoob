"use client"
import { useEffect, useRef, useState } from "react"

// Scroll state for the fixed navbars.
// Reads scroll position at most once per animation frame and ignores small
// movements, so momentum/trackpad jitter can't make the bar flicker between
// shown and hidden. Components only re-render when a value actually changes.
export function useScrollNav({ threshold = 10, topOffset = 50 } = {}) {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const lastY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    lastY.current = window.scrollY
    setScrolled(window.scrollY > topOffset)

    const update = () => {
      ticking.current = false
      const y = Math.max(0, window.scrollY)
      setScrolled(y > topOffset)

      if (y <= topOffset) {
        setHidden(false)
        lastY.current = y
        return
      }
      const delta = y - lastY.current
      if (Math.abs(delta) < threshold) return
      setHidden(delta > 0)
      lastY.current = y
    }

    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(update)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [threshold, topOffset])

  return { hidden, scrolled }
}
