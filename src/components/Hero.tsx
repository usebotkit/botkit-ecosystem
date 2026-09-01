import { copy } from '../config/copy'
import { AddressChip } from './AddressChip'
import { LaunchNote } from './LaunchNote'

/**
 * The CTA is functional as UI and nothing more: it moves focus to the kit and
 * scrolls it into view. It does not connect a wallet, sign anything, or move
 * funds — and its label promises nothing else.
 *
 * Order matters here. Focus is moved first with `preventScroll`, because
 * focusing an element cancels an in-flight smooth scroll — doing it the other
 * way round leaves the page sitting where it started.
 */
export function Hero() {
  function openKit() {
    const target = document.getElementById('kit')
    if (target === null) return

    const heading = target.querySelector<HTMLElement>('#kit-label')
    heading?.focus({ preventScroll: true })

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    target.scrollIntoView({
      behavior: reduced ? 'auto' : 'smooth',
      block: 'start',
    })
  }

  return (
    <section className="hero">
      <div className="shell">
        <p className="eyebrow">{copy.hero.eyebrow}</p>
        <h1 className="headline">{copy.hero.headline}</h1>
        <p className="supporting">{copy.hero.supporting}</p>

        <div className="hero__actions">
          <button type="button" className="cta" onClick={openKit}>
            {copy.hero.cta}
          </button>
        </div>

        {/* The address gets its own band rather than sitting as a chip beside
            the CTA, where it read as an afterthought. It and the launch note
            are the same subject, so they sit together. */}
        <AddressChip />

        <LaunchNote />
      </div>
    </section>
  )
}
