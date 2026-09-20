# Roadmap Handoff Plan v0.4.77 — Boom Stick Shotgun Theater

**Created by:** Codex GPT-5 — 2026-09-20
**Created on:** 2026-09-20
**Last updated by:** Codex GPT-5 — 2026-09-20
**Session mode:** Mode A (planning / refinement only — docs only, no code,
no build, no version bump, no deploy)
**Mode impact:** Both — Runner campaign first; Chaser Beta must retain the
AI-runner fire path without writing campaign profile stats.

## Decision summary

GitHub issue #3 already contained six related open items: handgun ammo
weights, stronger stun/knockback, chaser HP tiers, body count, the
`Splat` death gag, and a rare AoE shotgun. Ken's 2026-09-20 direction
settles the shotgun's identity and signature presentation:

- Rename the proposed **Poop Popper** shotgun to the **Boom Stick**.
- It is a separate one-shell-capacity weapon — not a skin or upgrade
  for the existing Jayden Gun. It begins rare, then becomes more
  available as level and difficulty pressure rise.
- One blast catches every eligible chaser in a forward cone.
- Each caught chaser independently has a **1-in-3** chance to explode.
  A survivor receives the long stun and knockback instead.
- An exploded chaser leaves a stylized blood splotch and gets a short
  cinematic cutaway: its current face breaks outward as glass-like
  Voronoi shards / crystalline disintegration.
- The cutaway uses the requested *Army of Darkness* parody lines and
  must remain short enough not to turn a rare reward into repeated
  control loss.

This makes the Boom Stick mechanics, text, timing, and visual direction
code-ready. Real spoken audio is a separate blocked slice until Ken
supplies or approves recordings.

## What is available in the gun roadmap

| Slice | Scope | Readiness |
|---|---|---|
| A | Existing Jayden Gun: weighted 1–6 ammo table, longer stun, knockback, shared weapon-state cleanup | Still needs its own ammo/stun/knockback numbers pass |
| B | Chaser HP-by-type, damage/death rules, persistent body count, `Splat` fallback | Still needs the HP table and persistent reward/economy rules |
| C1 | Boom Stick escalating spawn-event table, held-weapon state, single-shell chamber, reserve-ammo pickups | Code-ready; next smallest implementation slice |
| C2 | Boom Stick cone hit, 1-in-3 explosion per target, survivor stun/knockback | Code-ready after C1 |
| D | Blood-splotch decal + one combined glass-shatter cutaway per blast | Code-ready after Slice C2 |
| E | Text/subtitle pools and timing | Code-ready with placeholder browser-safe sound effects |
| F | Jayden voice lines / final audio mix | Blocked on recordings or explicit approval of final assets |

Slices C1–E are the new Boom Stick lane. Keep A/B independently
shippable; issue #3 is too broad for one unattended coding run.

## Boom Stick mechanical contract

### Escalating spawn-event table

Run a Boom Stick event roll at **level start** and again whenever an
**extra chaser spawns**. The probability rises with both the displayed
level number and difficulty:

```text
levelStep = { noob: 0.03, casual: 0.06, hardcore: 0.09 }[difficulty]
baseChance = min(0.90, 0.06 + (displayedLevel - 1) * levelStep)
```

(`hardcore` is the stored key for the player-facing `4chan-st` label.)

| Displayed level | Noob-noob | Casual | 4chan-st |
|---:|---:|---:|---:|
| 1 | 6% | 6% | 6% |
| 2 | 9% | 12% | 15% |
| 3 | 12% | 18% | 24% |
| 6 | 21% | 36% | 51% |
| 10 | 33% | 60% | 87% |
| Maximum | 90% | 90% | 90% |

Lucky Charm remains a visibly separate second roll after a failed base
roll. Its chance is `min(0.04, luckBonus / 10)`. Skip or trim that
second roll whenever necessary so the combined effective probability
can never exceed **90%**. This preserves an honest Lucky proc for the
badge/telemetry while honoring the hard cap.

An event success produces exactly one useful map pickup:

- Runner does not own the Boom Stick: spawn the Boom Stick with one
  shell loaded.
- Runner owns it: spawn one loose Boom Stick shell instead.
- Do not spawn overlapping Boom Stick/ammo pickups. If an earlier event
  pickup is still on the map, the next successful event refreshes its
  despawn timer rather than adding another.

