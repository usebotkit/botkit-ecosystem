import { useLayoutEffect, useRef } from 'react'
import { tickerItems } from '../config/state'

/**
 * The status strip pinned under the lid.
 *
 * Mechanic: a doubled track translated exactly -50%, so the loop seam is
 * invisible. Pure CSS animation, no JavaScript in the render path.
 *
 * Two deliberate departures from the usual implementation of this pattern:
 *  - Its ticker text measures 4.27:1 and 4.18:1 — both fail WCAG AA. Ours
 *    runs --cream and --stencil on --recess: 17.38:1 and 6.91:1.
 *  - It has no `prefers-reduced-motion` handling at all. Ours stops dead.
 *
 * The strip is aria-hidden: every item it carries is already available in
 * the board, the hero eyebrow, or the address chip, and a duplicated
 * infinite-scrolling region is noise to a screen reader.
 */

/** Measured off the reference: 3908px track ÷ 2 ÷ 42s. */
const SPEED_PX_PER_SECOND = 46.5

export function Ticker() {
  const items = tickerItems()
  const trackRef = useRef<HTMLDivElement>(null)

  /**
   * Duration is derived from the measured track so the speed is the specified
   * 46.5 px/s regardless of how long the content is or which font has loaded.
   * A fixed duration would drift the moment a seat name changed.
   */
  useLayoutEffect(() => {
    const track = trackRef.current
    if (track === null) return

    const apply = () => {
      // The track holds every item twice; one loop travels half of it.
      const distance = track.scrollWidth / 2
      if (distance <= 0) return
      const seconds = distance / SPEED_PX_PER_SECOND
      track.style.setProperty('--ticker-duration', `${seconds.toFixed(2)}s`)
    }

    apply()

    // Recursive loads async and changes the track width when it arrives.
    if (typeof document !== 'undefined' && document.fonts !== undefined) {
      document.fonts.ready.then(apply).catch(() => {})
    }

    let observer: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(apply)
      observer.observe(track)
    }
    window.addEventListener('resize', apply)

    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', apply)
    }
  }, [items])

  // Rendered twice, in document order. -50% is only seamless at exactly 2x.
  const doubled = [...items, ...items]

  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track" ref={trackRef}>
        {doubled.map((item, index) => (
          <div
            className={item.issued ? 'ticker__item ticker__item--on' : 'ticker__item'}
            key={`${item.label}-${index}`}
          >
            <span className="ticker__label">{item.label}</span>
            <span className="ticker__value">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
