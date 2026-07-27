# Level Progression & Endgame Arc — Plan

**Created by:** Claude (Sonnet 5) — 2026-07-26
**Last updated by:** Claude Sonnet 5 — 2026-07-27

**Status:** Parked planning note, not a handoff. Written 2026-07-26 in
response to Ken's ask: "add level 6 and plans for beyond... detailed
design docs for each level to improve play, add content and complete
the arch of the games end plot... which isn't quite yet at level 5, so
we have to add harder stuff in more chasers faster etc."

This doc is the level-by-level design reference the source PDF
(`Skib-jay-dee-toilet game-init-v1.pdf`) never got past its first five
map ideas for. It recaps what's shipped, then proposes Level 6 and a
Level 7 climax that actually closes the "grand arch of the game" (the
PDF's own phrase: "Run like hell. Skreeem and laugh.") instead of the
game staying open-ended forever after Level 5.

## Why this doc exists instead of just adding rows to `docs/roadmap.md`

The PDF sketches four map ideas (Porcelain Palace, Ramen Aisle, World
Star Parking Lot, and a fourth — "Jayden's Nightmare House" — that was
never built) and a five-character roster (Skibidty Toilet Guy, Skib-Daddy-
Toilet Guy, Raman-Aunt-Toilet Lady, Screeeeming Kid/Jayden, Dancing
German Yoodeling Uncle). Two of those five characters — **Skib-Daddy-
Toilet Guy** and a mechanically-distinct **Raman-Aunt-Toilet Lady** —
are still just "tracked in the backlog," per `docs/characters.md`'s
"OTHER NPC characters (tbd future)" section. This doc is where their
introduction actually gets scoped as gameplay, not just a face in the
pool.

## Recap: what's shipped (Levels 1-5)

| # | Name | Status | Chaser pressure |
|---|---|---|---|
| 1 | Porcelain Palace | Live, v0.4.32 added a mandatory progression badge | 1 chaser, ramps to more over time |
| 2 | Pipeworks | Live, v0.4.32 added a mandatory progression badge | Up to 5 chasers (`PIPEWORKS_GATE_REQUIRED_CHASERS`) |
| 3 | Flooded Annex | Live, v0.4.32 added a mandatory progression badge | Standard multi-chaser ramp |
| 4 | The Ramen Aisle | Live; v0.4.33-plan adds Quest Rooms + a 90s/5-chaser survival floor | Standard multi-chaser ramp |
| 5 | World Star Parking Lot | Live, `advanceAt: null` (currently endless by design); v0.4.33-plan adds a Quest Room; v0.4.34-plan adds wall-hack chasers + the Gawd Particle | Endless escalation |

Level 6 now exists in `LEVELS` (`frontend/src/GameEngine.js`) as
`v0.4.38`; Level 7 still doesn't.

## Level 6: "Jayden's Nightmare House" (shipped v0.4.38)

Straight from the PDF's unused fourth map idea: *"A distorted suburban
house where doorways loop back on themselves and toilets randomly
appear in the middle of the kitchen."* This is the natural next map —
it's already designed, just never built.

- **Theme:** a suburban house interior gone wrong — hallways that loop
  (visually distinct wallpaper/flooring per "wing" so the looping reads
  as intentional, not a bug), a kitchen with a toilet where the fridge
  should be, a living room, a garage.
- **New chaser: Skib-Daddy-Toilet Guy.** Introduced here as a heavy
  chaser type with the PDF's own ability, **Plunger Launch** — fires a
  projectile that, on hit, pulls the runner backward toward him a short
  distance (the inverse of the Jayden Gun's knockback-via-stun; this is
  a pull, not a stun, so it stays distinct). Slower base speed than a
  regular chaser, higher pressure when it connects. Needs a chaser face
  asset — see "Flag for Ken" below.
  - Wall-hacks (v0.4.34) and the speed multiplier apply to Skib-Daddy
    too once Level 6 is at `levelIndex >= 4` territory — but Skib-Daddy
    is meant to feel like a distinct heavy, not just a reskinned regular
    chaser, so his own `chaserType` (per the "Per-level chaser roster"
    item already on the roadmap's map-system plan) should carry Plunger
    Launch regardless of level-based wall-hack rules.
- **Landmark quest room:** the garage, one door, matching v0.4.33's
  "single chokepoint" spec for Level 5+ rooms. Badge:
  **"Garage Survivor."**
- **Advance condition:** following the v0.4.33-plan pattern —
  `levelSkreems >= advanceAt` AND a scaled survival floor
  (`90 + (levelIndex - 3) * 30` = 150s at index 5) AND
  `chasers.length >= 5`. This is the first level where the plan's
  "scales up for levels beyond 4" language actually has somewhere to
  apply, now that a Level 6 exists.

In the shipped build, Level 6 is currently the terminal live level until
Level 7 is added. Treat the advance-condition paragraph above as the
intended future arc for that next level, not as something still waiting
to be implemented on the current shipped slice.

## Level 7: "The CEO of Drains" — climax / endgame

The PDF's alternate pitch draft (the "underpaid corporate custodian"
riff later in the same document) introduces a boss framing that never
made it into the main design: *"led by the supreme CEO of Drains."*
This doc proposes that as the actual climax the game has been building
toward, rather than staying endless forever.

- **Theme:** a liminal corporate office bathroom — the PDF's "endless
  labyrinth of cubicles [merged with] nightmarish public restrooms" —
  visually the most unstable/glitchy map yet (screen-filter distortion
  already exists as a pattern via the jump-scare's derp filter; reuse
  that language here for ambient dread, not just on capture).
- **The boss chaser: "CEO of Drains."** A single, named chaser with all
  of Skib-Daddy's Plunger Launch plus wall-hacks plus a third ability —
  proposal: a periodic **"Executive Order"** AoE pulse that briefly
  reveals the CEO's position through walls to the player (fair-play
  counterplay to wall-hacking) but also slows the runner for ~1s,
  telegraphed by a distinct bark/visual tell so it reads as fair rather
  than a cheap hit.
