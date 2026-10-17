# TableSizer design notes (rev. 2, Oct 16 2026): luxury-retail direction

## What we observed
**arhaus.com** (homepage HTML fetched with curl on 2026-10-16, ~968 KB):
- Fonts: self-hosted **Louize Display** (a light display serif) for headlines and **GT America** (a neo-grotesque sans) for everything else. Both are commercial, so we use free analogues.
- Colour: mostly #ffffff backgrounds with #222222 text, plus #000; a rust accent **#89331c** on solid buttons; deep brown #341918 and pale grey #f1f1f1 surfaces; one muted green #4b5f59. Colour otherwise comes from photography.
- Type scale in inline CSS: 14, 20, 22, 32, 36, 38, 40, 48, 50, 75px, a large jump from body to display.
- Letter-spacing **0.2em** on label text; `border-radius: 0` (square corners).
- Layout: full-bleed lifestyle photography carries the page; the UI chrome stays quiet.

**rh.com** couldn't be inspected. curl got Akamai "Access Denied", and headless Chrome got RH's bot page ("Something went wrong"). Even that page renders in a thin, uppercase, widely tracked grotesque on pure white, which matches RH's well-known style: monochrome, ultra-light sans, all-caps tracked labels, large photography, almost no colour. Everything else about RH here is general knowledge, not a fetch.

## What we changed (and the AI/SaaS tells we removed)
- Removed: bento grid, gradients on cards, pill buttons, icon glyphs, dark-mode toggle, fade-in-on-scroll, rounded "glass" cards, and promotional copy.
- **Type:** Cormorant Garamond 300/400 (free, close in spirit to Louize) for display; Jost 300/400 (free geometric sans, close to RH/GT America restraint) for UI. Labels, nav and buttons are uppercase, 0.72rem, 0.22em tracking.
- **Colour:** stone #f7f5f1 background, white planner surface, charcoal #222 text, hairline rules #d9d4cc. Warm wood (#b48a63) is used only for the table in the plan.
- **Shape:** square corners everywhere. Solid charcoal and square outline buttons, plus underlined text-link CTAs.
- **Layout:** centred wordmark header with a separate tracked nav row (Arhaus/RH pattern); full-bleed editorial photography; generous section spacing (~110px); hairline-divided lists instead of cards.
- **Planner:** drawn like an architectural plan. Double-line walls, dashed clearance line, light 45° hatch in the walkway zone, outline chairs, tick-marked dimension lines, small uppercase labels.
- **Copy:** calm furniture-house voice ("Every good room starts with a measurement", "Have it built to measure").
- **Photography:** CC0 Unsplash images (via Wikimedia Commons) of real wooden tables, credited on /credits.html. The Fargo Woodworks product photo appears only on its listing, attributed.
