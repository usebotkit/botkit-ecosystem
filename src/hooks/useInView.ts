import { useEffect, useRef, useState } from 'react'

/**
 * Fires once, when the element first reaches the viewport.
 *
 * `armed` is what gates the hidden starting state in CSS. It is only set
 * after mount, so if JavaScript never runs the seats are simply visible
 * rather than stuck at opacity 0 — the entrance is an enhancement, never a
 * precondition for seeing the kit.
 */
export function useInView<T extends Element>() {
  const ref = useRef<T | null>(null)
  const [armed, setArmed] = useState(false)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (el === null) return

    // No observer support: show everything, skip the sequence entirely.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    setArmed(true)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true)
            observer.disconnect()
            return
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(el)

    /*
     * Failsafe. The hidden starting state means a silent observer would hide
     * the page's main content for good, so if nothing has been reported by
     * the time this fires, reveal the tray anyway. The entrance is worth
     * losing; the kit is not.
     */
    const failsafe = window.setTimeout(() => {
      setInView(true)
      observer.disconnect()
    }, 1500)

    return () => {
      window.clearTimeout(failsafe)
      observer.disconnect()
    }
  }, [])

  return { ref, armed, inView }
}
