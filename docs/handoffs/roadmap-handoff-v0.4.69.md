# Handoff: v0.4.69 (Shipped)

**Created by:** Codex (GPT-5) — 2026-07-28
**Last updated by:** Cursor Composer — 2026-07-28 (post-ship Mode A code review)

**Review verdict:** **Ship stands — no critical rollback.** Slices A and B match the
`roadmap-handoff-v0.4.69-plan.md` contract. One **medium** end-of-round UX gap and
several **low** test/coverage gaps warrant a small refinement slice (`v0.4.70` or
hotfix) before the next unrelated backlog item.

## Implemented Features

1. **Profile Isolation (Slice A)**
   - `App.jsx` ignores sheeb/badge/death/level-clear telemetry when `isChaserMode` is true (`handleSheebsChange`, `handleBadgeEarned`, `handlePickupConsumed`, `handleDeath`, `handleLevelChange`, `handleLevelClear`).
   - `GameEngine.setLoadout()` zeros speed/stamina/reward/luck bonuses in Chaser Beta so shop purchases do not buff the AI runner.
   - `handleCaught` skips runner capture sting and owned-item strip in Chaser Beta.
   - `ProfileModal.jsx` uses hunt-flavored chaser copy and Rematch/Menu actions.

2. **AI Runner Gun Logic (Slice B)**
   - In `_getRunnerEvadeVector()`, far branch (`minDist > 250`) seeks nearest `gun` pickup; biases away from `rollingPickups` with `isGood === false`.
   - In `update()`, panic-shot when human chaser is within 400px, runner has gun chambers, and cooldown is ready: faces chaser, calls `_tryFire()`, shows `CHASER_BETA_RUNNER_GUN_TAUNTS` only when a new bullet is created.
   - `GUN_HIT_LINES` reused when the human chaser is stunned by AI gun fire.

3. **Dialog Additions**
   - `CHASER_BETA_OPENER_LINES` via `bannerText` on level sync.
   - `CHASER_BETA_RUNNER_GUN_TAUNTS` on successful AI panic-shot.
   - `CHASER_BETA_WIN_LINES` on chaser tag win.

4. **Testing**
   - `e2e/chaser-beta.spec.js` — Slice A (callback isolation + zero loadout) and Slice B (panic fire + capture line in modal).

## Verification (review session)

- `cd frontend && npm run build` — pass
- `cd frontend && npx playwright test e2e/chaser-beta.spec.js` — 2/2 pass
- Spot-checked against `roadmap-handoff-v0.4.69-plan.md` §§A–C

---

## Code Monkey recap — post-ship review (Mode A, 2026-07-28)

Reviewed shipped code in `App.jsx`, `GameEngine.js`, `dialog.js`,
`ProfileModal.jsx`, and `e2e/chaser-beta.spec.js` against the plan. Annotated
findings below.

### ✅ Matches plan (no action required)

| Area | Finding |
|------|---------|
| Profile callbacks | All six planned handlers gated on `!isChaserMode`. Cookie persistence blocked; in-round engine state still updates (intentional per plan §C). |
| Loadout fairness | `setLoadout()` zeroes all four bonus fields when `isChaserMode`. |
| `handleCaught` | No `playCaughtAudio()` or owned-item strip in Chaser Beta. |
| Gun seek | Far branch only; gun type only; no `POSITIVE_PICKUPS` taxonomy creep. |
| Harm avoid | Rolling pickups with `isGood === false` repelled within 200px in far branch. |
| Panic fire | Turn-and-shoot pattern; taunt gated on bullet count increase (not `_tryFire` return change). |
| Dialog pools | Three 4-line pools in `dialog.js` match plan copy. |
| Opener | Random `CHASER_BETA_OPENER_LINES` set in `_syncLevelState()`. |
| Win line | `CHASER_BETA_WIN_LINES` used on tag capture branch. |
| FLUSH CLOCK | Left untouched per plan (Ken decision still open). |
| Runner mode | No regression to campaign runner/chaser AI outside `isChaserMode` guards. |

### ⚠️ Medium — chaser tag win reuses campaign `_updateCaught` theater

**Where:** `GameEngine.js` chaser tag branch (~1576–1583) sets `phase = 'caught'`
but does **not** set `phaseTimer`, `_caughtChaser`, or a chaser-specific caught
handler. The main loop still routes `phase === 'caught'` → `_updateCaught()`, which:

- Decrements a **stale** `phaseTimer` (unpredictable delay before
  `onCaughtProfileReady`)
- Runs campaign **zoom-in jumpscare** (`zoom` ramps toward 3) even though the
  human **won** the hunt

