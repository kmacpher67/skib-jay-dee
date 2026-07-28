# Interactive Content Pack

This doc collects the next content-only pass after the gun, badges, quest rooms, and difficulty spikes. The goal is to make the game feel more alive without needing a new engine architecture: more funny pickups, more secret awards, and clearer room identity.

**Mode impact:** `Runner only` by default. Play as Chaser Beta disables
campaign pickups in its recovery slice. Any later item enabled in both
modes must name the collecting actor, target actor, input/AI trigger, and
profile/economy effect; see
[role-reversal-design.md](role-reversal-design.md#12-documentation-contract-for-two-modes).

## Map Verdict

The current maps are mechanically solid. The part that still needs work is personality and readability:

- Each level should have one anchor room.
- Each level should have one risky shortcut or chokepoint.
- Each level should have one gag room.
- Each level should have one reward room.

If a level is only a chain of similar corridors, the chase still works, but the map stops feeling memorable.

## Content Targets

The next pass should stay data-driven:

- Put item definitions in `frontend/src/gameContent.js`.
- Put any matching one-liners in `frontend/src/dialog.js`.
- Keep new content funny, but always readable at a glance.
- Give runners and chasers both helpful and harmful surprises.

## Suggested First Pass

If the next coding session wants the highest fun-to-scope ratio, start
here:

1. Dialog and badge seasoning.
2. Map personality / room callouts.
3. Small menu brag surface.

Keep the balance-number tuning as a separate follow-up so the content
pass stays crisp.

## Item Seeds

**Status note (2026-07-27):** Taco Bell Grande and Fake Jayden Decoy
shipped in `v0.4.36`. Soggy Toilet Paper and Heavy Plunger shipped in
`v0.4.36.1` (finished a half-wired attempt found uncommitted earlier the
same day — see `docs/handoffs/roadmap-handoff-v0.4.36.1.md`).
The next Taco Bell follow-up being parked for the roadmap is
`Shart Knocker`: keep the base Taco Bell pickup as-is, then let the
Level 4+ version burn one Taco Bell charge for a giant fart stun and a
flaming-ass badge icon.

| Name | Side | Effect | Tone |
|---|---|---|---|
| Decoy Flush | Runner good | Drops a loud noise that pulls nearby chasers toward the wrong lane for a few seconds. | Panic button, but funny. |
| Shart Knocker | Runner good | Level 4+ active ability. Consumes one Taco Bell Grande charge to blast a giant fart that stuns the nearest chaser for 3-12 seconds. A hit pays +50 sheebs; a miss pays +5 sheebs. | Maximum disrespect, still tactical. |
| Emergency Plunger | Runner good | A short shove/knockback that can save a bad corner. | Close-range rescue tool. |
| Turbo TP | Runner good | Short speed burst with a stamina tradeoff. | Risk/reward sprint item. |
| Wet Floor | Runner bad | The runner slips for a beat and loses clean control. | Slapstick punishment. |
| Backwash | Runner bad | Temporarily pauses stamina regen and makes the chase feel grosser. | Gross tax. |
| Wall Sniff | Chaser good | Briefly helps a chaser sense the runner through walls. | Hunt pressure item. |
| Door Jam | Chaser good | Temporarily closes off one exit in a quest room. | Chaser control item. |
| Soap Spill | Chaser bad | Slows a chaser and makes cornering sloppy. | Bouncy humiliation. |
| Broken Lid | Chaser bad | Brief stagger if the chaser slams into geometry too hard. | Comedic fail state. |

## Award Seeds

These are badge-style rewards, not moment-to-moment pickups. They are meant to reward map literacy and weird survival stories.

| Name | Trigger | Why it exists |
|---|---|---|
| Bathroom Tourist | Visit every landmark room in a level. | Rewards exploration instead of pure timer survival. |
| Dead-End Daredevil | Survive a one-door quest room and keep going. | Makes risky map reads feel heroic. |
| Gremlin in the Pipes | Clear a level after touching a bad item. | Turns bad luck into a joke instead of just a penalty. |
| Chaser Tax Audit | Beat a chaser-specific hazard or trap. | Gives chasers their own funny failure state. |

## Pickup-consumption tracking (planned, not yet built)

Ken asked (2026-07-27) for every pickup on this page — plus the v0.4.35
"mushroom"/"bomb" rolling pickups (`isGood`/`effect` in
`frontend/src/GameEngine.js`, not itemized in the table above since they
predate this doc's item seeds) — to be logged when consumed, feeding a
per-run "Play Recap" and a lifetime history view. The `label`/`outcome`
strings that recap should use should stay consistent with the names in
this doc's tables rather than inventing new ones. Full design writeup is
the "Addendum" section of
[docs/handoffs/roadmap-handoff-v0.4.41-plan.md](handoffs/roadmap-handoff-v0.4.41-plan.md) —
design-only, blocked on three open questions for Ken.

## Notes For Later Coding

- If a content seed changes gameplay, it should also get a line of dialog so the joke lands.
- If a seed needs art, it can start as an emoji or placeholder icon and get refined later.
- These items should stay balanced around tradeoffs, not free power.
