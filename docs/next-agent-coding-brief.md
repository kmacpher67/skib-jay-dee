# Next Agent Coding Brief — Skib-Jay-Dee-Toilet

**Created by:** Codex (GPT-5) — 2026-07-27
**Last updated by:** Claude Sonnet 5 — 2026-07-27

This brief is the quick-start version of the current open handoff. It
previously pointed at Enhanced Death Logs / Parody Warning
(`roadmap-handoff-v0.4.39-plan.md`) — that shipped as **v0.4.39**
(plus a follow-on spawn-point fix as **v0.4.39.1**), and the Shart Knocker
slice after it (`roadmap-handoff-v0.4.40-plan.md`) also shipped, as
**v0.4.40**. `frontend/src/version.js` confirms `v0.4.40` is current. This
brief is rewritten to point at the next unclaimed, unblocked slice instead.

If you are about to code, start with
`docs/handoffs/roadmap-handoff-v0.4.41-plan.md` and use this as the
condensed checklist.

The next best slice is front-end only: **Slice A — Rewards & History
panel**. Add a capped `rewardsHistory` log to the cookie-backed profile
(badge-earn and shop-purchase events, timestamped) and make the menu's
`Rewards` pill open a new history modal, mirroring how the `Deaths` pill
already opens `DeathsModal.jsx`. **Do not** also pick up Slice B (making
the Speed/Stamina/Rewards *numbers* reflect difficulty/history, not just
shop bonus) in the same session — it's blocked on a decision from Ken (see
the "Open question flagged for Ken" section in the plan doc).

Read first:

1. `docs/skib-sdlc.md`
2. `docs/update-directions.md`
3. `docs/roadmap.md`
4. `docs/handoffs/roadmap-handoff-v0.4.41-plan.md`
5. `docs/profiles-and-identity.md` (profile shape + field-ownership table
   you'll be adding a row to)
6. `docs/badges.md` (badge-history cross-reference section)
7. `frontend/src/lib/cookies.js` (`deathsHistory` shape — the pattern to
   copy for `rewardsHistory`)
8. `frontend/src/components/DeathsModal.jsx` (the modal pattern to copy)

## Session focus

1. **`rewardsHistory` field:** add to `normalizeProfile()` in
   `frontend/src/lib/cookies.js` — capped last-50 array, same filter/map
   pattern as `deathsHistory`. Entry shape:
   `{ timestamp, type: 'badge'|'purchase', label, amount, level, levelName }`
   (`amount` is the sheeb delta for purchases, `null` for badges).
2. **Wire the writes:** `handleBadgeEarned` and `handlePurchase` in
   `frontend/src/App.jsx` each push one new `rewardsHistory` entry
   alongside their existing writes to `earnedBadges`/`ownedItems`. Don't
   change what those two fields already store.
3. **Make the `Rewards` pill clickable:** it's currently a bare `<span>`
   in the `perk-strip` (`App.jsx` ~line 666) — turn it into a `<button>`
   like the existing `deaths-pill`, wired to a new
   `onOpenRewardsHistory`/modal-open state.
4. **Build `RewardsHistoryModal.jsx`:** mirror `DeathsModal.jsx`'s
   header/close-pill/list-card structure. Show the most recent 15-20
   entries, reverse-chronological, with an empty state for new profiles.

## Constraints

- Front-end only.
- Keep the 9:16 portrait layout.
- Do not break cookie-backed profile persistence — profiles saved before
  this change won't have `rewardsHistory`; `normalizeProfile()` must
  default it to `[]`, not crash.
- No retroactive backfill — don't invent fake timestamps for
  already-owned items/badges. The log starts recording from when this
  ships.
- Don't touch `earnedBadges`/`ownedItems` gating logic or shape.
- Don't start Slice B (HUD pill number logic) — it needs Ken's answer
  first, see the plan doc.
- Do not bump `GAME_ITERATION` or deploy unless the user explicitly asks.

## Verification

- `cd frontend && npm run build`
- `cd frontend && npx playwright test`
- Add `frontend/e2e/rewards-history.spec.js` covering: a purchase produces
  a history entry, a badge earn produces a history entry, the modal opens/
  closes, and an empty-profile state renders the empty message.

## Deliverables

- Update `docs/roadmap.md` (check off "Rewards & History panel" once
  Slice A lands; leave the HUD-pills item open for Slice B).
- Update `docs/profiles-and-identity.md` — add `rewardsHistory` to the
  profile-shape block and a row to the field-ownership table.
- Update `docs/version-log.md`, `docs/handoffs/ledger.md`, and
  `docs/update-directions.md` to match the actual implementation.
- Generate `docs/handoffs/roadmap-handoff-vX.Y.Z.md` for whatever version
  this lands as, per `docs/skib-sdlc.md`.
