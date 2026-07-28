# Roadmap Handoff Plan v0.4.73 — Level Warp Passes / Direct Select Unlocks

**Created by:** Codex GPT-5 — 2026-07-28
**Created on:** 2026-07-28
**Last updated by:** Codex GPT-5 — 2026-07-28
**Session mode:** Mode A (Planning / refinement only — docs only, no code,
no build, `GAME_ITERATION` not bumped)
**Mode impact:** `Runner only`

## Why this doc exists

Ken asked whether higher levels should be buyable, whether the unlock
should live in the shop, and whether repeated clears should gate the
offer. The short answer is yes, but not as a plain stat upgrade and not
as a consumable skip:

- Keep the feature as a **progression unlock**.
- Put the unlock offer in the shop, but keep the unlock state separate
  from normal shop items.
- Gate each new warp level behind repeat clears of the target level.

## Recommended shape

1. **Add per-level clear counts.**
   - Track how many times each level has been cleared on the active
     profile.
   - Use a dedicated profile field such as `levelClearCounts`.
   - This is the missing prerequisite for any repeat-clear gating.
   - A warped run still counts only the levels the player actually
     clears; skipped levels stay untouched and do not get backfilled.
2. **Add a permanent start-level cap.**
   - Use a separate profile field such as `highestUnlockedStartLevel`.
   - This should represent the highest level the player is allowed to
     start from on a new runner run.
   - Do not store warp unlocks in `ownedItems`; that bucket already means
     stat/perk purchases and is tied to item-loss behavior above Level 4.
3. **Unlock one jump at a time.**
   - Recommended rule: after the player clears a target level 3 times,
     the shop offers the next warp unlock for `1500 sheebs`.
   - Example: clear Level 3 three times, buy "Start at Level 4"; clear
     Level 4 three times, buy "Start at Level 5."
   - This keeps the feature fun for advanced players without letting a
     fresh profile skip the entire campaign in one jump.
4. **Keep the main play button honest.**
   - `PLAY AS RUNNER` should still default to Level 1.
   - A compact start-level picker can appear only for unlocked warp
     levels.
   - Skipped levels should not refund rewards or auto-grant earlier
     progression badges.
   - Keep the shop unlock and the picker visually separate: the shop
     sells the warp pass, the main menu only lets the player choose from
     already-unlocked start levels.

## Current state

- The game still starts runner runs from Level 1 today.
- The shop only sells stat/perk items.
- `profile.highestLevel` already tracks the highest naturally reached
  level, but there is no separate clear-count counter and no separate
  start-level unlock cap.
- `docs/roadmap.md` already had a generic `Level unlock gating / direct
  select` backlog note; this plan refines that into a shop-gated warp
  pass instead of a free selector.

## Why this is better than a raw level-select button

- It preserves the early-game curve for new players.
- It gives advanced players a way to buy into the harder maps they
  actually want.
- It keeps the existing shop/economy language intact.
- It avoids colliding with `ownedItems`, so item-loss and loadout logic
  stay untouched.

## Related features to fold in

- A future menu tooltip can explain why a warp is locked: not enough
  clears yet.
- The new clear-count field is a natural seed for a later replayability
  stat or brag surface.
- If we later want a full level-select screen, the same cap field can
  power it without redesigning the unlock model.

## Risks / behavior conflicts

- `highestLevel` should remain the record of what the player has actually
  reached, even if they start later on a warp run.
- The shop purchase must not behave like a normal `ownedItems` item, or
  capture item-loss could accidentally remove progression unlocks.
- Starting on a later level may trigger late-game debt, warnings, and
  item-loss sooner than a fresh player expects. That is acceptable for
  this feature, but it should be called out in the UI copy.
- A later challenge-mode stat split may be useful if we ever want to
  distinguish natural runs from warp-start runs in the menu brag area.
- If the picker and purchase UI start to sprawl, land the persisted
  fields + unlock purchase first and push the picker into a follow-up
  handoff instead of cramming both surfaces into one session.

## Files likely touched

- `frontend/src/lib/cookies.js` — persist `levelClearCounts` and
  `highestUnlockedStartLevel`.
- `frontend/src/App.jsx` — add the shop purchase path and the main-menu
  start-level picker.
- `frontend/src/GameEngine.js` — accept a starting level index and start
  the run there.
- `frontend/src/components/ShopModal.jsx` — surface the warp-pass offer
  cleanly, separate from normal perk cards.
- `frontend/src/gameContent.js` — keep any warp-pass definitions or
  labels together if a shared content list is useful.
- `docs/profiles-and-identity.md` — document the new profile fields.
- `docs/roadmap.md` / `docs/update-directions.md` / `docs/version-log.md`
  / `docs/handoffs/ledger.md` — keep the backlog and history in sync.
- `frontend/e2e/` — add coverage for the unlock gate and the new start
  selection.

## Explicitly not done

- No code changes yet.
- No `GAME_ITERATION` bump.
- No deploy.
- No replacement of the existing stat shop.
- No change to item-loss rules for `ownedItems`.
- No full level-select screen beyond the warp-pass cap.

## Copy-paste: next coding session

```text
Read docs/skib-sdlc.md, then docs/update-directions.md, then
docs/handoffs/roadmap-handoff-v0.4.73-plan.md, then docs/roadmap.md,
docs/profiles-and-identity.md, and docs/version-log.md.

Implement the level-warp progression unlock as a separate system:

1. Add profile tracking for per-level clear counts.
2. Add a separate permanent start-level cap field for warp unlocks.
3. Gate each new warp unlock behind repeated clears of the target level
   and a 1500 sheebs purchase.
4. Keep warp unlocks out of `ownedItems` so item-loss and loadout logic
   do not touch them.
5. Add a compact start-level picker for `PLAY AS RUNNER`, defaulting to
   Level 1 unless the player chooses a higher unlocked start.
6. Verify with `cd frontend && npm run build` and `npx playwright test`.

Do not bump GAME_ITERATION or deploy.
Do not make warp passes behave like normal stat items.
Do not remove the existing sequential campaign flow.
```
