import { venueView } from '../config/state'

/**
 * The launch-venue line, directly under the address chip.
 *
 * Wording and link behaviour both come from `venueView()`, so nothing here
 * hard-codes a sentence and the row re-words itself when the contract address
 * lands. A null `launchVenue` removes the row entirely rather than leaving an
 * empty element behind.
 */
export function LaunchNote() {
  const view = venueView()
  if (!view.show) return null

  return (
    <p className="launch-note">
      {view.url === null ? (
        view.text
      ) : (
        <a className="launch-note__link" href={view.url} rel="noreferrer">
          {view.text}
        </a>
      )}
    </p>
  )
}
