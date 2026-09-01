# Botkit

Landing page for Botkit — a Solana-settled bot network. `botkit.fun`

## Run

```
npm install
npm run dev
```

Other scripts: `npm run build`, `npm run preview`, `npm run typecheck`.

## Structure

```
src/
  config/     identity.ts (all external identity), copy.ts (all strings),
              state.ts (every launch-conditional sentence)
  components/ Lid, Hero, AddressChip, LaunchNote, Board, Seat, Footer,
              NavLink, Wordmark
  styles/     tokens.css (palette + scale), base.css (reset), app.css
  lib/        address.ts (clipboard + middle-truncation)
  hooks/      useMediaQuery.ts, useInView.ts, useScrolled.ts
```

`src/config/` is the single source of truth. Every value there carries a
comment naming the components that render it and how its null state behaves —
read that comment before changing the value.

## Two things to know before editing

**Nothing on this page calls a wallet.** The CTA scrolls the kit into view and
moves focus. The copy control writes to the clipboard. That is the full extent
of the interactivity, and every label promises only what it does.

**`--mark` is reserved** for the CTA fill, the contract address, and the
wordmark's second half. It is not a status colour — seat state is carried by
`--cream` and `--stencil`. The rule is written out at the top of
`styles/tokens.css`.

**The palette is sampled from the client's own logo and banner** — not chosen.
Each sampled value is marked `SAMPLED` in `styles/tokens.css` with the pixel
measurement behind it. `--case` is the one derived value, and the reason it is
not the brand black is written down there too.

**The launch note is not a link, on purpose.** The reasoning is in the
`venueView` comment in `src/config/state.ts` — read it before adding one.

## Measured

Verified against the production build at four widths, re-measured after the
brand re-grounding — no horizontal overflow at any of them, every interactive
control at least 44×44px, and the headline
holding to three lines on mobile.

| Width | Overflow | Headline | Tray | Min target |
|---|---|---|---|---|
| 360px | none | 3 lines @ 36px | 1 column | 44px |
| 390px | none | 3 lines @ 36px | 1 column | 44px |
| 430px | none | 3 lines @ 36px | 1 column | 44px |
| 1440px | none | 3 lines @ 84px | 3 columns | 44px |

One thing the harness could not exercise: the CTA's smooth scroll. The browser
pane used for testing composites zero animation frames, so any frame-driven
scroll stays put — a bare `window.scrollTo({behavior:'smooth'})` fails there
identically. What was verified is that the handler runs, moves focus to the
kit heading, and that an instant scroll to the same target lands correctly.
