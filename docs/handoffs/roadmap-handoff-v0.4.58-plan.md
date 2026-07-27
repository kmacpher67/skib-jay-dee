# Roadmap Handoff Plan v0.4.58 — Desktop Screen Size & Aspect Ratio

**Created by:** Antigravity — 2026-07-27
**Created on:** 2026-07-27
**Last updated by:** Claude — 2026-07-27 (Ken's decision: FOV tied to difficulty tier)
**Last updated on:** 2026-07-27
**Session mode:** Mode A (Planning only — docs only, no code)
**Status:** DECISION MADE — FOV is not a single global A-vs-C pick. Ken wants
FOV tied to a difficulty setting: Easy = Option B (full screen), Normal =
in-between, Hardest ("4chan-tier") = Option A (tight fog-of-war window
following the player). Mode B still not started — implementation details
below need to be fleshed out before coding.

## Trigger

User request:

> "users asking for computer screen size for desktop screen devices so bigger
> playing size. is it too much of an advantage for user to see the whole map?
> Should we limit field of view? IDK, make this question."

Today the app letterboxes a forced **9:16** `.portrait-frame` on desktop
(`frontend/src/index.css`). The engine canvas is fixed at `VIEW_W = 360` /
`VIEW_H = 640` (`GameEngine.js`). Desktop players want a larger play surface;
widening the *camera* without a FOV policy would let them see chasers sooner
than mobile players.

## Investigation (read-only, current code)

| Touchpoint | What it does today |
| --- | --- |
| `frontend/src/index.css` `.stage` / `.portrait-frame` | Centers a 9:16 frame; side gutters are plain black |
| `GameEngine.js` `VIEW_W`/`VIEW_H` (360×640) | Fixed logical canvas; `_drawWorld` cameras via `viewCoords` |
| `App.jsx` desktop controls | Keyboard ARROWS/WASD + SPACE already exist; virtual joystick still drawn on canvas |
| `.dad-case-darkness` (`index.css` + `App.jsx`) | Full-frame dark overlay precedent (Dad Case spawn) |
| Near-miss vignette (`GameEngine.js`, shipped **v0.4.54**) | `createRadialGradient` pulse on near-miss escape — canvas FOW technique already in-tree |

**Balance fact (settled in discussion, not a Ken decision):** unrestricted
widescreen camera is a real advantage — jump-scare tension, multi-chaser
pressure, decoy placement, and Level 5+ wall-hack surprise all assume limited
sight distance. Do not ship Option B casually.

## Ken's decision — 2026-07-27: FOV tied to difficulty

Ken's reply reframes the A-vs-C choice below: instead of picking one FOV
policy for all desktop players, tie the field of view to a difficulty
setting so the previously "soft-parked" Option B becomes the *Easy* tier
instead of being rejected outright.

> "game play difficultly should have easy = full screen. normal, inbetween
> full and the 9:16. 4chan-st = HOV fog of war window around the user as
> they glide around."

| Difficulty | FOV behavior | Maps to |
| --- | --- | --- |
| **Easy** | Full screen / full widescreen camera — see the whole map | Option B (previously soft-parked; now scoped to Easy only) |
| **Normal** | In-between full screen and the strict 9:16 mobile FOV | New middle tier — not yet spec'd (see open questions) |
| **Hardest ("4chan-tier")** | Tight fog-of-war window that follows the player as they move ("HOV" window gliding with Jayden) | Option A2 (circular vignette around the player, reuses the v0.4.54 `createRadialGradient` pattern) |

This resolves the "is full FOV expand ever acceptable" question from the
Soft-park note below: yes, but only on Easy, where the balance risk is an
accepted tradeoff for accessibility, not an oversight.

**Open questions before this can move to Mode B (still Mode A / planning):**
- Is there an existing difficulty-select surface in the app already, or does
  this handoff need to scope a new difficulty picker (menu/settings screen)
  as a prerequisite? Needs a repo check before estimating Mode B size.
- "Normal — in-between full and 9:16": is this a fixed intermediate aspect
  ratio/FOV radius, or a value Ken wants tunable? Needs a concrete number
  (e.g. a specific vignette radius or aspect ratio) before coding.
- Confirm difficulty-tier naming ("4chan-tier" is Ken's shorthand in chat,
  not yet a name that should ship in-game UI) — needs a player-facing label.
- Does difficulty already gate other systems (chaser count, spawn timers,
  Level 5+ wall-hacks)? If so, FOV should likely hang off the same
  difficulty enum/config rather than a new standalone setting.

## ⚠️ Flag for Ken (superseded by the difficulty-tier decision above)

The table below was the original single-policy framing (pick A or C for
everyone). Ken's answer replaced it with the three-tier difficulty mapping
above, so this table is kept for context/history only — do not use it to
gate Mode B anymore. Still useful: the A1/A2 sub-choice and the concrete
code touchpoints it names are directly reused by the Hardest tier.

**Original framing (historical):**

| Option | What the player gets | FOV vs mobile | Constraint note |
| --- | --- | --- | --- |
| **A — Fog of War / vignette** | Wider desktop shell (fills more of the monitor) | Effective sight distance matched to mobile via darkness mask | Explicit desktop exception to “forced 9:16 layout” in `AGENTS.md` / `skib-sdlc.md` — world FOV stays mobile-equivalent |
| **C — Scale + side art** | Same 9:16 playfield, scaled up to monitor height; themed side panels/art instead of black bars | Identical FOV to mobile | Preserves the 9:16 constraint; lowest balance risk |
| ~~B — Full FOV expand~~ | Full widescreen camera, see more map | **Bigger** than mobile | Soft-parked (see below) |

~~**Reply with `A` or `C`.**~~ Superseded — see "Ken's decision" above.
Mode B is still blocked, but now on the open questions listed there (mainly:
does a difficulty picker already exist, and what's the concrete Normal-tier
FOV value), not on an A-vs-C pick.

### Soft-park: Option B — now un-parked, scoped to Easy only

Discussion consensus was that full FOV expand breaks horror tension and
item/chase balance if applied to everyone. Ken's decision resolves this by
scoping full FOV to the **Easy** difficulty tier specifically, where trading
balance for accessibility is an intentional, opt-in choice rather than a
default. Do not default new/unset players into Easy's full-FOV behavior.

### If Ken picks A — secondary choice (can answer with A)

| A-sub | Look | Notes |
| --- | --- | --- |
| **A1 — Portrait light column** | Bright vertical strip = mobile width; dark side wings fixed to screen | Simpler; “phone strip on a monitor” |
| **A2 — Circular light around Jayden** | Vignette follows runner; outer darkness | Stronger horror; reuses v0.4.54 radial-gradient pattern |

**Planning recommendation (not a Ken decision):** prefer **C** if the goal is
“bigger sprites, zero balance change”; prefer **A2** if the goal is “fill the
monitor + keep horror.” Do not code until Ken picks.

## Resolved this Mode A pass (docs only)

- Condensed prior discussion log + generic engine checklist + Option A sketch
  into this decision brief (no longer a transcript dump).
- Soft-parked Option B; live gate is **A vs C**.
- Named concrete code touchpoints and two shipped darkness/vignette precedents.
- Wrote dual Mode B branches below (still gated).
- Synced `docs/roadmap.md`, `docs/update-directions.md`, agent briefs,
  `docs/version-log.md`, and `docs/handoffs/ledger.md`.

## Mode B branches (do not execute until Ken picks)

### Branch A — Fog of War desktop shell

1. Desktop detection: widen shell beyond 9:16 when viewport is wide (CSS and/or
   canvas resize path). Keep mobile portrait unchanged.
2. Keep *effective* visible world radius ≈ current 360×640 sight; shroud the
   extra desktop pixels (CSS radial overlay and/or canvas
   `createRadialGradient` / `destination-in` mask in `_drawWorld`). Prefer A1
   or A2 per Ken’s secondary pick.
3. HUD: top stats stay usable on the wider top edge; hide virtual joystick /
   SPRINT on desktop width; keep keyboard prompt.
4. Update constraint docs (`AGENTS.md` / `skib-sdlc.md` / update-directions)
   to say: mobile stays forced 9:16; desktop may use a wider shell with FOV
   matched via fog.
5. Verify: build + Playwright; manual desktop vs narrow viewport FOV check
   (chasers must not be readable earlier on desktop than on mobile).

### Branch C — Scale 9:16 + side art

1. Keep `.portrait-frame` aspect-ratio 9/16; scale height to `100vh` (already
   close); replace black `.stage` gutters with themed side art / simple panels
   (stats, flavor art — no new gameplay systems).
2. Do **not** change `VIEW_W`/`VIEW_H` or camera FOV.
3. Optional: hide on-canvas joystick on desktop (keyboard already works) —
   layout-only, not required for balance.
4. Verify: build + Playwright; desktop screenshot shows larger playfield,
   identical world visibility to mobile.

### Shared non-goals (both branches)

- No multiplayer balance pass.
- No dynamic in-run FOV zoom redesign.
- No asset inventing for side art if Ken has none — use CSS/theme placeholders
  and flag Ken for real art later.

## Explicitly not in this pass

- No code, no `GAME_ITERATION` bump, no deploy.
- No picking A or C on Ken’s behalf.

---

## Copy-paste: next coding session (Mode B)

```text
Mode B for Desktop Screen Support is BLOCKED.

Ken has decided FOV should be tied to a difficulty tier (Easy = full screen,
Normal = in-between, Hardest = fog-of-war window following the player) —
see "Ken's decision — 2026-07-27" in
docs/handoffs/roadmap-handoff-v0.4.58-plan.md. This is no longer an A-vs-C
pick, but Mode B still can't start until a follow-up Mode A pass answers the
open questions in that section (existing difficulty picker or not, concrete
Normal-tier FOV value, player-facing tier naming, and whether FOV should
hang off an existing difficulty config).

Until then, pick the next unblocked coding slice from
docs/next-agent-coding-brief.md (not this handoff).
```
