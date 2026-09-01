import { identity, isSet, launchState } from './identity'
import { seats } from './copy'
import type { SeatStatus } from './copy'
import { truncateAddress } from '../lib/address'

/**
 * Every sentence on the site whose truth depends on whether something exists
 * yet. Nothing here is a fixed string that says "not live" — each function
 * derives its wording from config, so the day `contractAddress` is filled in,
 * the page re-words itself with no manual sweep.
 *
 * This is the direct fix for a launch-night failure seen on an earlier
 * build: a config value was set but nothing rendered it. Here the render
 * sites are the only consumers, and they cannot silently disagree with
 * config because they have no wording of their own.
 */

/**
 * The pre-launch placeholder, in the form the client asked for.
 *
 * It is safe to display precisely because it cannot be mistaken for an
 * address — it is all x's, and it is 17 characters against a real Solana
 * address's 43-44. It is also never copyable: while this value is showing,
 * the copy control is disabled and says why. See `canCopy` below.
 */
const PLACEHOLDER_ADDRESS = 'xxxxxxxxxxxxxpump'

export interface AddressView {
  /** Whether to render the address string at all. */
  hasAddress: boolean
  /** The address, only when one exists. */
  address: string | null
  /** Label above the address slot. */
  label: string
  /** Shown in the box in place of the address while none exists. */
  placeholder: string
  /**
   * A short state word for compact surfaces that cannot fit the placeholder
   * string — currently the ticker. Never shown in the address box itself.
   */
  shortState: string
  /** Whether the copy control is interactive. */
  canCopy: boolean
  /**
   * Why the copy control is disabled. Rendered visibly next to it — never a
   * title attribute alone, and never omitted.
   */
  disabledReason: string | null
}

export function addressView(): AddressView {
  const address = identity.contractAddress

  if (isSet(address)) {
    return {
      hasAddress: true,
      address,
      label: isSet(identity.ticker) ? `${identity.ticker} contract` : 'Contract',
      placeholder: '',
      shortState: 'Issued',
      canCopy: true,
      disabledReason: null,
    }
  }

  return {
    hasAddress: false,
    address: null,
    label: 'Contract',
    placeholder: PLACEHOLDER_ADDRESS,
    shortState: 'Not issued',
    canCopy: false,
    disabledReason: 'Placeholder — not a real address',
  }
}

/** The state line under a seat. Wording follows status, never the other way. */
export function seatStateLine(status: SeatStatus): string {
  return status === 'issued' ? 'Issued' : 'Not issued yet'
}

/**
 * Whether a link should render as a link at all. A null destination renders
 * as disabled-with-reason, never as an anchor pointing nowhere.
 */
export function linkState(url: string | null): {
  enabled: boolean
  reason: string | null
} {
  return isSet(url)
    ? { enabled: true, reason: null }
    : { enabled: false, reason: 'Not published yet' }
}

export interface VenueView {
  /** False when no venue is configured — the row is not rendered at all. */
  show: boolean
  text: string
  /** Null renders as plain text, never as an anchor. */
  url: string | null
}

/**
 * The launch-venue line.
 *
 * Pre-launch this is a statement of intent, not a claim that a token exists,
 * and it carries no date because we do not have one. The second sentence is
 * true by construction while `contractAddress` is null, and it is the most
 * useful thing the page can say to someone who has just found an
 * impersonator.
 *
 * The pre-launch case forces `url` to null regardless of what config holds.
 * Linking to the venue before the real token page exists would hand people a
 * search box on a site where pre-launch impersonation is routine, so the link
 * only ever appears once a real destination has been set by hand.
 */
export function venueView(): VenueView {
  const venue = identity.launchVenue
  if (!isSet(venue)) {
    return { show: false, text: '', url: null }
  }

  if (launchState === 'live') {
    return { show: true, text: `Trading on ${venue.name}.`, url: venue.url }
  }

  return {
    show: true,
    text:
      `When the token launches, it will be on ${venue.name}. ` +
      `Anything claiming to be ${identity.productName} before then is not us.`,
    url: null,
  }
}

export interface TickerItem {
  /** Rendered first, in --cream. Uppercased by CSS, not stored uppercase. */
  label: string
  /** Rendered second. --cream when issued, --stencil when not. */
  value: string
  issued: boolean
}

/**
 * The status strip that runs under the lid.
 *
 * Every item is derived — six from the `seats` array, two from identity — so
 * the strip re-words itself at launch on exactly the same edit that flips
 * AddressChip and LaunchNote. Nothing here is a fixed sentence and nothing is
 * a number we invented.
 *
 * Deliberately not a trade feed. Implementations of this pattern often scroll
 * fabricated trades against real people's handles; the mechanic is worth
 * copying and the content is not.
 */
export function tickerItems(): readonly TickerItem[] {
  const address = addressView()

  return [
    ...seats.map((seat) => ({
      label: seat.id,
      value: seatStateLine(seat.status),
      issued: seat.status === 'issued',
    })),
    { label: 'chain', value: identity.chain, issued: true },
    {
      label: 'contract',
      value: address.hasAddress
        ? truncateAddress(address.address as string, 4)
        : address.shortState,
      issued: address.hasAddress,
    },
  ]
}

/** Exposed for the one place that needs the raw phase: the document title. */
export { launchState }
