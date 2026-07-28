const PAST_VERSION_NOTES = [
  {
    version: 'v0.4.69',
    title: 'Chaser Beta implementation',
    description: 'Fully isolated Chaser Mode from the main campaign progress (sheebs, badges, history) so it doesn\'t pollute your stats. The AI runner also now targets guns and fires back.',
  },
  {
    version: 'v0.4.68',
    title: 'Level 4 Warning Audio',
    description: 'Added audio stings to the Level 4 warning overlay. The warning now plays a sting and voiceover when it opens, and a voice line when you accept your fate.',
  },
  {
    version: 'v0.4.67',
    title: 'Pickup Tracking & Play Recap',
    description: 'Added a Play Recap modal when you clear a level or exit to the menu to show your stats for that run. Also added a Stats tab in the Rewards modal to show your lifetime pickups consumed.',
  },
  {
    version: 'v0.4.64.3',
    title: 'Level 4 Warning Visibility Fix',
    description: 'The Level 4 warning overlay had no CSS positioning and was rendering invisibly underneath the canvas — the game paused correctly but there was nothing visible to click to resume. Added proper full-screen modal styling.',
  },
  {
    version: 'v0.4.64.2',
    title: 'Level 4 Warning Hotfix, Part 2',
    description: 'Fixed a race condition where the Level 4 warning pause, triggered mid-frame during a natural level-up, silently re-armed the game loop and left keyboard/touch input dead even after dismissing the warning.',
  },
  {
    version: 'v0.4.64.1',
    title: 'Level 4 Warning Hotfix',
    description: 'Fixed an issue where the game lost keyboard and touch input on the Ramen Aisle after dismissing the Level 4 warning overlay.',
  },
  {
    version: 'v0.4.64',
    title: 'Debug State Dump',
    description: 'Added a Triple-Q trigger to instantly dump the game state for bug tracking. Press Q three times rapidly during a run to copy your position, level, and chaser data directly to the clipboard.',
  },
  {
    version: 'v0.4.63',
    title: 'Main Menu UI Cleanup',
    description: 'Refined the main menu layout. Moved the mute toggle next to the character portraits and organized the five profile stats into a clean, compact row for better mobile viewing.',
  },
  {
    version: 'v0.4.62',
    title: 'Rewards Clarification',
    description: 'Added "from Shleeb Shop" labels to the Speed, Stamina, and Rewards pills to clarify that they reflect permanent stat upgrades from the shop, not temporary map buffs. Renamed QUICK PLAY to PLAY AS RUNNER to distinguish it from the new Chaser beta mode.',
  },
  {
    version: 'v0.4.61',
    title: 'Play as Chaser (Beta)',
    description: 'Fixed human chaser movement. Added basic wall-aware AI for the runner. Limited chaser mode to a strict 1v1 60-second capture/timeout loop with a rematch/menu result card.',
  },
  {
    version: 'v0.4.60',
    title: 'Difficulty Selector UI',
    description: 'Added a Difficulty Selector control to the main menu allowing you to choose between Noob-Noob, Casual, and 4chan-st.',
  },
  {
    version: 'v0.4.59',
    title: 'Neon Jump-Scare Upgrade',
    description: 'The Neon Jump-Scare Filter is now a real perk! Bribe the filter after a scare for a 0.5s headstart. Costs 50 sheebs each escape.',
  },
  {
    version: 'v0.4.57',
    title: 'Rod of Poopdom Hotfix',
    description: 'Fixed a bug where the Rod of Poopdom\'s warp cooldown never decremented, preventing the rod from being used more than once per level. Also fixed smoke effects lingering forever.',
  },
  {
    version: 'v0.4.56',
    title: 'Runner Pose Pool Collapse',
    description: 'Simplified the runner face pool to 3 distinct poses (default, skibby, and captured).',
  },
  {
    version: 'v0.4.55',
    title: 'Micro-Skib Chaser',
    description: 'Introduced the Micro-Skib, a smaller and slower chaser with a 15% chance to spawn starting on Level 3.',
  },
  {
    version: 'v0.4.54',
    title: 'Near-Miss Burst',
    description: 'Added a near-miss particle burst and subtle vignette pulse when escaping a close call.',
  },
  {
    version: 'v0.4.52',
    title: 'The Turdstone Token',
    description: 'New Epic/Rare map pickup — the porcelain tombstone. Pick it up and it holds in the background passively. Get caught while holding it and the Turdstone intercepts the death: your level stays the same, your loadout is safe, your sheebs are untouched. Single-use. A "SAVED BY THE TURDSTONE!" overlay + HUD badge let you know it\'s active. Spawn rate scales from 1% (L1) to 5% (L6).',
  },
  {
    version: 'v0.4.51',
    title: 'Wall-Pinch Collision Traps',
    description: 'Sealed two unreachable sub-40px corridor pinches in Ramen Aisle and Jayden\'s Nightmare House that trapped runners mid-map (looked like a collision bug, was map data).',
  },
  {
    version: 'v0.4.50',
    title: 'Neon Jump-Scare Filter',
    description: 'New cosmetic shop item (200 sheebs) tints your capture jump-scare overlay magenta/cyan. Also fixed the portrait frame clipping footer controls on wide desktop viewports.',
  },
  {
    version: 'v0.4.48',
    title: 'Gameplay Rebalancing',
    description: 'Gun hits pay +25 sheebs, new badges pay +50, death penalties scale by level (L1 free through L4+ costing 30), chasers start slower with per-level speed caps, and level-clear rewards are bumped across all six levels.',
  },
  {
    version: 'v0.4.43',
    title: "Player's Guide",
    description: "Added an in-game Player's Guide modal (menu footer link) explaining guns, level transitions, Level 5+ wall-hacks, and the Shart Knocker — including that the orange FART button is not a protective shield.",
  },
  {
    version: 'v0.4.42',
    title: 'Menu Brag Stat',
    description: 'Added a Best Run stat to the main menu that tracks the highest level you reached in a single run and the fewest deaths it took to get there.',
  },
  {
    version: 'v0.4.41',
    title: 'Rewards & History Panel',
    description: 'Added a new Rewards & History modal. You can now tap the Rewards pill on the bottom HUD to see a chronological log of all the badges you\'ve earned and shop items you\'ve purchased.',
  },
  {
    version: 'v0.4.40',
    title: 'The Shart Knocker',
    description: 'Added the Shart Knocker ability! Eat a Taco Bell Grande on Level 4+ to charge it, then hit F/FIRE to unleash a blast that stuns the nearest Skib. Comes with a brand new Flaming Ass badge for your first hit.',
  },
  {
    version: 'v0.4.39.1',
    title: 'Level 4 spawn fix',
    description: 'Fixed an issue where the runner spawned inside a wall at the start of Level 4.',
  },
  {
    version: 'v0.4.38',
    title: 'Level 6: Nightmare House & Skib-Daddy',
    description: 'Migrated the remaining maps to the grid system, added Jayden\'s Nightmare House, and introduced Skib-Daddy with Plunger Launch plus the Garage Survivor badge.',
  },

  {
    version: 'v0.4.37',
    title: 'Close-Call Freeze & Rewards',
    description: 'Added a 1-second breather after a close call so you can re-center your fingers. Clean escapes pay +50 sheebs and the Slippery When Wet badge, and picking up positive items pays +5 sheebs.',
  },
  {
    version: 'v0.4.36.1',
    title: 'Soggy TP, Heavy Plunger & Friendly Fire',
    description: 'Step in a Soggy Toilet Paper trail to leave a slick that slows any toilet who steps in it. Grab a Heavy Plunger and press FIRE to swing a knockback arc. And watch your timing with the Jayden Gun — get caught by the exact toilet you just stunned the instant it wakes up, and you’ll earn the "Friendly Fire" badge.',
  },
  {
    version: 'v0.4.36',
    title: 'Taco Bell, Decoys & Map Refactor',
    description: 'Added Taco Bell & Decoy pickups to help you survive. We also refactored the map generation code to clean up pixel spaghetti and tucked away a few new secret badges for you to find.',
  },
  {
    version: 'v0.4.35',
    title: 'Rolling Pickups & Schleimy Potion',
    description: 'Watch out for Mario-style rolling items bouncing around the map—some help, some hurt. Find the rare Schleimy Potion to shrink your hitbox and slip through tight gaps, at the cost of your speed.',
  },
  {
    version: 'v0.4.34',
    title: 'Level 5+: Wall Hacks & the Gawd Particle',
    description: 'Starting at Level 5, the toilets stop respecting walls and move faster. Find the ultra-rare Gawd Particle to flip the script: run through walls yourself for 10 seconds, and touching a chaser despawns it instead of catching you (it respawns after 15s).',
  },
  {
    version: 'v0.4.33',
    title: 'Quest Room badges + Level 4+ survival floor',
    description: 'Ramen Aisle and World Star Parking Lot now hide a guaranteed landmark badge in their own quest room. Level 4 and beyond also need a scaling survival-time floor with all 5 toilets active before you can advance, on top of the skreems goal.',
  },
  {
    version: 'v0.4.32',
    title: 'Explore for badges',
    description: 'Levels 1-3 now hide a mandatory badge pickup somewhere on the map — find it before you can move on. Keep an eye out for rare, optional humor badges too, like the Mysterious Plunger and the Golden TP.',
  },
  {
    version: 'v0.4.31',
    title: 'The Jayden Gun + Lucky Charm',
    description: 'Find the Jayden Gun on the map and press F (or the FIRE button) to stun a chaser for a few seconds. The new Lucky Charm shop items boost the odds of finding it, and earn the "Lucky" badge when your luck pays off.',
  },
  {
    version: 'v0.4.29',
    title: 'Multiple save slots',
    description: 'Tap your username on the menu to see every profile saved in this browser, switch between them, or start a new one.',
  },
  {
    version: 'v0.4.28',
    title: 'Level 4 warning screen lands',
    description: 'The game now pauses and displays a warning overlay the first time a player reaches The Ramen Aisle, explaining debt and item loss mechanics.',
  },
  {
    version: 'v0.4.26',
    title: 'Sheebs debt and item loss risk',
    description: 'Sheebs can now go negative (debt) on capture once past level 3, and captures above level 4 can strip a purchased shop item.',
  },
  {
    version: 'v0.4.25',
    title: 'Post-kill profile pages land',
    description: 'Captures now pause on a reusable profile card, the deaths log shows killer IDs as clickable chips, and profiles can be reopened from history.',
  },
  {
    version: 'v0.4.21',
    title: 'Deaths history log lands',
    description: 'The Deaths pill now opens a modal that shows the latest capture records with timestamps and level names.',
  },
  {
    version: 'v0.4.20',
    title: 'GameEngine cleanup and Sheebs penalty',
    description: 'The dead initialSheebs default is gone, and captures now subtract a flat 20 sheebs alongside the skreem loss.',
  },
  {
    version: 'v0.4.19',
    title: 'Dad Case gets real sound',
    description: 'The door-slam text stub is gone — Dad Case now plays real door-slam and lights-out audio when it joins the chase.',
  },
  {
    version: 'v0.4.18',
    title: 'Version page lands',
    description: 'Menu now opens a small build log showing the current GAME_ITERATION and recent shipped changes.',
  },
  {
    version: 'v0.4.17',
    title: 'Dad Case traps',
    description: 'The Dad Case chaser now darkens the screen and stubs a door-slam sound in text when it joins the chase.',
  },
  {
    version: 'v0.4.16',
    title: 'Sheebs + skreem fixes',
    description: 'Fresh profiles start at 0 sheebs, and the menu scream loop now primes silently instead of playing forever.',
  },
  {
    version: 'v0.4.15',
    title: 'Pipeworks gate tightened',
    description: 'The lvl2 transition waits for the hall-coverage and 4-skib survival gate before it mounts.',
  },
  {
    version: 'v0.4.14',
    title: 'Upload faces now crop cleanly',
    description: 'Uploaded runner and chaser photos are masked into an oval instead of stretching as raw squares.',
  },
]

export default function VersionModal({ iteration, onClose }) {
  const versionNotes = PAST_VERSION_NOTES

  return (
    <div className="version-modal" role="dialog" aria-modal="true" aria-label="Version log">
      <div className="version-panel">
        <div className="version-header">
          <div>
            <p className="eyebrow">VERSION LOG</p>
            <h2>What shipped lately.</h2>
          </div>
          <button className="close-pill" onClick={onClose} aria-label="Close version log">
            ✕
          </button>
        </div>

        <p className="version-build">Current build: {iteration}</p>
        <p className="version-note">Short changelog, mirrored from the shipped session ledger.</p>

        <div className="version-list">
          {versionNotes.map((note) => (
            <article key={note.version} className="version-card">
              <div className="version-card-top">
                <span className="version-tag">{note.version}</span>
                <h3>{note.title}</h3>
              </div>
              <p>{note.description}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
