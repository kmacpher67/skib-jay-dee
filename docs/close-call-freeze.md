# Feature: Close-Call Freeze and Reward Payouts

This doc captures the next small gameplay-tuning slice after the
existing near-capture interlude. The game already has a separate
`near-capture` beat (the funny pause card) and a separate
`resume-countdown` beat after actual capture. This pass is only about
the close-call flow that happens before a kill.

## What this is not

- Not the jump-scare capture beat.
- Not the post-capture `resume-countdown` phase.
- Not a new backend system or a new map architecture change.

## Current feel to preserve

The existing near-capture interlude is already useful because it gives
the player a warning beat when a chaser gets too close. The next pass
should keep that warning intact and add a short recovery window so a
mobile player can move their fingers back into place before the chase
starts moving again.

## Proposed flow

1. The runner enters the existing near-capture / pre-kill skreem state.
2. The current close-call visual beat plays as it does today.
3. After that beat resolves, the world freezes for 1 second.
4. Once the freeze ends, the chase resumes normally.

During the freeze:

- Runner movement stays locked.
- Chaser AI stays locked.
- Stamina, skreem gain, and timers should not advance unless the engine
  already treats the freeze as non-simulated time.

## Reward hooks

- A clean close-call escape pays **+50 sheebs**.
- Picking up a positive reward item pays **+5 sheebs**.
- Positive reward items should be data-driven, but the current expected
  list is:
  - Jayden Gun
  - Schleimy Potion
  - Taco Bell Grande
  - future positive items added to the same pool

If the close-call escape is also what triggers the `Slippery When Wet`
badge, keep the badge and the sheeb payout attached to the same event so
they cannot drift apart.

## Implementation notes for the next coding pass

- Keep this separate from the capture `resume-countdown` phase.
- Prefer a tiny new timer/phase if that is the cleanest way to hold the
  world still for exactly 1 second.
- If reward data needs a new flag in `gameContent.js`, keep it minimal
  and readable so future positive pickups can reuse the same path.

## Verification targets

- Force a close-call in Playwright and confirm the chase pauses for
  roughly 1 second before resuming.
- Confirm a close-call escape increments sheebs by 50.
- Confirm each positive pickup grants +5 sheebs and that non-positive
  pickups do not.
- Run `cd frontend && npm run build` and the full Playwright suite.
