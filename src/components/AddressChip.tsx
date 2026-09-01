import { useEffect, useState } from 'react'
import { identity, isSet } from '../config/identity'
import { addressView } from '../config/state'
import { copyContractAddress, truncateAddress } from '../lib/address'
import { useMediaQuery } from '../hooks/useMediaQuery'

/**
 * The contract address row — the primary element of the hero after the
 * headline, and given matching prominence: a bordered box holding the
 * address in mono at a legible size, a real Copy button attached at its right
 * edge, and the social links on the same row.
 *
 * This is still the single render site for identity.contractAddress.
 *
 * Pre-launch it shows the placeholder form the client asked for,
 * `xxxxxxxxxxxxxpump`. The one hard rule that goes with it: while that string
 * is showing, **Copy is genuinely disabled and says why**. Putting a fake
 * address on someone's clipboard, where it can be pasted into a wallet, is the
 * single thing this component must never do. The moment
 * `identity.contractAddress` is set, the real address renders and Copy goes
 * live — the same isSet() flip that already governs LaunchNote.
 */
export function AddressChip() {
  const view = addressView()
  const isNarrow = useMediaQuery('(max-width: 620px)')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1600)
    return () => window.clearTimeout(timer)
  }, [copied])

  async function onCopy() {
    const ok = await copyContractAddress()
    setCopied(ok)
  }

  // The placeholder is short enough to never need truncating.
  const shown =
    view.address === null
      ? view.placeholder
      : isNarrow
        ? truncateAddress(view.address, 6)
        : view.address

  // Flat on purpose: .ca is a grid and places these three by area, so the
  // socials sit beside the box on desktop and beside the reason at narrow
  // widths without needing a second copy in the DOM.
  return (
    <div className="ca">
      <div className={view.hasAddress ? 'ca__box' : 'ca__box ca__box--pending'}>
        <span className="ca__label">{view.label}</span>
        <span className={view.hasAddress ? 'ca__value' : 'ca__value ca__value--pending'}>
          {shown}
        </span>
        <button
          type="button"
          className="ca__copy"
          onClick={onCopy}
          disabled={!view.canCopy}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <SocialLinks />

      {/* The reason is always rendered, never a title attribute alone. */}
      {view.disabledReason !== null && (
        <p className="ca__reason">{view.disabledReason}</p>
      )}

      <span className="sr-only" role="status">
        {copied ? 'Contract address copied to clipboard' : ''}
      </span>
    </div>
  )
}

/**
 * Social links, derived from identity so an icon appears the moment its URL
 * exists. A null destination is not rendered at all rather than shown as a
 * dead or unexplained icon — a greyed glyph with no visible reason would
 * break the same rule the copy button follows.
 */
function SocialLinks() {
  const links = [
    { key: 'x', label: `${identity.productName} on X`, url: identity.twitter.url, glyph: <XGlyph /> },
    { key: 'git', label: `${identity.productName} source`, url: identity.gitUrl, glyph: <GitGlyph /> },
  ].filter((link) => isSet(link.url))

  if (links.length === 0) return null

  return (
    <div className="ca__socials">
      {links.map((link) => (
        <a
          key={link.key}
          className="ca__social"
          href={link.url as string}
          rel="noreferrer noopener"
          target="_blank"
          aria-label={link.label}
        >
          {link.glyph}
        </a>
      ))}
    </div>
  )
}

function XGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" focusable="false">
      <path
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        fill="currentColor"
      />
    </svg>
  )
}

function GitGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" focusable="false">
      <path
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"
        fill="currentColor"
      />
    </svg>
  )
}
