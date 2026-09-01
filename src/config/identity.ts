/**
 * Single source of truth for every piece of external identity.
 *
 * Rules for this file:
 *  - Anything not yet confirmed by the client is `null`, never a stand-in
 *    string. A plausible-looking placeholder is worse than an empty field,
 *    because a real person can copy and paste it.
 *  - Every field below has exactly one render site, listed in its comment.
 *    A field with no render site must be marked INTENTIONALLY UNUSED.
 *  - Filling in `contractAddress` is the only edit required to take the
 *    address live across the whole site. Nothing else needs touching.
 */

export type Maybe<T> = T | null

export function isSet<T>(value: Maybe<T>): value is T {
  return value !== null
}

export interface Social {
  /** Displayed verbatim, including the leading @. */
  handle: string
  url: string
}

export interface LaunchVenue {
  /** Displayed verbatim, e.g. "pump.fun". */
  name: string
  /**
   * The token's page on that venue. Stays null until a real token exists.
   * Deliberately never derived from `contractAddress`: auto-building a
   * financial destination is something a human should type once, not
   * something a template should guess.
   */
  url: Maybe<string>
}

export interface Identity {
  /** Rendered by: Wordmark, LaunchNote. */
  productName: string
  /** Rendered by: Footer. Also the canonical URL in index.html. */
  domain: string
  /**
   * Canonical handle. The brief listed three (@botkit, @botkitfun,
   * @usebotkit). @botkit was confirmed canonical, then superseded: it
   * collides with an unrelated pre-existing account, so @botkitfun is the
   * canonical handle. The other two are deliberately absent rather than
   * present-but-unrendered.
   *
   * `handle` and `url` are independent strings and nothing enforces that
   * they agree — change both together or the nav will link somewhere its
   * own label does not name.
   * Rendered by: Lid (nav), Footer.
   */
  twitter: Social
  /**
   * The settlement chain. Stated in the brief, so it is not a Maybe.
   * Rendered by: Hero (supporting line), Board (tray label).
   */
  chain: string
  /**
   * The contract address. No token has launched, so this is null.
   * Setting it flips every "not live" surface on the site at once.
   * Rendered by: AddressChip — and nowhere else in the codebase.
   */
  contractAddress: Maybe<string>
  /**
   * Ticker symbol, e.g. "$BOTKIT". Not confirmed by the client, so null and
   * the ticker slot does not render at all.
   * Rendered by: AddressChip (label).
   */
  ticker: Maybe<string>
  /**
   * Documentation destination. Null until it exists; while null the nav item
   * renders disabled with a visible reason rather than as a dead link.
   * Rendered by: Lid (nav), Footer.
   */
  docsUrl: Maybe<string>
  /**
   * Source destination. Same disabled-with-reason treatment as docsUrl.
   * Rendered by: Lid (nav), Footer.
   */
  gitUrl: Maybe<string>
  /**
   * Where the token is intended to launch. A statement of intent, not a
   * claim that anything exists yet — see LaunchNote for how it is worded.
   * Set to null to remove the line from the page entirely.
   * Rendered by: LaunchNote.
   */
  launchVenue: Maybe<LaunchVenue>
}

export const identity: Identity = {
  productName: 'Botkit',
  domain: 'botkit.fun',
  twitter: { handle: '@botkitfun', url: 'https://x.com/botkitfun' },
  chain: 'Solana',
  contractAddress: null,
  ticker: null,
  docsUrl: null,
  gitUrl: null,
  launchVenue: { name: 'pump.fun', url: null },
}

/**
 * The one derived value the rest of the app reads.
 *
 * 'pending' — no contract address exists. Every "not live yet" surface on the
 *             site reads from this, so none of that copy is hard-coded and
 *             none of it has to be swept by hand at launch.
 * 'live'    — an address exists. The address line, the copy control and the
 *             CA-dependent copy all flip on their own.
 */
export type LaunchState = 'pending' | 'live'

export const launchState: LaunchState = isSet(identity.contractAddress)
  ? 'live'
  : 'pending'

export const isLive = launchState === 'live'
