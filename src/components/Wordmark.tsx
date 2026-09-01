import { identity } from '../config/identity'

/**
 * The official lockup, rebuilt from the client's banner: the orbital mark,
 * then the wordmark split two-tone — "BOT" in cream, "KIT" in the sampled
 * gold. The split is derived from `productName` rather than hard-coded, so a
 * rename cannot leave the colouring pointing at the wrong letters.
 *
 * The wordmark stays live text rather than the banner's raster lockup: it
 * remains selectable, crisp at any DPI, and costs no bytes.
 */
export function Wordmark() {
  const name = identity.productName
  const split = Math.ceil(name.length / 2)
  const head = name.slice(0, split)
  const tail = name.slice(split)

  return (
    <a className="wordmark" href="#top">
      <picture>
        <source srcSet="/mark.webp" type="image/webp" />
        <img className="wordmark__mark" src="/mark.png" alt="" width={82} height={84} />
      </picture>
      <span className="wordmark__text">
        <span className="wordmark__head">{head}</span>
        <span className="wordmark__tail">{tail}</span>
      </span>
    </a>
  )
}
