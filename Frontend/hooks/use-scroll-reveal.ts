"use client"

import { useEffect, useState } from "react"

/**
 * useScrollReveal
 * Returns true when the user has scrolled beyond the given threshold (in px).
 */
export function useScrollReveal(threshold = 80) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset
      setVisible(y > threshold)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [threshold])

  return visible
}
