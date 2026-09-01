import { identity } from '../config/identity'
import { useScrolled } from '../hooks/useScrolled'
import { NavLink } from './NavLink'
import { Ticker } from './Ticker'
import { Wordmark } from './Wordmark'

export function Lid() {
  const scrolled = useScrolled()

  return (
    <header className={scrolled ? 'lid lid--scrolled' : 'lid'}>
      <div className="shell lid__inner">
        <Wordmark />
        {/* The live link comes first: a working destination never queues
            behind disabled ones. Docs and Git are null today, so they are
            dropped entirely on narrow viewports rather than crowding it. */}
        <nav className="lid__nav" aria-label="Primary">
          <NavLink label={identity.twitter.handle} url={identity.twitter.url} chip />
          <NavLink label="Docs" url={identity.docsUrl} optional />
          <NavLink label="Git" url={identity.gitUrl} optional />
        </nav>
      </div>

      {/* Second row of the same sticky header, so the strip stays pinned
          directly under the nav instead of sliding away 30px into a scroll.
          The reference's header is not sticky; ours is, so matching it
          literally would have hidden the strip almost immediately. */}
      <Ticker />
    </header>
  )
}
