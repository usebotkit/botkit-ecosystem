import { linkState } from '../config/state'

interface Props {
  label: string
  url: string | null
  /** Renders as a bordered control — used for the one live link in the lid. */
  chip?: boolean
  /** Hidden on narrow viewports, where a disabled item is only noise. */
  optional?: boolean
}

/**
 * A null destination never renders as an anchor. It renders as disabled text
 * carrying its reason, so there is no dead link anywhere on the site.
 */
export function NavLink({ label, url, chip = false, optional = false }: Props) {
  const { enabled, reason } = linkState(url)

  const classes = [
    'navlink',
    chip ? 'navlink--chip' : '',
    optional ? 'navlink--optional' : '',
    enabled ? '' : 'navlink--off',
  ]
    .filter(Boolean)
    .join(' ')

  if (!enabled) {
    return (
      <span className={classes} aria-disabled="true">
        {label}
        <span className="sr-only"> — {reason}</span>
      </span>
    )
  }

  return (
    <a className={classes} href={url as string} rel="noreferrer">
      {label}
    </a>
  )
}
