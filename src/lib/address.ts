import { identity, isSet } from '../config/identity'

/**
 * The only non-display consumer of identity.contractAddress.
 *
 * Display happens in exactly one component (AddressChip), so together with
 * this helper there are two places in the codebase that touch the value and
 * no more.
 */
export async function copyContractAddress(): Promise<boolean> {
  const address = identity.contractAddress
  if (!isSet(address)) return false

  try {
    await navigator.clipboard.writeText(address)
    return true
  } catch {
    return false
  }
}

/**
 * Middle-truncate a long address so it can never force a horizontal scroll
 * at 360px. Only applied below the breakpoint where the full string fits.
 */
export function truncateAddress(address: string, keep = 6): string {
  if (address.length <= keep * 2 + 1) return address
  return `${address.slice(0, keep)}…${address.slice(-keep)}`
}
