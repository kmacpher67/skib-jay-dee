# Roadmap Handoff Plan v0.4.60 — Difficulty Selector (Noob-Noob / Casual / 4chan-st)

**Created by:** Claude Sonnet 5 — 2026-07-28
**Last updated by:** Claude Sonnet 5 — 2026-07-28
**Session mode:** Mode A (Planning / SDLC review — docs only, no code)
**Status:** UNBLOCKED for the minimal slice below — the *full* Method C debt-lock
and dialog-hook wiring stays blocked on the same open TBDs it always has.

## Trigger

Ken asked (SDLC review, no code): "where is the user difficulty setting for
play mode easy, normal, 4chan? did we deliver that in a handoff? is it still
in the roadmap backlog?"

## Findings (read-only investigation this session)

- **Not shipped.** Searched `frontend/src` for `difficulty` and `4chan`.
  The only hit is a code comment at `GameEngine.js:301` referencing a
  *Level 4+ minimum-time/chaser-count floor* — an unrelated per-level
  mechanic, not a player-facing Easy/Normal/4chan-st selector. There is no
  difficulty field in the cookie profile (`frontend/src/lib/cookies.js`),
  no menu toggle, no `difficulty` state anywhere in `App.jsx` or
  `GameEngine.js`.
- **Design-only, still in the backlog.** The concept is fully specced in
  [docs/difficulty-mechanics-plan.md](../difficulty-mechanics-plan.md)
  (Method C "Debt Lock" + a lightweight starting selector: **Noob-Noob /
  Casual / 4chan-st (CEO of Drains)**), and tracked as an open backlog line
  in [docs/roadmap.md](../roadmap.md) (`Difficulty Function` row, and the
  explicit backlog bullet: *"Preferred direction is Method C... still
  design-only, several TBDs, not ready to code"*).
- **A second handoff is already waiting on this exact gap.**
  [roadmap-handoff-v0.4.58-plan.md](roadmap-handoff-v0.4.58-plan.md) (Desktop
  FOV) records Ken's decision to tie desktop field-of-view to a difficulty
  tier (Easy = full screen, Normal = in-between, 4chan-st = fog-of-war), and
  its first open question is literally *"Is there an existing
  difficulty-select surface in the app already, or does this handoff need to
  scope a new difficulty picker as a prerequisite?"* — answered here: **no,
  it needs to be built.** This handoff (v0.4.60) is the prerequisite slice
  for v0.4.58 to become unblocked.

## Scope for this handoff (kept single-session-sized per `skib-sdlc.md`)

This is deliberately **narrower** than the full difficulty-mechanics-plan.md
design. It only covers the first two "Next Steps for Code Monkey" bullets
from that doc — the cookie field and the menu UI — so both v0.4.58 (FOV) and
future Method C economy work have something concrete to hang off of.

**In scope (Mode B, next coding session):**
1. Add a `difficulty` field to the cookie-backed profile
   (`frontend/src/lib/cookies.js`), default `'casual'`. Values:
   `'noob'` | `'casual'` | `'4chan-st'`.
2. Add a Difficulty Selector control to the main menu (wherever the
   Quick Play / profile menu currently lives in `App.jsx`) with
   player-facing labels — reuse Ken's naming as-is (Noob-Noob / Casual /
   4chan-st) unless Ken says otherwise; no new art required, text/button UI
   is enough.
3. Persist the selection through the existing cookie-profile save path (same
   pattern as other profile fields — no new storage mechanism).
4. Expose `profile.difficulty` to `GameEngine.js` at run start (read-only for
   now) so later slices (Method C economy, v0.4.58 FOV-per-tier) have a
   single source of truth to read from instead of re-inventing one.

**Explicitly NOT in this pass (stays blocked/design-only):**
- The Debt Lock dynamic inference ("Repo Mode" on negative Sheebs).
- Mid-run toggle rules (Noob/Casual freely switchable, 4chan-st locks in
  and forfeits bonuses on downgrade).
- `_triggerCaught()` dialog pool overrides (`SHYT_TALKER_LINES`) and the
  Level-3-gated "Almost Gotcha" lines.
- Any FOV/camera behavior change (that's v0.4.58, which depends on this
  landing first, not the other way around).
- The rolling deaths/sheebs auto-tuning refinement (still has open TBDs
  per `difficulty-mechanics-plan.md`'s "Auto-tuning refinement" section).
- Scoring multipliers or badge eligibility tied to difficulty.

Once this lands, v0.4.58's other open questions (concrete Normal-tier FOV
value, player-facing tier naming confirmation, whether FOV hangs off this
same enum) can be answered in a short v0.4.58-plan follow-up rather than a
fresh discovery pass.

## Explicitly not in this pass (this Mode A session)

- No code, no `GAME_ITERATION` bump, no deploy.
- No implementation of Method C's economy/debt math.
- No decision made on Ken's behalf about default difficulty or exact copy —
  the slice above uses Ken's own naming verbatim to avoid inventing UI text.

---

## Copy-paste: next coding session (Mode B)

```text
Mode B unblocked: implement the Difficulty Selector prerequisite (v0.4.60).

1. Read docs/handoffs/roadmap-handoff-v0.4.60-plan.md and
   docs/difficulty-mechanics-plan.md (design context — only build the
   "Scope for this handoff" section below, not the full doc).
2. Add `difficulty` field to the cookie profile in
   frontend/src/lib/cookies.js — default 'casual', values
   'noob' | 'casual' | '4chan-st'.
3. Add a Difficulty Selector UI to the main menu in App.jsx (reuse Ken's
   labels: Noob-Noob / Casual / 4chan-st). Persist via the existing
   cookie-profile save path.
4. Pass profile.difficulty into GameEngine.js at run start (read-only —
   no behavior change yet, just wiring so later slices have one source
   of truth).
5. Verify: npm run build, manual check that the selector persists across
   reload (cookie round-trip), and existing e2e suite still passes.
6. Update docs/version-log.md, docs/update-directions.md, docs/roadmap.md,
   docs/handoffs/ledger.md, frontend/src/components/VersionModal.jsx.
7. Bump GAME_ITERATION to v0.4.60, commit, deploy per skib-sdlc.md.
8. Do NOT implement Method C debt-lock math, dialog-pool overrides, or any
   FOV/camera change in this same session — those are separate handoffs
   (see "Explicitly NOT in this pass").
```
