# Player's Guide — Skib-Jay-Dee-Toilet

**Created by:** Composer — 2026-07-27
**Last updated by:** Codex (GPT-5) — 2026-08-07 (item glossary pass)

Single source of truth for game mechanics. The in-game footer links here
directly (see `roadmap-handoff-v0.4.45-plan.md` — the earlier in-game
modal duplicated this content and is being retired in favor of this
link).

**See something wrong or missing?** Open an issue at
[github.com/kmacpher67/skib-jay-dee/issues](https://github.com/kmacpher67/skib-jay-dee/issues)
and we'll fold it into this guide.

## Controls

- **Move:** Arrow keys, WASD, or the on-screen joystick (bottom-left).
- **Sprint / boost:** Space bar or hold the SPRINT button (bottom-right).
- **Fire / use item:** `F` key or the on-screen FIRE button (appears when you
  have a gun, plunger, Rod of Poopdom, or Shart charge).
- **Teleport (Rod only):** `T` key or the FIRE button when the rod is held
  (reads **WARP**).

## Game modes

- The intro app screen (officially called the **Main Menu**) launches the normal campaign where you play as the **runner**: survive, collect items, advance levels, and use the profile economy described below.
- A **Play as Chaser** menu scaffold exists, but it is currently a broken
  experimental Beta: directional control for the human chaser is not
  reliable and the side-mode rules are not yet isolated from the
  campaign. Do not expect normal campaign rewards or progression from it.
- The planned recovery will label the menu choices **PLAY AS RUNNER** and
  **PLAY AS CHASER — BETA**, then give the chaser mode its own clear
  objective and result loop. This guide must be updated again only after
  that behavior actually ships.

Design/status source:
[Role Reversal Design](role-reversal-design.md).

## Weapons & ammo (Jayden Gun)

- The Jayden Gun is a rare map pickup (one spawn roll per level; Lucky Charm
  shop items boost the odds).
- Picking up a gun gives **1 or 2 shots** — not a permanent weapon.
- **A new gun pickup replaces your current gun entirely.** Leftover ammo from
  the old gun is lost; ammo does **not** stack across pickups.
- When ammo hits zero, the gun disappears until you find another pickup.
- Fire in the direction you are facing. A hit stuns the nearest chaser in that
  arc for a few seconds.

## Level transitions

- When you clear a level, the map resets for the next one.
- **Uncollected pickups on the ground are lost** — grab guns, badges, Taco
  Bell, and other map loot before you earn enough skreems to advance.
- Your sheebs balance, shop items, earned badges, and death count carry over
  between levels in the same run.

## Wall-hacking Skibs (Level 5+)

- Starting at **Level 5** (World Star Parking Lot and beyond), chasers can
  **move through walls** and run slightly faster. Walls no longer block them.
- On Levels 1–4, chasers still respect walls like you do.
- The rare **Gawd Particle** pickup (Level 5+ only) flips the script for
  **10 seconds**: you can run through walls, you glow gold, and bumping a
  chaser **despawns** it instead of catching you (it respawns after ~15
  seconds). This is temporary — plan your route before the buff wears off.

## Attacks — Shart Knocker (the orange FART button)

- On **Level 4 and above**, eating a **Taco Bell Grande** gives you one
  **Shart charge** (in addition to its speed-boost effect).
- When charged, the FIRE button turns **orange** and reads **FART**.
- Press `F` or tap FART to unleash a **single instant blast** that stuns the
  **nearest chaser within range** for 3–12 seconds (random). A hit pays
  +50 sheebs and can earn the **Flaming Ass** badge on your first success; a
  miss still pays +5 sheebs.
- **The orange FART button is not a protective shield.** It only fires once
  per charge. Any lingering brown/orange circle or glow you see afterward is
  just leftover visual feedback — **it does not block captures**. Other
  chasers can still grab you the moment the stun wears off (or if you missed).

## Rod of Poopdom (teleport staff)

- Rare map pickup (~5% spawn chance per level).
- Picking it up replaces any gun or plunger you were holding.
- Press **`T`** or tap **WARP** (FIRE button) to teleport up to **300px** in the
  direction you are facing (or toward your pointer on desktop).
- **You cannot teleport into walls** — if the destination is blocked, nothing
  happens.
- After each warp you get a **3-second Stinky cooldown** (button shows a
  countdown) before you can warp again.
- Brown smoke appears at your departure point. Comedic, not protective.

## Item glossary

### Shleeb Shop perks

- **Turbo Clogs:** Buy this when you want the runner to feel snappier
  before and between chases. It boosts raw movement speed, which helps
  you recover from bad turns and stay ahead in long hallways.
- **Deep Breath Tank:** Buy this when you keep running out of stamina
  too early. It increases max stamina, so sprinting stays available
  longer and you can spend more of a chase in boost mode.
- **Sheeb Magnet:** Buy this if your goal is to earn back more value
  from successful clears. It raises level payouts, which helps fund
  other shop buys faster.
- **Lucky Charm:** Buy this when you want more map help from the random
  pickup pool. It increases positive pickup odds, making helpful items
  appear more often.
- **Golden Lucky Charm:** Buy this when you already like Lucky Charm and
  want the stronger version. It stacks with the regular charm for even
  better positive pickup odds.
- **Neon Jump-Scare Filter:** Buy this if you want a small escape window
  after getting caught. After a scare, it can give a brief neon
  headstart, but each use costs sheebs.
- **Warp Pass:** Buy this only after you’ve earned the required clears
  and want to start later in the campaign. It does not improve stats; it
  just unlocks a higher starting level for runner runs.

### Core map pickups and abilities

- **Jayden Gun:** Use this when a chaser is closing in and you need a
  stun window. It is a temporary pickup, not a permanent weapon, and it
  is best used to break pressure or open a route through a crowded map.
- **Taco Bell Grande / Shart Knocker:** Eat Taco Bell on Level 4+ when
  you want a short-range panic blast. It gives you a charge that can
  stun the nearest chaser, which is useful when the runner is boxed in
  or needs a forceful reset.
- **Rod of Poopdom:** Use this when a short reposition is safer than
  trying to weave through a chase. It teleports you forward a limited
  distance, but it cannot go through walls and has a Stinky cooldown.
- **Heavy Plunger:** Use this when a chaser gets too close and you want
  a knockback rather than a ranged stun. It is a close-range, timing-
  heavy escape tool.
- **Soggy Toilet Paper:** Use this when you want to leave a slow zone
  behind you. It is strongest in a chase path, because chasers who step
  in the trail lose speed.
- **Schleimy Potion:** Use this when a tight wall gap or pinch point is
  the best escape line. It shrinks your hitbox so you can slip through
  tighter spaces, but you pay for that with slower movement.
- **Decoy:** Use this when you want to redirect chaser attention away
  from your path. It buys breathing room by pulling nearby chasers toward
  a fake target spot.
- **Gawd Particle:** Use this on Level 5+ when the map is crowded and
  you need the strongest short-term escape tool. It lets you run through
  walls for a few seconds and punishes chaser contact instead of
  capturing you.
- **Turdstone Token:** Hold this when you want a safety net against one
  bad mistake. If you get caught while holding it, it saves the run once
  instead of letting the death fully land.
- **Rolling pickups:** Treat the wandering mushroom/bomb-style items as
  moving wildcard pickups. Some are helpful and some are harmful, so
  they’re best approached as a decision point rather than a guaranteed
  reward.

## Economy & risk (Level 4+)

- Getting caught costs sheebs and skreems. Above Level 3, sheebs can go
  **negative** (debt).
- Above Level 4, captures can also strip a purchased shop item from your
  profile.
- The Shleeb shop sells permanent stat upgrades that persist in your save.
