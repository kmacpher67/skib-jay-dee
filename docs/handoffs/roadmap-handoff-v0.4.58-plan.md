# Roadmap Handoff Plan v0.4.58 — Desktop Screen Size & Aspect Ratio

**Created by:** Antigravity — 2026-07-27
**Created on:** 2026-07-27
**Last updated by:** Cursor Grok 4.5 — 2026-07-27 (Mode A refine: decision brief, soft-park B, dual Mode B branches)
**Last updated on:** 2026-07-27
**Session mode:** Mode A (Planning only — docs only, no code)
**Status:** BLOCKED ON KEN — live choice is **Option A vs Option C** (Option B soft-parked)

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

## ⚠️ Flag for Ken (required before Mode B)

**Pick one:**

| Option | What the player gets | FOV vs mobile | Constraint note |
| --- | --- | --- | --- |
| **A — Fog of War / vignette** | Wider desktop shell (fills more of the monitor) | Effective sight distance matched to mobile via darkness mask | Explicit desktop exception to “forced 9:16 layout” in `AGENTS.md` / `skib-sdlc.md` — world FOV stays mobile-equivalent |
| **C — Scale + side art** | Same 9:16 playfield, scaled up to monitor height; themed side panels/art instead of black bars | Identical FOV to mobile | Preserves the 9:16 constraint; lowest balance risk |
| ~~B — Full FOV expand~~ | Full widescreen camera, see more map | **Bigger** than mobile | Soft-parked (see below) |

**Reply with `A` or `C`.** Until then, do not start Mode B and do not dispatch
Code Monkey on this handoff.

### Soft-park: Option B

Discussion consensus: full FOV expand breaks horror tension and item/chase
balance. Keep B only if Ken explicitly overrides; otherwise treat as
**rejected for v1 desktop support**.

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

Do not implement docs/handoffs/roadmap-handoff-v0.4.58-plan.md until Ken
replies A or C in that handoff (Option B is soft-parked).

After Ken answers, a planning session must paste the chosen branch into this
block, then Mode B may run that branch only.

Until then, pick the next unblocked coding slice from
docs/next-agent-coding-brief.md (not this handoff).
```