- **The payoff for the Gawd Particle (v0.4.34):** Level 7 is where the
  Gawd Particle's hunter-reversal mechanic actually matters narratively,
  not just mechanically — landing it on the CEO of Drains during the
  climax should be the game's actual "win" beat.
- **Proposed win-state:** surviving/"defeating" the CEO of Drains (e.g.,
  a Gawd-Particle-empowered contact, mirroring the existing despawn/
  respawn-queue mechanic but permanent for this one boss encounter)
  triggers a proper ending sequence — a beat parallel to the existing
  jump-scare/capture zoom, but a *victory* zoom with its own copy, then
  returns to the menu with `profile.highestLevel` maxed and a final
  badge. This is the piece that actually "completes the arc" per Ken's
  ask, instead of the game just getting harder forever with no
  resolution.
- **After the ending / Level 7+ (The Mosaic Map of Madness):** The game doesn't have to lock further play — precedent is `docs/roadmap.md`'s existing endless-Level-5 design. Recommend the run keeps going in an "endless/New Game+" mode. But for Level 7 and higher, we introduce a **mutable puzzle map** (parodying Marvel's Dr. Strange "Multiverse of Madness" with Rick and Morty style dialogue, leaning heavily into "fair use" doctrine for comedy).
  - **Mosaic Layouts:** Certain defined level artifacts (rooms, pinch points, awards, side quests) are moved around. Not just on each respawn, but based on a time function (e.g. a Fibonacci sequence tied to the clock) so the layout mutations feel organic but don't unfairly lock out night-time vs day-time players.
  - **Mutable Multi-verse Mechanics (TBD - needs refinement & data specs):**
    - *Layer-Sync Mirroring / Parallel Overlays:* Render two versions of a room (Past/Future, Normal/Void) stacked or side-by-side.
    - *Mutual Mutation & Causality Echoes:* Pushing a block in one dimension alters its counterpart in another.
    - *Glitch Zones & Dimensional Rift Anchors:* Spots where players can briefly reach into an alternate reality to grab items or block hazards.
    - *Temporal Echoes:* Record player movement for 5 seconds to repeat that path as a switch-holder in an alternate world.
  - **Puzzle Flow & Pacing:** Use distinct color palettes (Visual Clarity) for each universe. Start with one-way state changes, layer into two-way loops, and always include a quick-reset button for fail-safe resets to avoid soft-locks.
  - **Design Goal:** Keep it fun and interesting, not impossible.
  - **Reviewed 2026-07-27 (vibe pass, no changes to the concept above):**
    re-read this section against the "no code-cowboy" rule in
    `docs/skib-sdlc.md` (don't quietly upgrade an open creative question
    to "decided"). One real gap found: the outside-AI discussion that
    proposed this section explicitly asked *how the player triggers a
    dimension shift* — a static floor trap they run over, or an active
    held item like the Jayden Gun — and that question was never actually
    answered by Ken, only left open in the source transcript. Recording
    it here as its own explicit open question (folded into "Flag for
    Ken" below) rather than letting a future session assume one answer.
    Also cross-referencing `docs/difficulty-mechanics-plan.md`'s
    "Predictability vs. findability" note: the Mosaic map's room/artifact
    shuffle is exactly the kind of "findable if you learn the seed"
    feature that auto-tuning difficulty should *not* touch — the economy
    knob flexes, the map rules don't.

## Flag for Ken — creative decisions this doc does not make up

Per `docs/skib-sdlc.md`'s constraint ("default character faces are real
family photos, not placeholder art — if you'd replace or regenerate
them, ask first") and the "no code-cowboy" rule against guessing
creative specifics, the following needed your call before any Mode B
session builds Level 6 or 7:

1. **RESOLVED (2026-07-27).** Skib-Daddy-Toilet Guy's face asset: Ken
   confirmed reusing an existing chaser face — `dad-case` — as a
   placeholder (good thematic fit: "dad" energy) until a dedicated photo
   exists. Level 6 is now unblocked on this question; see
   `docs/handoffs/roadmap-handoff-v0.4.38.md` for the shipped handoff.
   Swapping in a real photo later is a one-line
   `CHASER_FACE_POOL`/`chaserType` face-id change, not a re-plan.
2. **PARKED (2026-07-27), not part of this planning pass.** Level 7
   ("CEO of Drains") stays exactly where it was — depends on Level 6
   shipping first, plus questions 3 and 4 below. Do not scope it into a
   handoff yet.
3. **CEO of Drains' face asset and name flavor.** Same question — a
   specific photo, or a placeholder/existing face standing in until one
   is supplied? Also: is "CEO of Drains" the actual name you want in
   dialogue/badges, or just this doc's working title?
4. **The ending's exact tone/copy.** This doc proposes a "victory zoom"
   parallel to the jump-scare, but the actual joke/line writing (like
   the PDF's scripted jump-scare lines: "You just got PLUNGED!" etc.)
   should come from you or be explicitly delegated, not invented wholesale
   by a coding session.
5. **Does the game truly end, or loop?** Confirming the "one-time ending
   then endless New Game+" proposal above vs. some other shape (e.g., a
   harder Level 8+ instead of looping) before it's built.
6. **Raman-Aunt-Toilet Lady's distinct ability** (Broth Slip, per the
   PDF) is still unclaimed by any level in this plan — worth deciding
   whether she's a Level 6/7 addition too, or stays parked for a later
   phase.
7. **NEW (flagged 2026-07-27): how does the player trigger a Mosaic
   dimension shift?** A static "Glitch Puddle" the player has to run
   over, or an active held item like the Jayden Gun/Heavy Plunger that
   they choose when to use? This changes the mechanic's whole feel
   (forced/random vs. player-controlled) and needs your call before any
   Mode B session builds the Glitch Zones/Rift Anchors mechanics above.

## Roadmap/backlog updates this doc makes

- `docs/roadmap.md`'s phase table (Phase 3, "More characters/abilities
  per PDF roster") now points here instead of staying a bare "Not
  started" row.
- The Level 6 build shipped as `docs/handoffs/roadmap-handoff-v0.4.38.md`
  once question 1 was resolved. Deliberately kept separate from v0.4.33
  (Quest Rooms + Level 4-5 difficulty floor) and v0.4.34 (wall-hacks +
  Gawd Particle) so none of the three grew past one session. The
  level-data-extraction cleanup also landed in the same release train, so
  the original "do this first" sequencing note is now historical only.
- Level 7 ("CEO of Drains") is still parked — it depends on questions 3
  and 4 above and on v0.4.34's Gawd Particle actually shipping first
  (its despawn/respawn-queue mechanic is the building block the win-state
  payoff reuses). Keep it out of `docs/roadmap.md`'s incremental backlog
  until those answers are in hand.
