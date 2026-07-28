# Roadmap Handoff Plan v0.4.62 — Frontend iteration bundle (Rewards finish + polish)

**Created by:** Cursor Composer — 2026-07-28
**Last updated by:** Cursor Composer — 2026-07-28
**Session mode:** Mode A (Planning / refine — docs only, no code)
**Status:** Code-ready queue sequenced. No `GAME_ITERATION` bump until Mode B
ships slices.
**Bundles:** Finishes the `v0.4.41` Rewards lineage, then two small polish
slices. Role Reversal recovery stays in `v0.4.61-plan` (parallel track).

## Trigger

Ken asked for a Mode A pass (no code): review open roadmap items, evaluate
the next natural frontend iteration steps, and produce a consolidated handoff
plus refreshed agent briefs.

## Current production state (verified)

- `GAME_ITERATION`: **v0.4.60** (`frontend/src/version.js`) — Difficulty
  Selector (Noob-Noob / Casual / 4chan-st) + cookie persistence.
- Recently shipped (not yet reflected everywhere in `docs/roadmap.md`):
  - **v0.4.59** — Neon Jump-Scare Upgrade (headstart stun theater)
  - **v0.4.58** — Desktop fog-of-war wider shell (Option A)
  - **v0.4.57** — Rod of Poopdom `stinkyTimer` hotfix
  - **v0.4.56** — *(plan only, not shipped)* runner pose collapse
  - **v0.4.55** — *(plan only, not shipped)* Micro-Skib
  - **v0.4.54** — Near-miss particle burst + vignette pulse (Cool Play MVP)
  - **v0.4.52** — Turdstone Token
  - **v0.4.49** — Broth Slip (`raman-aunt` chaserType)
- **Broken in prod:** Play as Chaser / Role Reversal (`v0.4.53`) — recovery
  scoped in `roadmap-handoff-v0.4.61-plan.md`, not part of this bundle.

## Verdict — recommended frontend iteration arc

**Theme: player transparency, then light counterpressure, then asset cleanup.**