### Inventory and reload

- Boom Stick capacity is **one loaded shell** plus at most **five reserve
  shells**.
- A loose-ammo pickup adds one reserve shell. If the chamber is empty,
  load it directly instead.
- Firing empties the chamber but **does not remove the Boom Stick**.
- If reserve ammo exists, automatically reload one shell after
  **0.85 seconds**. The Boom Stick cannot fire during reload.
- At full chamber + five-shell reserve, an event success does not create
  unusable ammo; show `BOOM STICK AMMO FULL` and preserve the successful
  roll for telemetry, but do not create a pickup.
- Boom Stick replaces the currently held gun/plunger/rod, consistent
  with today's single held-item behavior. Do not add weapon switching.
- Use a discriminated weapon state (`kind` + `ammo`) rather than adding
  more ambiguous gun booleans. Normalize the existing `ammo` versus
  `chambers` naming drift while touching this path so campaign and
  Chaser Beta test the same field.

### Blast geometry and outcomes

- Range: **230 world px**.
- Cone: **70 degrees total** (35 degrees either side of facing).
- Every chaser whose center is inside the cone is hit; walls block the
  blast using the existing collision/map geometry.
- Roll the **1-in-3 explosion independently per hit chaser**. This is
  clearer than one roll for the entire group and lets a group shot
  produce a mix of kills and dazed survivors.
- Exploded chaser: remove it from the active roster, add 1 to the
  **session** body count, leave a splotch, then reuse the existing
  respawn queue after **12 seconds**. Slice B owns persistence and any
  lifetime-kill rewards. Respawning preserves long-run chase pressure.
- Survivor: **7-second stun** plus **90px knockback**, clamped to the
  nearest walkable position so a chaser cannot be pushed into a wall.
- Reward: grant the existing gun-hit reward once per blast, not once per
  target, plus any separate body-count reward chosen in Slice B. This
  avoids an AoE economy exploit.
- Multiple explosion results from one shell produce **one cutaway**, not
  sequential cutaways. Show up to three shattered portraits in that
  single composition and summarize any additional kills as `+N MORE`.

### Blood-splotch rule

- Use a graphic, stylized dark-crimson radial decal rather than anatomy
  or realistic gore.
- A splotch persists until capture or level change. Cap the collection
  at **12**, discarding the oldest when the cap is exceeded.
- No collision or gameplay effect; it is a visual record only.
- In Noob-noob difficulty, render the same decal as purple-red comic
  goop. Casual and 4chan-st may use dark crimson.

## Cutaway direction and timing

The rare explosion is the only event that interrupts the chase. A miss
or stun-only blast stays entirely in live gameplay.

| Time from trigger | Direction |
|---:|---|
| 0.00s | Fire immediately on input: muzzle flash, bassy boom, 6px camera kick. Do not delay the shot for dialogue. |
| 0.00–0.10s | Hit-stop. Freeze simulation, keep the muzzle flash visible. |
| 0.10–0.28s | Punch camera to the exploded chaser face; darken the world behind it. |
| 0.28–0.78s | Divide the face into 18–28 irregular Voronoi cells. Shards rotate and accelerate radially outward; add a white fracture flash and crimson comic particles. |
| 0.62s | Stamp the splotch into the world beneath the victim. Remove the chaser from the active roster. |
| 0.78–1.55s | Hold the quote card over the settling shards. Use `GOOD. BAD. I'M THE GUY WITH THE GUN.` most often; rare alternate `HAIL TO THE KING, BABY.` |
| 1.55–1.75s | Snap back to the live camera, restore simulation, and fade the vignette. |

Hard cap the whole cutaway at **1.75 seconds**. Respect reduced-motion:
replace moving shards with a 200ms cracked-portrait flash, then the same
quote card, and cap the sequence at **0.9 seconds**.

Implementation note: a true runtime Voronoi solver is optional. A fixed,
seeded set of irregular triangular/polygon shards clipped from the
chaser portrait is acceptable and easier to make deterministic in tests.

## Voice and subtitle script

Keep only one spoken line active at a time. Speech bubbles/subtitles may
remain visible a little longer than their audio. Direction assumes
Jayden sounds delighted and overconfident, not angry.