**Impact:** Tag win can feel like a runner death beat (zoom scare) instead of a
clean hunt victory card. Timeout loss path correctly sets `phaseTimer = 3.0`; tag
win does not.

**Recommendation:** Add a chaser-beta short-circuit — either skip `_updateCaught`
for `isChaserMode` (toast + `ProfileModal` only, with explicit `phaseTimer`), or
a dedicated `_updateChaserBetaCaught()` with no zoom and a fixed ~1.5s hold before
`onCaughtProfileReady`.

### 🟡 Low — transient UI still fires in Chaser Beta

**Where:** `handleBadgeEarned` (~397–434) still shows badge toasts and bumps engine
sheebs even when profile write is skipped.

**Impact:** Cosmetic confusion only (e.g. friendly-fire badge toast if tagging during
stun grace). Profile cookie stays clean.

**Recommendation:** Optional `if (!isChaserMode)` around toast + engine sheeb bump;
or accept as harmless theater until Ken playtests.

### 🟡 Low — E2E coverage gaps vs plan wording

| Gap | Detail |
|-----|--------|
| Slice A | Plan asked for cookie unchanged after a full pickup/gun/**tag** sequence; test only invokes callbacks directly — no real tag flow. |
| Slice B | Collects `isStunned` but never asserts it. Win-line test uses injected `'TEST WIN LINE'` and mocked `_checkCaptures`; does not assert a real `CHASER_BETA_WIN_LINES` entry. |
| Gun seek | No test that far-branch steering moves toward a spawned gun pickup. |
| Slice B modal | Passes because stale `phaseTimer <= 0` immediately triggers `onCaughtProfileReady` — fragile, not representative of a timed victory sequence. |

**Recommendation:** Extend `chaser-beta.spec.js` in a refinement slice; no prod
blocker.

### 🟢 Parked (correctly out of scope)

- FLUSH CLOCK / timeout loss theater — Ken decision pending (plan §Ken decisions #2).
- Full AI item roster beyond gun — Ken decision pending (plan §Ken decisions #1).
- Full reverse `CHASER_LINES` bark pool, Bowl Rush, voice clips.

---

## Ken decisions still open (unchanged from plan)

1. **Future AI item roster** — which items beyond gun should the runner seek/use?
2. **FLUSH CLOCK** — keep, tune, or remove the existing 60s timeout loss?

---

## Copy-paste: refinement slice (Mode B — optional `v0.4.70`)

Use only if Ken's live playtest confirms the tag-win zoom feels wrong, or before
building more Chaser Beta features on this branch.

```text
Mode B, Chaser Beta only. Read docs/skib-sdlc.md and
docs/handoffs/roadmap-handoff-v0.4.69.md (post-ship review § Medium).

Implement only this small refinement:
1. In GameEngine.js, when isChaserMode and the human chaser tags the runner:
   do NOT run campaign _updateCaught jumpscare zoom. Either:
   (a) set phase to a new short 'chaser-win' phase with fixed phaseTimer (~1.5s)
       then call onCaughtProfileReady with { captureLine } only, OR
   (b) skip caught phase entirely: onCaught already fired — go straight to
       caught-profile with isChaserMode ProfileModal (Rematch/Menu).
   Match timeout path consistency (phaseTimer explicit, zoom stays 1).
2. Optionally gate handleBadgeEarned toasts + engine sheeb bump when isChaserMode.
3. Strengthen e2e/chaser-beta.spec.js:
   - Assert human chaser stunned after AI bullet hit (multi-frame if needed).
   - Assert captureLine matches one of CHASER_BETA_WIN_LINES on real tag (not mock).
   - Optional: spawn gun pickup, assert runner moves toward it in far branch.
4. Run: cd frontend && npm run build && npx playwright test e2e/chaser-beta.spec.js
5. Bump GAME_ITERATION, update version-log + ledger + this handoff. Deploy only if Ken asks.

Do not alter FLUSH CLOCK behavior, gun AI tuning constants, Runner mode, or
pull in Bowl Rush / full bark pools.
```

## Copy-paste: next backlog item (if refinement deferred)

```text
Mode B. Read docs/skib-sdlc.md, docs/update-directions.md, docs/roadmap.md.

v0.4.69 Chaser Beta shipped and reviewed — see roadmap-handoff-v0.4.69.md.
Refinement slice above is optional; no critical blockers.

Pick the oldest unfinished, Ken-unblocked item from docs/roadmap.md
(v0.4.67-plan badge award counts, or next open handoff in docs/handoffs/).
```

## Next Steps

- Ken: playtest Chaser Beta tag win — confirm whether zoom/jumpscare on win feels wrong.
- If yes → run refinement copy-paste above as v0.4.70.
- If no → proceed to next roadmap item; optional test hardening can ride along any future Chaser touch.