The oldest *unblocked* work that still shares a design thread is the
**`v0.4.41` Rewards lineage** (Slice A shipped `v0.4.41`; Slice B and Play
Recap remain open and code-ready per Ken's 2026-07-27 answers). Shipping
those two slices gives players a coherent "how did I get this / what did I
pick up" story before adding more chase pressure or content.

After that, two independent, Ken-confirmed small slices fit naturally:
**runner pose pool collapse** (`v0.4.56`) and **Micro-Skib** (`v0.4.55`).

Do **not** fold Role Reversal hotfix into this bundle — it is quality debt
with its own mode-isolation contract and Ken-blocked outcome UX
(`60s FLUSH CLOCK` / Rematch). See `v0.4.61-plan`.

## Open backlog triage (frontend, 2026-07-28)

| Tier | Item | Status | Handoff / doc | Mode impact |
|---|---|---|---|---|
| **1 — code next (this bundle)** | Rewards HUD shop labels (Slice B) | Code-ready | `v0.4.41-plan.md` | Runner only |
| **1 — code next (this bundle)** | Pickup tracking + Play Recap | Code-ready | `v0.4.41-plan.md` addendum | Runner only |
| **2 — code next (after bundle)** | Runner pose collapse (3 unique) | Code-ready | `v0.4.56-plan.md` | Runner only |
| **2 — code next (after bundle)** | Micro-Skib chaser | Code-ready | `v0.4.55-plan.md` | Runner only |
| **3 — parallel quality debt** | Role Reversal v1.5 hotfix | Partially blocked on Ken (timer/rematch); menu Beta treatment unblocked | `v0.4.61-plan.md` | Chaser Beta only |
| **4 — design / TBD** | Difficulty Debt Lock (Method C math) | Selector shipped v0.4.60; math still design-only | `difficulty-mechanics-plan.md` | Runner only (today) |
| **4 — design / TBD** | Interactive content pack | Ongoing seasoning | `interactive-content-pack.md` | Runner only (today) |
| **4 — design / TBD** | Level 7+ Mosaic Map | Dimension-shift trigger unanswered | `level-progression-and-endgame-plan.md` | Runner only |
| **5 — blocked on Ken** | Audio 2 phase 1 (`CAPTURE_LINES` clips) | Recordings | `dialog_content_chasing.md` | Both — shared |
| **5 — blocked on Ken** | Yoodeling Unc-2 pose | Asset drop | `characters.md` | Runner only |
| **6 — large / later** | Intro cinematic | Script in PDF | `future-versions.md` | Runner only |
| **6 — large / later** | Multiplayer / MOBA LT | Phase 5 scaffold | `v0.4.43-plan.md` | Both — shared |
| **6 — unscopoped** | Debug State Dump | Roadmap line only, no handoff yet | `roadmap.md` | TBD |

### Shipped since last roadmap snapshot (checkbox corrections this pass)

| Item | Shipped |
|---|---|
| Cool Play near-miss burst | v0.4.54 |
| Broth Slip | v0.4.49 |
| Rod of Poopdom second-teleport hotfix | v0.4.57 |
| Desktop Screen Support (Option A fog-of-war) | v0.4.58 |
| Turdstone Token | v0.4.52 |
| Neon Jump-Scare Upgrade | v0.4.59 |
| Difficulty Selector (minimal) | v0.4.60 |
| Rewards & History Slice A | v0.4.41 (was already checked) |

## Recommended Mode B sequence (four slices)

### Slice 1 — `v0.4.62.1` Rewards HUD shop labels (from `v0.4.41` Slice B)

**Why first:** ~15-minute UX honesty fix; zero engine risk; clarifies that
Speed/Stamina/Rewards pills are shop bonuses only before Play Recap adds
more history UI.

**Scope:** `App.jsx` perk-strip caption or `title` tooltips per Ken's option
(a). No difficulty modifiers.

**Mode impact:** Runner only.

### Slice 2 — `v0.4.62.2` Pickup tracking + Play Recap (from `v0.4.41` addendum)

**Why second:** Completes Ken's "cool area" ask; depends on Slice A's
`rewardsHistory` scaffold (already shipped v0.4.41).

**Scope (Ken-confirmed 2026-07-27):**

- `onPickupConsumed` callback in `GameEngine.js` → `rewardsHistory` entries
  with `type: 'pickup'`, `outcome: 'good'|'bad'`.
- Per-run **Play Recap** on level-clear / menu return only — **not** on death
  (post-kill profile card keeps the capture beat).
- Extend `RewardsHistoryModal.jsx` with a **Stats** tab for lifetime
  aggregates (fast-follow OK if recap ships first).
- Comedic tone for bad pickups ("Bombed 3× — skill issue").

**Mode impact:** Runner only.

**Files:** `GameEngine.js`, `App.jsx`, `RewardsHistoryModal.jsx` (or new
`PlayRecapModal.jsx`), `interactive-content-pack.md` (label consistency),
e2e extension.

### Slice 3 — `v0.4.62.3` Runner pose pool collapse (`v0.4.56`)

**Why third:** Small data cleanup; reduces duplicate-photo confusion; no
gameplay balance risk.

**Scope:** Collapse `RUNNER_FACE_POOL` to 3 unique ids; adjust capture
face-swap if getting-captured/captured merge; update `characters.md`.

**Mode impact:** Runner only (Chaser Beta uses chaser pool separately).

### Slice 4 — `v0.4.62.4` Micro-Skib (`v0.4.55`)

**Why fourth:** Adds chase counterpressure after transparency/polish lands;
15% replace extra spawn, L3+, 65% hitbox, 0.85× speed, placeholder sprite
(no family photo).

**Mode impact:** Runner only.

## Explicitly NOT in this bundle

- Role Reversal movement/outcome/recovery (`v0.4.61-plan`).
- Difficulty Debt Lock math (design-only).
- New levels, Mosaic map, intro cinematic, multiplayer.
- Audio 2 recordings, Yoodeling Unc-2 asset.
- `GAME_ITERATION` bump until a slice actually ships.

## Flag for Ken

1. **Role Reversal** (unchanged from `v0.4.61-plan`): confirm or change the
   proposed 60-second capture/timeout + Rematch/Menu result shape before
   Mode B ships outcome UX. Menu rename + Beta color are decided.
2. **Play Recap fast-follow:** OK to ship per-run recap in Slice 2 and defer
   the Stats tab to a tiny follow-up if session time is tight? (Recommended
   yes — recap is the higher-impact half.)
3. **Debug State Dump:** now has a dedicated plan — it turns out to
   belong with the App tracking / instrumentation work (analytics +
   error monitoring), not as a standalone item. It's the manual,
   unblocked, no-SDK support path (clipboard dump, no network call),
   complementary to the Sentry-tagged "Report a Bug" button scoped
   there. See
   [`roadmap-handoff-v0.4.64-plan.md`](roadmap-handoff-v0.4.64-plan.md)
   (renumbered from `v0.4.62` after this file claimed that number
   concurrently — see that file's note on file history). Recommend
   shipping Debug State Dump first since it has no open blockers, then
   folding its output into the Sentry event payload once Ken picks the
   SDK tier.

## Relationship to other handoffs

- **Extends, does not replace** `roadmap-handoff-v0.4.41-plan.md` — Slice B
  and Play Recap copy-paste blocks there remain authoritative for slice
  detail; this file sequences them into the current iteration.
- **Does not supersede** `roadmap-handoff-v0.4.61-plan.md` — Role Reversal
  is parallel quality debt.
- **Supersedes stale queue text** in `docs/roadmap.md` snapshot and both
  agent briefs (updated this session).

---

## Copy-paste: next planning agent (Mode A)

```text
Mode A — no code.

1. Read docs/skib-sdlc.md, docs/update-directions.md, docs/roadmap.md,
   and docs/handoffs/roadmap-handoff-v0.4.62-plan.md.
2. Check frontend/src/version.js for live GAME_ITERATION before trusting
   any doc snapshot.
3. If Ken answered Role Reversal timer/rematch flags, record in
   docs/role-reversal-design.md + v0.4.61-plan only — do not invent.
4. If a slice from the v0.4.62 bundle shipped, check off roadmap items,
   append version-log/ledger, write shipped -handoff-v0.4.62.md (or
   per-slice memorial), refresh agent briefs.
5. If Ken wants Debug State Dump scoped, open v0.4.63-plan — do not code
   inline in planning.
```

## Copy-paste: next coding session — Slice 1 (shop labels)

```text
Mode B — v0.4.62 Slice 1: Rewards HUD shop labels.

Read docs/handoffs/roadmap-handoff-v0.4.62-plan.md and
docs/handoffs/roadmap-handoff-v0.4.41-plan.md (Slice B section).

1. App.jsx perk-strip: add caption or title/tooltip that Speed/Stamina/Rewards
   numbers are Shleeb Shop purchases only. No difficulty modifiers.
2. Optional: tiny e2e assert caption present.
3. Verify: cd frontend && npm run build && npx playwright test
4. Update version-log, ledger, update-directions, roadmap checkboxes,
   VersionModal if bumping GAME_ITERATION. Memorialize shipped handoff.
```

## Copy-paste: next coding session — Slice 2 (Play Recap)

```text
Mode B — v0.4.62 Slice 2: Pickup tracking + Play Recap.

Read docs/handoffs/roadmap-handoff-v0.4.41-plan.md addendum (Ken 2026-07-27).

Ken confirmed: recap on level-clear/menu return only (NOT death); Stats tab
inside RewardsHistoryModal; comedic bad-pickup copy.

1. GameEngine.js: onPickupConsumed callback from rolling + named pickup branches.
2. App.jsx: push type:'pickup' rewardsHistory entries; per-run accumulator.
3. Play recap on handleLevelClear — grouped pickup counts, deltas, badges this run.
4. Extend RewardsHistoryModal with Stats tab (fast-follow OK after recap).
5. Labels consistent with docs/interactive-content-pack.md.
6. Verify: cd frontend && npm run build && npx playwright test
7. Update docs + GAME_ITERATION on ship.
```

## Copy-paste: next coding session — Slices 3–4 (polish + Micro-Skib)

```text
Mode B — pick ONE slice per session (single-increment rule).

Slice 3 — Runner poses: read roadmap-handoff-v0.4.56-plan.md
Slice 4 — Micro-Skib: read roadmap-handoff-v0.4.55-plan.md

Verify each: cd frontend && npm run build && npx playwright test
```

## Copy-paste: Role Reversal (parallel — NOT this bundle)

```text
Do NOT start unless Ken confirmed timer/rematch in v0.4.61-plan Flag for Ken.

Use the Mode B block in docs/handoffs/roadmap-handoff-v0.4.61-plan.md.
Menu rename + Beta treatment can ship without timer answer; outcome UX cannot.
```
