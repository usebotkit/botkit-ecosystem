import { identity } from './identity'

/**
 * All user-facing strings.
 *
 * PLACEHOLDER COPY. Written in Botkit's voice for the build; none of it is
 * client-supplied final copy. The wording here was deliberately kept to
 * claims that are verifiable from the page itself — see the note on
 * `seats` below, which is the one place a product claim could creep in.
 *
 * Anything conditional on launch lives in `state.ts`, not here, so that no
 * sentence in this file needs editing when the contract address lands.
 */

export const copy = {
  hero: {
    eyebrow: `${identity.chain}-settled bot network`,
    headline: 'Issue a bot exactly the tools it needs. Nothing else.',
    supporting:
      `A capability kit for autonomous agents, settled on ${identity.chain}. ` +
      'Every tool a bot can use is issued one at a time — and everything not ' +
      'yet issued is on this page as an empty seat.',
    cta: 'Open the kit',
  },

  board: {
    label: 'The kit',
    /** Shown above the tray, describing what the seats mean. */
    lede:
      'Each seat below is one capability. A seated tool is issued and usable. ' +
      'An empty seat is cut, labelled, and not issued yet — there is nothing ' +
      'behind it to try.',
  },

  footer: {
    /** Deliberately not a claim about what the network does today. */
    line: 'A kit is only honest if the empty seats are visible.',
  },
} as const

/**
 * The capability set.
 *
 * PLACEHOLDER — these names are Botkit's own vocabulary, chosen to be
 * coherent with the kit conceit, but the actual capability list has not been
 * confirmed by the client. Naming a capability is a product claim, so this
 * array is the one thing in the codebase a client review must sign off before
 * launch. The board renders entirely from here; swapping the list is a
 * one-file edit and no component changes.
 *
 * `status` is 'planned' for every seat because nothing has shipped. Flipping
 * one to 'issued' is what seats a tool — no other edit is required, and no
 * count, percentage or uptime figure is derived from this anywhere.
 */
export type SeatStatus = 'issued' | 'planned'

export interface Seat {
  /** Rendered as the seat name, in mono. */
  id: string
  /** One line, present tense, describing the capability. */
  summary: string
  status: SeatStatus
}

export const seats: readonly Seat[] = [
  { id: 'issue', summary: 'Grant a bot one named capability.', status: 'planned' },
  { id: 'revoke', summary: 'Withdraw a grant already issued.', status: 'planned' },
  { id: 'spend', summary: 'Bot-initiated payment against a grant.', status: 'planned' },
  { id: 'quote', summary: 'Price a swap before committing to it.', status: 'planned' },
  { id: 'settle', summary: `Finalise the result on ${identity.chain}.`, status: 'planned' },
  { id: 'audit', summary: 'Read back everything a bot did.', status: 'planned' },
] as const
