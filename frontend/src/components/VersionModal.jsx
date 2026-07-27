const PAST_VERSION_NOTES = [
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