### Pickup / ammo hook

| Weight | Line | Performance | Audio / subtitle duration |
|---:|---|---|---:|
| 60% | `Alright you Primitive Screwheads, listen up!` | Start conversational, then punch `listen up!` like he has seized the room. | 1.9s / 2.3s |
| 25% | `Twelve-gauge, double-barreled Remington. S-Mart's top of the line.` | Mock salesman voice; proud pause after `Remington`. | 3.0s / 3.5s |
| 15% | `Come on, you primitive meathead. You got ugly.` | Quiet challenge on the first sentence; grin through `ugly`. | 2.1s / 2.5s |

The trigger is a Boom Stick or loose Boom Stick shell pickup. Do not
play it for ordinary handgun ammo.

### Weapon replacement / old-school shooter beats

- When the Boom Stick replaces the existing Jayden Gun:
  `THIS HANDGUN SUCKS. IT NEEDS TO BE A SHOTGUN.` Deliver it like Jayden
  has just reviewed a terrible product: annoyed first, delighted on
  `shotgun`; 2.2s audio / 2.6s subtitle.
- Rare replacement alternate:
  `MUSTANG AND SALLY? OLD SCHOOL. THIS IS BOOM STICK BUSINESS.` This is
  the explicit old-school *Call of Duty: Black Ops Zombies* reference;
  nostalgic recognition on `Mustang and Sally`, then loud confidence;
  2.6s audio / 3.0s subtitle.
- Close-call alternate after firing while a chaser was within 90px:
  `Freekalops almost got me!` Use a warm, gravelly older-storyteller
  character voice, surprised on `Freekalops` and relieved on `got me`;
  1.5s audio / 1.9s subtitle. Do not direct the performer to imitate a
  racial stereotype or a specific real person.

### Fire beat

- At trigger +0.00s: gun fires immediately.
- From +0.02s to +1.25s, Jayden shouts **`This... is my BOOMSTICK!`**.
  Stretch `This`, leave a short theatrical gap, and bark `BOOMSTICK`.
- On a stun-only result, follow at +1.30s with
  `Shop smart. Shop S-Mart. You got that?` in a smug, fake-commercial
  voice. Show for 2.3s; it does not pause play.
- On any explosion result, skip the Shop S-Mart follow-up so it does not
  talk over the cutaway. Use the cutaway quote instead.

### Explosion quote card

- 75%: `Good. Bad. I'm the guy with the gun.` — low and matter-of-fact;
  1.7s audio, 2.0s card if the cutaway timing later permits the final
  words to continue over resumed play.
- 25%: `Hail to the king, baby.` — lighter victory-button delivery;
  1.35s audio, 1.6s card.

### Difficulty flavor pools

The signature lines above define the Boom Stick identity. Supplemental
kill captions should still follow issue #3's difficulty rule:

- **Noob-noob:** `BOOM GOES THE POTTY!`, `NIGHT-NIGHT, TOILET FACE!`,
  `YOU GOT EXTRA UGLY!` Use playful delivery; purple-red goop.
- **Casual:** signature lines plus `PRIMITIVE MEATHEAD: POPPED.` and
  `SHOP SMART. RUN FASTER.`
- **4chan-st:** signature lines plus `PRIMITIVE MEATHEAD DELETED.` and
  `250 YEARS OF MURICA. STILL LOUD.` Keep it edgy-comic, not hateful or
  aimed at a protected group.

Never stack a supplemental caption over the signature explosion quote;
choose one output per explosion cutaway.

## Visual acceptance criteria

- The face itself is visibly used as the shard texture; this cannot be
  satisfied by generic glass particles floating over an intact face.
- Shards travel outward from the face center with varied angle, scale,
  spin, and speed; no uniform square-grid breakup.
- The world splotch appears at the chaser's last valid position and is
  still visible after the camera returns.
- Multiple kills from one blast share one cutaway and one quote.
- Portrait 9:16 framing keeps the full face/shatter inside the safe area.
- Mute suppresses voice/SFX while subtitles and the visual remain.
- Capture, level transition, and menu exit cancel the cutaway safely.

## Test contract

- Deterministically force the Boom Stick spawn and verify one shell,
  held-item replacement, HUD label, and FIRE button.
