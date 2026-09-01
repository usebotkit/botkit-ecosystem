import type { Seat as SeatModel } from '../config/copy'
import { seatStateLine } from '../config/state'

/**
 * The signature element. A capability is a shape routed into the board, not
 * a raised card.
 *
 * The recess reads at only 1.08:1 against the ground, so depth is carried by
 * the bevel and inner shadow — and state is always stated in words as well,
 * because none of that reaches a screen reader or survives a poor panel.
 */
export function Seat({ seat, index }: { seat: SeatModel; index: number }) {
  const issued = seat.status === 'issued'

  return (
    <li
      className={issued ? 'seat seat--issued' : 'seat seat--planned'}
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
    >
      <div>
        <h3 className="seat__id">{seat.id}</h3>
        <p className="seat__summary">{seat.summary}</p>
      </div>
      <span className="seat__state">{seatStateLine(seat.status)}</span>
    </li>
  )
}
