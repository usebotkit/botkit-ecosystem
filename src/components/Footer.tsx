import { copy } from '../config/copy'
import { identity } from '../config/identity'
import { NavLink } from './NavLink'

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <p className="footer__line">{copy.footer.line}</p>
        <div className="footer__meta">
          <span className="footer__domain">{identity.domain}</span>
          <NavLink label="Docs" url={identity.docsUrl} />
          <NavLink label="Git" url={identity.gitUrl} />
          <NavLink label={identity.twitter.handle} url={identity.twitter.url} />
        </div>
      </div>
    </footer>
  )
}