- Verify the level/difficulty table, Level-1 6% floor, Level-2
  9%/12%/15% row, every-extra-chaser event, separate Lucky roll, and
  90% combined cap.
- Verify successful events spawn a weapon when unowned and one shell
  when owned, never duplicate a live event pickup, enforce the five-shell
  reserve cap, and reload in 0.85s.
- Place three chasers: two inside the cone and one outside; verify only
  the inside pair are eligible.
- Stub RNG to test both the 1-in-3 explosion and survivor stun paths.
- Assert one cutaway for a multi-kill, its 1.75s cap, splotch creation,
  chaser removal, body-count increment, and 12s respawn.
- Assert reduced-motion uses the short cracked-card path.
- Assert Noob-noob uses comic goop/captions and mute prevents audio.
- Re-run Chaser Beta gun-fire coverage after normalizing weapon state.

## Ken action required

Record or approve the final spoken lines before Slice F. Provide each
line as a separate dry recording with no music or reverb; WAV/M4A is
fine for source, then follow `docs/sound-effects-howto.md` for the game
format. Mechanics, text subtitles, browser-generated boom, and visual
work do not need to wait for recordings.

Because these are recognizable movie quotations and a real firearm /
retailer reference, keep the wording as Ken-directed parody copy, but
do a final public-release content/IP review before treating it as
marketing copy outside the game.

## Explicit non-goals

- No code in this planning session.
- No realistic gore, dismemberment, or anatomy.
- No weapon wheel, inventory expansion, or dual wielding.
- No sequential cutaway for every target in a group blast.
- No permanent reduction of the level's chaser pressure.
- No `GAME_ITERATION` bump or deploy.

## Recommended build order

1. **Slice C1:** escalating spawn-event calculation, extra-chaser hook,
   Boom Stick/loose-shell pickup choice, one-shell chamber, five-shell
   reserve, and reload. Do not add damage in this slice.
2. **Slice C2:** cone hit, survivor stun/knockback, and deterministic
   explosion selection. Use a temporary `SPLAT!` text fallback (the full
   `Splat` death gag does not exist yet and remains part of Slice B).
3. **Slice D:** splotches, portrait-shard cutaway, reduced-motion path,
   multi-kill composition.
4. **Slice E:** subtitle pools, difficulty routing, placeholder boom and
   shatter SFX, mute behavior.
5. **Slice F:** import and mix approved Jayden recordings.
6. Return separately to issue #3 Slices A/B for the broad handgun/HP/
   body-count rebalance; do not bury that system work inside C1/C2.

## Copy-paste: next coding session

```text
code_monkey_backend: ollama
code_monkey_model: thinkpad-local

Work in Mode B. Read docs/skib-sdlc.md, docs/update-directions.md,
docs/roadmap.md, and docs/handoffs/roadmap-handoff-v0.4.77-plan.md.

Implement only Slice C1: Boom Stick spawn events and ammo state.

1. Add a distinct Boom Stick weapon kind with a one-shell chamber and a
   five-shell reserve. Normalize `ammo` versus `chambers` so Runner and
   Chaser Beta read the same weapon fields.
2. Roll at level start and whenever an extra chaser spawns. Use
   `min(0.90, 0.06 + (displayedLevel - 1) * step)`, where step is 0.03
   Noob-noob, 0.06 Casual, and 0.09 4chan-st (`hardcore` stored key).
3. After a failed base roll, run the separate Lucky roll
   `min(0.04, luckBonus / 10)`, trimming/skipping it so combined effective
   odds never exceed 90%.
4. On success spawn a loaded Boom Stick if unowned, otherwise one loose
   shell. Never leave duplicate event pickups active; cap reserve at 5.
5. Firing is not part of this slice. Add only the 0.85s reload state/API
   needed for Slice C2 and deterministic test access.
6. Add Playwright coverage for the table, both trigger types, Lucky
   assist/cap, pickup selection, duplicate prevention, reserve cap, and
   reload transition.

Do not implement cone damage, explosions, respawn, shard cutaway,
splotch art, final dialogue/audio, or the broad handgun/HP rebalance.
Run `cd frontend && npm run build && npx playwright test`.
Update the required SDLC docs. Do not deploy unless Ken explicitly asks.
```
