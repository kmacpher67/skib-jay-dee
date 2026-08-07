# Roadmap Handoff Plan v0.4.74 — Shleeb Shop Layout + Full Item Glossary

**Created by:** Codex GPT-5 — 2026-08-07
**Created on:** 2026-08-07
**Last updated by:** Codex GPT-5 — 2026-08-07
**Session mode:** Mode A (Planning / refinement only — docs only, no code,
no build, `GAME_ITERATION` not bumped)
**Mode impact:** `Runner only`

## Why this doc exists

Ken asked for two related cleanups:

1. The Shleeb Shop should stop reading like one tall vertical menu and
   instead present the cards side-by-side so newer items are easier to
   scan.
2. The Player's Guide should explain the full current item set clearly:
   what each item is for, when to use it, why it exists, and what the
   benefit or tradeoff is.

These belong together because the shop layout and the guide both need the
same canonical item list and the same wording discipline. The shop should
be easier to browse; the guide should answer the "what does this do?"
question without making the player hunt through multiple docs.

## Recommended shape

1. **Reflow the shop into a side-by-side card layout.**
   - Keep the existing Shleeb Shop panel and balance header.
   - Change the item area from a single long stack into a responsive grid
     that shows multiple cards across on the available portrait width.
   - Keep scrolling available inside the shop panel so future buys can add
     more cards without breaking the layout.
   - Visually separate the permanent perk cards from the warp-pass /
     progression unlock card so the player can tell "stat perk" from
     "start-level unlock" at a glance.
2. **Use the current canonical item catalog as the source of truth.**
   - Base the store copy on `frontend/src/gameContent.js` rather than
     inventing new item names or effects.
   - The guide should cover the current shipped shop perks:
     Turbo Clogs, Deep Breath Tank, Sheeb Magnet, Lucky Charm, Golden
     Lucky Charm, Neon Jump-Scare Filter, and the Warp Pass unlock.
   - It should also cover the shipped map pickups and special items the
     player actually sees in play: Jayden Gun, Taco Bell Grande / Shart
     Knocker, Rod of Poopdom, Heavy Plunger, Soggy Toilet Paper,
     Schleimy Potion, Decoy, Gawd Particle, Turdstone Token, and the
     rolling pickup pool.
3. **Rewrite the Player's Guide item section as a real glossary.**
   - For each item, explain:
     - what it does,
     - when you would use it,
     - why the game gives it to the player,
     - and the benefit or tradeoff.
   - Keep the tone funny, but make the functional part unambiguous.
   - Avoid duplicate wording across the guide and the in-game shop cards;
     the guide can be longer, while the shop stays compact.
4. **Keep the guide aligned with shipped behavior only.**
   - Document the live behaviors, not future ideas.
   - If an item has a limit, cooldown, or downside, say it plainly.
   - If an item is only useful in a certain level range, call that out.

## Current state

- `frontend/src/components/ShopModal.jsx` already renders the shop cards
  and the Warp Pass card in one list; the layout work is a presentation
  pass, not a feature rewrite.
- `frontend/src/gameContent.js` already contains the canonical names and
  copy for the current shop items.
- `docs/players-guide.md` explains the core mechanics, but its item
  coverage is still split across a few short sections and quick-reference
  bullets.
- `docs/interactive-content-pack.md` already seeds a broader item catalog,
  so the guide should stay faithful to the shipped subset instead of
  copying every speculative future item.

## Why this is better than leaving the current layout alone

- Side-by-side cards make it easier to compare cost and effect without
  scrolling through a long single column.
- Newer shop items stop getting visually buried below older ones.
- A fuller guide reduces guesswork during play and lowers the risk of
  the player misunderstanding when to use a pickup or why a perk exists.
- Keeping the wording in the guide aligned with the actual shipped item
  list avoids the documentation drifting from the game again.

## Files likely touched

- `frontend/src/components/ShopModal.jsx` — shape the shop card layout
  and, if needed, group progression unlocks separately from stat perks.
- `frontend/src/App.css` — add the responsive shop grid / spacing rules
  for side-by-side cards while preserving scroll behavior.
- `docs/players-guide.md` — expand the item section into a full glossary
  covering the current shipped item list.
- `docs/roadmap.md` / `docs/update-directions.md` / `docs/version-log.md`
  / `docs/handoffs/ledger.md` — keep the planning trail current.
- `frontend/src/components/VersionModal.jsx` — append the shipped version
  note if this lands in code as a new version.

## Explicitly not done

- No code changes yet.
- No `GAME_ITERATION` bump.
- No deploy.
- No new item balancing.
- No new pickups or shop items.
- No attempt to change the actual item effects.

## Copy-paste: next coding session

```text
Read docs/skib-sdlc.md, then docs/update-directions.md, then
docs/handoffs/roadmap-handoff-v0.4.74-plan.md, then docs/roadmap.md,
docs/players-guide.md, and frontend/src/gameContent.js.

Implement the Shleeb Shop layout cleanup and the full item glossary pass:

1. Reflow the shop cards into a side-by-side responsive layout while
   preserving scroll for longer item lists.
2. Keep the progression unlock card visually distinct from the normal
   perk cards.
3. Expand docs/players-guide.md into a current item glossary that
   explains what each shipped item does, when to use it, why it exists,
   and the benefit or tradeoff.
4. Keep the wording aligned with the canonical item names in
   frontend/src/gameContent.js.
5. Update docs/roadmap.md, docs/update-directions.md,
   docs/version-log.md, and docs/handoffs/ledger.md to match the new
   planning state.

Verify with `cd frontend && npm run build`.
If the UI layout changes materially, also smoke it in the browser and
confirm the shop still scrolls cleanly on a portrait viewport.

Do not bump GAME_ITERATION or deploy.
Do not change item effects or add new items.
```
