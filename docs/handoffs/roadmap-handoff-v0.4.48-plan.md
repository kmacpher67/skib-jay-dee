# Roadmap Handoff Plan v0.4.48 — Backlog Triage & Gameplay Rebalancing

**Created by:** Composer — 2026-07-27
**Last updated by:** Composer — 2026-07-27 (Ken decisions recorded)
**Session mode:** Mode A (Planning — docs only, no code changes)

## Source

Ken asked for a front-end-only planning pass: review and cross-reference all
related `docs/`, create plans for outstanding roadmap/backlog items, refine
features not fully vetted, and leave the repo ready for Mode B.

## Current production state (verified)

- `GAME_ITERATION`: **v0.4.47** (`frontend/src/version.js`)
- Recent shipped slices (newest first):
  - **v0.4.47** — Rod of Poopdom teleport pickup (`T`/`F` + facing-direction
    warp, 300px cap, wall-block at destination, 3s Stinky cooldown, 5% spawn
    roll). See `roadmap-handoff-v0.4.47.md`.
  - **v0.4.46** — Menu footer layout fix (scrollable `.menu`, footer styling).
    See `roadmap-handoff-v0.4.46.md`.
  - **v0.4.45** — Player's Guide modal → external GitHub link (single source of
    truth in `docs/players-guide.md`). See `roadmap-handoff-v0.4.45.md`.
  - **v0.4.43** — Player's Guide modal (superseded by v0.4.45 link).
  - **v0.4.42** — Menu brag stat (`bestRun`).
  - **v0.4.41** — Rewards & History panel (Slice A: badge + purchase log).

## Backlog triage (frontend-only, 2026-07-27)

| Priority | Item | Status | Handoff / doc |
|---|---|---|---|
| **1 — code next** | Cosmetic shop sink | Unblocked — small, self-contained | `roadmap-handoff-v0.4.50-plan.md` |
| **3 — code next** | `.portrait-frame` wide-viewport CSS bug | Unblocked — known fix in `docs/future-versions.md` | Bundled in v0.4.50-plan as optional fast-follow |
| **4 — specced, Ken confirm** | Broth Slip (`ant-k-raman` chaserType) | Recommended defaults written; needs Ken sign-off on stats | `roadmap-handoff-v0.4.49-plan.md` |
| **5 — blocked on Ken** | Rewards HUD pills (Slice B) | Open (a)/(b) question | `roadmap-handoff-v0.4.41-plan.md` |
| **5 — blocked on Ken** | Pickup tracking + Play Recap | Three open questions | `roadmap-handoff-v0.4.41-plan.md` addendum |
| **5 — blocked on Ken** | LT roadmap (Level 10 arc, Role Reversal, MOBA) | Five+ open questions | `roadmap-handoff-v0.4.43-plan.md` |
| **5 — blocked on Ken** | Audio 2 (1:1 voice clips) | Needs Ken to record | `docs/dialog_content_chasing.md` |
| **5 — blocked on Ken** | Yoodeling Unc second pose | Photo not in repo | `docs/characters.md` |
| **5 — blocked on Ken** | Distinct runner pose photos | Byte-identical duplicates | `docs/characters.md` |
| **6 — design track** | Difficulty Function (Method C / Debt Lock) | Design-only, TBDs remain | `docs/difficulty-mechanics-plan.md` |
| **6 — design track** | Cool Play (evasion polish) | MVP scoped below — not code-ready | See "Refinements" |
| **6 — design track** | Micro-Skib chaser | MVP scoped below — not code-ready | See "Refinements" |
| **6 — design track** | Level 7+ Mosaic Map | Dimension-shift trigger unanswered | `docs/level-progression-and-endgame-plan.md` |
| **7 — large / later** | Interactive content pack | Ongoing seasoning | `docs/interactive-content-pack.md` |
| **7 — large / later** | Intro cinematic | Script exists in PDF | `docs/future-versions.md` |
| **7 — large / later** | Multiplayer spike (Phase 5) | Backend scaffold only | `docs/roadmap.md` Phase 5 |

### Shipped this pass (checkbox corrections)

These were open in `docs/roadmap.md` but already landed — corrected in the
roadmap snapshot:

- Player's Guide (modal v0.4.43 → link v0.4.45)
- Menu brag stat (v0.4.42)
- Rewards & History panel Slice A (v0.4.41)
- Rod of Poopdom (v0.4.47)

Slice B (HUD live-data pills) and the Pickup/Play Recap addendum remain
open by design.

## Refinements — features not fully vetted

### Cool Play (Chaser Evasion) — scoped MVP (still design-only)

**Problem:** "Make evasion feel cooler" is too broad for one session.

**Recommended smallest slice (do not code until Ken picks one):**

1. **Near-miss particle burst** — when a chaser enters the existing
   `near-capture` proximity band but the runner escapes, spawn a short
   radial particle burst + a 0.2s screen-edge vignette pulse. Reuses the
   existing proximity detection; no new AI.
2. **Corner-slide visual only** — when the runner's velocity vector is
   within 15° of a wall normal, draw a brief skid-mark streak (cosmetic,
   no physics change).
3. **Defer:** dynamic FOV/zoom, actual slide physics, stamina-free
   cornering — each is a new mechanic, not polish.

**Flag for Ken:** which of (1) and (2) is wanted first, or both in one
slice? No default assumed.

### Micro-Skib chaser — scoped MVP (still design-only)

**Problem:** Counterweight to Schleimy Potion needs spawn rules before code.

**Recommended smallest slice (do not code until Ken confirms):**

- **What:** A chaser at ~65% hitbox size (mirror of potion shrink) that can
  follow the runner through tight gaps.
