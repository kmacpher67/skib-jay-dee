# Roadmap Handoff v0.4.53 — Role Reversal v1 (Menu Mode)

**Created by:** Composer — 2026-07-27
**Last updated by:** Composer — 2026-07-27
**Session mode:** Mode B — **shipped**

## Source

Ken, 2026-07-27, recorded in `roadmap-handoff-v0.4.43-plan.md`:

- **Menu mode** — separate from campaign level progression.
- **Human chaser vs. AI runner** — no multiplayer for v1.
- **No economy** — no sheebs, badges, or shop in chaser mode v1.

LT sequencing: finish Level 10 arc first is still the stated priority — treat
this as a **parallel mode** that can ship before Level 10 content exists, but
not before Ken answers the open kit questions below (or explicitly approves
recommended defaults).

## Confirmed (do not re-litigate)

| Decision | Ken's answer |
|---|---|
| Entry point | New main-menu mode ("Play as Chaser") |
| Opponent | AI-controlled runner (runner AI must be written — does not exist today) |
| Economy | None in v1 |
| Multiplayer | Out of scope for v1 |

## Still open before Mode B

| # | Question | Planning recommendation |
|---|---|---|
| 1 | Win condition | Capture runner once → round ends (arcade) |
| 2 | Human chaser kit | Move + sprint only in v1; no Plunger Launch / wall-hacks |
| 3 | Face | Pick from `CHASER_FACE_POOL` (no upload in v1) |
| 4 | Map | Reuse Level 1 (Porcelain Palace) as the v1 arena |
| 5 | Gate behind Level 10? | No gate in v1 — menu always available |

**Do not code until Ken confirms rows 1–2** (or says "use recommendations").

## Explicitly not in scope v1

- Multiplayer / WebSocket.
- Chaser sheebs, badges, shop.
- Full campaign inversion (playing through all levels as chaser).

## Copy-paste: after Ken confirms kit + win condition

```text
Read roadmap-handoff-v0.4.53-plan.md and roadmap-handoff-v0.4.43-plan.md.

Build Role Reversal v1: menu entry, human chaser input, minimal runner AI on
Level 1 map, capture-once win, no economy. Front-end only.

Verify: npm run build + manual playtest + e2e smoke if a debug hook exists.
```
