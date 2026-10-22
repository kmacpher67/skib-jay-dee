# Splat Effects Brief for Alex

**Created by:** Claude Sonnet 5.5 — 2026-10-22
**Created on:** 2026-10-22
**Last updated by:** Claude Sonnet 5.5 — 2026-10-22
**Last updated on:** 2026-10-22

This brief is for whoever creates the Boom Stick "splat" effects: the
blood-splotch art, the portrait-shatter cutaway, and the sounds. It is
self-contained; the full design contract is
`docs/handoffs/roadmap-handoff-v0.4.77-plan.md` (sections "Blood-splotch
rule", "Cutaway direction and timing", "Visual acceptance criteria").
Game context: GitHub issue #3.

## Where things stand (v0.4.78, live)

The Boom Stick blast works: a 230px forward cone, each chaser hit has a
1-in-3 chance to explode, survivors are stunned 7s and knocked back, and
exploded chasers respawn after 12s. Right now an explosion only shows a
**temporary red "SPLAT!" text and brown smoke puffs**. Everything below
replaces that placeholder.

Engine hook: `_fireBoomStick()` in `frontend/src/GameEngine.js`. The list
`splatEffects` already exists; the text is drawn in the draw pass next to
`smokeEffects`.

## What is needed to finish the splat

| Slice | Work | Needs Alex? |
|---|---|---|
| D | Blood-splotch decal in the world + one portrait glass-shatter cutaway per blast | Art / shard design welcome |
| E | Subtitle pools, difficulty-specific captions, boom + shatter SFX, mute behavior | SFX files welcome |
| F | Final spoken Jayden lines mixed in | Yes, recordings (or Ken approval of finished assets) |

D and E can ship with generated or placeholder assets; they do not wait
for recordings. Only F waits.

## Art to make (Slice D)

**1. Splotch decal.** Stylized radial splat, graphic and comic, not
realistic gore or anatomy.
- Casual and 4chan-st: dark crimson.
- Noob-noob: purple-red comic goop (same shape, recolored).
- 3 to 4 shape variants so repeats don't look identical.
- Transparent PNG, about 128x128, top-down on the floor, no baked
  background. Suggested names: `splat-crimson-1.png`..`-4.png`,
  `splat-goop-1.png`..`-4.png`.
- Rules the engine will follow: persists until capture or level change,
  capped at 12 on screen (oldest dropped), no gameplay effect.

**2. Portrait-shatter cutaway** (the only thing that interrupts the chase,
only on an explosion). Hard cap 1.75s total:

| Time | What happens |
|---:|---|
| 0.00s | Fire: muzzle flash, bassy boom, 6px camera kick |
| 0.00-0.10s | Hit-stop (freeze), flash stays visible |
| 0.10-0.28s | Punch in on the exploded chaser's face, darken background |
| 0.28-0.78s | Face breaks into 18-28 irregular Voronoi-style shards that spin and fly outward, white fracture flash, crimson comic particles |
| 0.62s | Splotch stamped into the world under the victim |
| 0.78-1.55s | Quote card over the settling shards |
| 1.55-1.75s | Snap back to live camera, fade vignette |

- Shards must visibly use the chaser's actual portrait as the texture, not
  generic glass over an intact face. Varied angle, scale, spin and speed;
  no square grid.
- A fixed, seeded set of irregular polygon shard shapes clipped from the
  portrait is fine (and easier to test) than a runtime Voronoi solver.
- Multi-kill from one blast = one cutaway, up to 3 shattered portraits in
  one composition, extras summarized as `+N MORE`.
- Reduced-motion path: 200ms cracked-portrait flash, then the quote card,
  0.9s max.
- Keep everything inside the 9:16 portrait safe area.
- Chaser portraits live in `frontend/src/assets/` (see `CHASER_FACE_POOL`
  in `frontend/src/gameContent.js`).

## Sounds to make (Slice E)

Browser-safe `.mp3` or `.m4a`, short, normalized to match the existing
clips in `frontend/src/assets/audio/`. Follow `docs/sound-effects-howto.md`.
Keep a note of source and license for every clip (CC0 preferred).

| Suggested file | Description | Length |
|---|---|---|
| `boom-stick-blast.mp3` | Bassy shotgun boom, plays instantly on fire | under 1s |
| `boom-stick-shatter.mp3` | Glass crack and shard spray for the cutaway | about 0.8s |
| `boom-stick-splat.mp3` | Wet comic splat when the splotch lands (0.62s mark) | under 0.5s |
| `boom-stick-reload.mp3` | Pump / shell load, plays during the 0.85s reload | about 0.85s |
| `boom-stick-pickup.mp3` | Pickup sting (optional) | under 1s |

Mute must suppress all of these while subtitles and visuals remain.

## Spoken lines (Slice F, needs recordings)

Only one spoken line plays at a time. Jayden sounds delighted and
overconfident, not angry. Deliver each line as a separate dry recording
(no music, no reverb); WAV or M4A source is fine, then follow
`docs/sound-effects-howto.md` for the game format. Subtitles stay up a
little longer than the audio. Audio / subtitle durations below are targets.

### Pickup / ammo hook (plays on Boom Stick or loose shell pickup, never for handgun ammo)

| File | Weight | Line | Performance | Audio / subtitle |
|---|---:|---|---|---:|
| `bs-pickup-listen-up.mp3` | 60% | `Alright you Primitive Screwheads, listen up!` | Conversational, then punch `listen up!` like he owns the room | 1.9s / 2.3s |
| `bs-pickup-smart-shop.mp3` | 25% | `Twelve-gauge, double-barreled Remington. S-Mart's top of the line.` | Mock salesman, proud pause after `Remington` | 3.0s / 3.5s |
| `bs-pickup-get-ugly.mp3` | 15% | `Come on, you primitive meathead. You got ugly.` | Quiet challenge, grin through `ugly` | 2.1s / 2.5s |

### Weapon replacement

| File | When | Line | Performance | Audio / subtitle |
|---|---|---|---|---:|
| `bs-replace-handgun-sucks.mp3` | Boom Stick replaces the Jayden Gun | `THIS HANDGUN SUCKS. IT NEEDS TO BE A SHOTGUN.` | Reviewing a terrible product: annoyed, then delighted on `shotgun` | 2.2s / 2.6s |
| `bs-replace-mustang-sally.mp3` | Rare alternate | `MUSTANG AND SALLY? OLD SCHOOL. THIS IS BOOM STICK BUSINESS.` | Nostalgic recognition on `Mustang and Sally` (Black Ops Zombies reference), then loud confidence | 2.6s / 3.0s |

### Fire beat

| File | When | Line | Performance | Audio / subtitle |
|---|---|---|---|---:|
| `bs-fire-boomstick.mp3` | Every shot, starts 0.02s after fire, runs to about 1.25s | `This... is my BOOMSTICK!` | Stretch `This`, short theatrical gap, bark `BOOMSTICK` | about 1.25s |
| `bs-fire-shop-smart.mp3` | Stun-only result only, at +1.30s (skipped on explosions) | `Shop smart. Shop S-Mart. You got that?` | Smug fake-commercial voice | about 2.0s / 2.3s |
| `bs-closecall-freekalops.mp3` | Fired while a chaser was within 90px | `Freekalops almost got me!` | Warm, gravelly older-storyteller character; surprised on `Freekalops`, relieved on `got me`. Do not imitate a racial stereotype or a specific real person | 1.5s / 1.9s |

### Explosion cutaway quote (exactly one per cutaway)

| File | Weight | Line | Performance | Audio / card |
|---|---:|---|---|---:|
| `bs-kill-good-bad.mp3` | 75% | `Good. Bad. I'm the guy with the gun.` | Low, matter-of-fact | 1.7s / 2.0s |
| `bs-kill-hail-king.mp3` | 25% | `Hail to the king, baby.` | Lighter victory button | 1.35s / 1.6s |

### Supplemental kill captions by difficulty (text now, voice optional)

Pick one caption per cutaway and never stack it over the signature quote.

- **Noob-noob** (playful, purple-red goop): `BOOM GOES THE POTTY!`, `NIGHT-NIGHT, TOILET FACE!`, `YOU GOT EXTRA UGLY!`
- **Casual:** the signature quotes plus `PRIMITIVE MEATHEAD: POPPED.` and `SHOP SMART. RUN FASTER.`
- **4chan-st** (edgy-comic, never hateful or aimed at a protected group): the signature quotes plus `PRIMITIVE MEATHEAD DELETED.` and `250 YEARS OF MURICA. STILL LOUD.`

Voice filenames above are suggestions; tell Ken the real names and the
wiring session will map them. These are parody quotes of recognizable
movies and a retailer, so do a final content review before using them in
marketing outside the game.

## Delivery

Drop finished files in a folder or branch and tell Ken the filenames.
Coding session wiring is a bounded Mode B slice (`roadmap-handoff-v0.4.78.md`
has the copy-paste block). Update the checklist below when a file lands.

- [ ] splat-crimson-1..4.png
- [ ] splat-goop-1..4.png
- [ ] shard design / approach agreed
- [ ] boom-stick-blast.mp3
- [ ] boom-stick-shatter.mp3
- [ ] boom-stick-splat.mp3
- [ ] boom-stick-reload.mp3
- [ ] bs-pickup-*.mp3 (3 files)
- [ ] bs-replace-*.mp3 (2 files)
- [ ] bs-fire-boomstick.mp3, bs-fire-shop-smart.mp3, bs-closecall-freekalops.mp3
- [ ] bs-kill-good-bad.mp3, bs-kill-hail-king.mp3
