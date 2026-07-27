# Interactive Content Pack

This doc collects the next content-only pass after the gun, badges, quest rooms, and difficulty spikes. The goal is to make the game feel more alive without needing a new engine architecture: more funny pickups, more secret awards, and clearer room identity.

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

| Name | Side | Effect | Tone |
|---|---|---|---|
| Decoy Flush | Runner good | Drops a loud noise that pulls nearby chasers toward the wrong lane for a few seconds. | Panic button, but funny. |
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

## Notes For Later Coding

- If a content seed changes gameplay, it should also get a line of dialog so the joke lands.
- If a seed needs art, it can start as an emoji or placeholder icon and get refined later.
- These items should stay balanced around tradeoffs, not free power.
