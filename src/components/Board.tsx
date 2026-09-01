import { copy, seats } from '../config/copy'
import { useInView } from '../hooks/useInView'
import { Seat } from './Seat'

export function Board() {
  const { ref, armed, inView } = useInView<HTMLUListElement>()

  const trayClass = ['tray', armed ? 'tray--armed' : '', inView ? 'tray--in' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <section className="board" id="kit" aria-labelledby="kit-label">
      <div className="shell">
        {/* tabIndex -1 so the CTA can move focus here, not just scroll. */}
        <h2 className="board__label" id="kit-label" tabIndex={-1}>
          {copy.board.label}
        </h2>
        <p className="board__lede">{copy.board.lede}</p>

        {/* The entrance runs when the tray is reached, not when the page
            loads — on mobile the kit sits well below the fold, so a load-time
            sequence would finish before anyone saw it. */}
        <ul className={trayClass} ref={ref}>
          {seats.map((seat, index) => (
            <Seat key={seat.id} seat={seat} index={index} />
          ))}
        </ul>
      </div>
    </section>
  )
}