- **When:** 15% chance to replace one extra-chaser spawn on Levels 3+ only
  (Flooded Annex onward), never the lead chaser.
- **Speed:** `0.85×` base speed of a normal chaser (fast enough to be scary
  in cracks, not a free capture).
- **Face:** Reuse an existing small-pool entry or a placeholder circle
  sprite until Ken supplies art — do not invent a family photo.

**Flag for Ken:** confirm spawn rule (replace extra spawn vs. additive 6th
chaser) and whether Levels 3+ is the right gate.

### Broth Slip — see dedicated handoff

Refined into `roadmap-handoff-v0.4.49-plan.md` with recommended stat
defaults. Still needs Ken's sign-off before Mode B (per SDLC no-guess rule).

### Rod of Poopdom — doc gap closed

Shipped v0.4.47 with implementation defaults (300px range, wall deny,
dedicated `T` key + FIRE when held, 5% spawn). `docs/players-guide.md`
updated this pass with a player-facing section. Open design questions from
the original plan were resolved implicitly by the shipped code — recorded in
`roadmap-handoff-v0.4.47.md`.

## Slice spec: Gameplay Rebalancing remainder (code-ready)

**Partially shipped in v0.4.37:** close-call +50, positive-pickup +5.

**Still open (numbers from `docs/roadmap.md`, verified against current code):**

| Change | Current | Target |
|---|---|---|
| Gun hit sheebs | No payout on hit | +25 sheebs per gun hit |
| Badge earn sheebs | No payout on earn | +50 sheebs per new badge |
| Death sheeb penalty | Flat `DEATH_SHEEBS_PENALTY = 20` all levels | L1: 0, L2: 10, L3: 20, L4+: 30 (negative allowed per existing debt rules) |
| Chaser speed mod start | `chaserSpeedMod` starts at `1.0` | Start at `0.8` (slower early chase) |
| Chaser speed mod cap by level | Global `CHASER_SPEED_MOD_MAX = 1.35` | Cap scales with level index (recommend: `0.9 + levelIndex * 0.09`, clamped to existing min/max) |
| Level-clear rewards | 40/60/90/120/160/200 | 50/75/100/150/200/250 (six live levels) |

**Files likely touched:**

- `frontend/src/GameEngine.js` — death penalty table, gun-hit payout,
  badge-earn payout hook, `chaserSpeedMod` init, per-level speed cap,
  `LEVELS[].reward` bumps.
- `frontend/src/App.jsx` — if badge payout fires via `handleBadgeEarned`,
  wire sheeb delta there instead of/in addition to engine.
- `frontend/e2e/` — extend an existing economy spec or add
  `gameplay-rebalancing.spec.js` (gun hit +25, scaled death penalty at L2
  vs L4).

**Explicitly not in scope:**

- Difficulty Function / Method C selector (separate track).
- New badges, pickups, or levels.
- Re-tuning Shart Knocker (+50/+5 already shipped).

## Explicitly not in scope this pass

- No code, no build, no deploy, no `GAME_ITERATION` bump.
- No marking Ken-blocked items as unblocked.
- No Level 7–10 content (LT arc still parked).

---

## Copy-paste: next coding session (Mode B)

```text
Read docs/skib-sdlc.md, docs/update-directions.md, docs/roadmap.md, then
docs/handoffs/roadmap-handoff-v0.4.48-plan.md.

GAME_ITERATION is v0.4.47. Your slice: Gameplay Rebalancing remainder
(front-end only).

1. Gun hit: when `_tryFire()` / bullet collision stuns a chaser, award
   +25 sheebs (mirror the existing close-call +50 pattern).
2. Badge earn: when a new badge is earned, award +50 sheebs (wire through
   the existing badge-earn callback path in App.jsx / GameEngine).
3. Scaled death sheeb penalty by level: L1=0, L2=10, L3=20, L4+=30 in
   _triggerCaught() — replace the flat DEATH_SHEEBS_PENALTY constant.
4. Chaser speed: initialize chaserSpeedMod to 0.8 at run start; add a
   per-level ceiling on CHASER_SPEED_MOD_MAX (recommend 0.9 + levelIndex * 0.09,
   still clamped to CHASER_SPEED_MOD_MIN/MAX).
5. Level rewards: bump LEVELS[].reward to 50/75/100/150/200/250 for the
   six live levels.

Verification:
- cd frontend && npm run build
- cd frontend && npx playwright test

After landing: update docs/roadmap.md (check off or annotate rebalancing
item), docs/version-log.md, docs/handoffs/ledger.md,
docs/update-directions.md, VersionModal.jsx if bumping. Create
roadmap-handoff-v0.4.48.md. Do not deploy unless Ken asks.

Next queue after this: docs/handoffs/roadmap-handoff-v0.4.50-plan.md
(cosmetic shop sink). Broth Slip (v0.4.49-plan) waits on Ken sign-off.
```

## Copy-paste: next planning session (Mode A)

```text
Mode A only — no code.

Read docs/skib-sdlc.md, frontend/src/version.js, docs/roadmap.md,
docs/handoffs/roadmap-handoff-v0.4.48-plan.md.

If Ken answers open questions:
- Broth Slip stats / spawn rule -> unblocks roadmap-handoff-v0.4.49-plan.md
- Rewards Slice B (a)/(b) -> unblocks v0.4.41-plan Slice B
- Play Recap placement/tone -> unblocks v0.4.41-plan addendum
- Cool Play / Micro-Skib MVP picks -> add bounded -plan.md slices
- LT roadmap "Flag for Ken" items -> update level-progression-and-endgame-plan.md

Otherwise extend this file or the relevant -plan.md; commit docs only.
```
