const GUIDE_SECTIONS = [
  {
    title: 'Controls',
    body: [
      'Move with arrow keys, WASD, or the on-screen joystick (bottom-left).',
      'Sprint with Space or hold the SPRINT button (bottom-right).',
      'Press F or tap the FIRE button to shoot or use a charged attack when one is available.',
    ],
  },
  {
    title: 'Weapons & ammo (Jayden Gun)',
    body: [
      'The Jayden Gun is a rare map pickup. Lucky Charm shop items improve the odds of finding one.',
      'Each pickup gives 1 or 2 shots — not a permanent weapon.',
      'Picking up a new gun replaces your current gun entirely. Leftover ammo does not stack.',
      'When ammo hits zero, the gun vanishes until you find another pickup.',
      'Fire in the direction you are facing to stun a chaser for a few seconds.',
    ],
  },
  {
    title: 'Level transitions',
    body: [
      'Clearing a level loads the next map immediately.',
      'Uncollected pickups on the ground are lost — grab loot before you advance.',
      'Sheebs, shop items, badges, and your death count carry over within the same run.',
    ],
  },
  {
    title: 'Wall-hacking Skibs (Level 5+)',
    body: [
      'From Level 5 onward, chasers can move through walls and run a bit faster.',
      'On Levels 1–4, chasers still respect walls like you do.',
      'The rare Gawd Particle (Level 5+ only) lets you run through walls for 10 seconds, glow gold, and despawn chasers on contact instead of getting caught. They respawn after about 15 seconds.',
    ],
  },
  {
    title: 'Shart Knocker (orange FART button)',
    body: [
      'On Level 4+, a Taco Bell Grande grants one Shart charge (plus its speed boost).',
      'When charged, the FIRE button turns orange and reads FART.',
      'One tap fires a single instant blast that stuns the nearest chaser in range for 3–12 seconds. Hits pay +50 sheebs; misses still pay +5.',
      'The orange FART button is not a protective shield. Any lingering brown or orange circle afterward is leftover visual feedback — it does not block captures. Other chasers can still grab you.',
    ],
  },
  {
    title: 'Other pickups',
    body: [
      'Heavy Plunger: swing with FIRE for knockback (replaces the gun while held).',
      'Soggy Toilet Paper: leaves a trail that slows chasers.',
      'Schleimy Potion: shrinks your hitbox to slip through tight gaps (slower while active).',
      'Decoy: pulls chaser attention to a spot for a few seconds.',
      'Rolling pickups: bouncing items that may help or hurt — grab at your own risk.',
    ],
  },
  {
    title: 'Economy & risk (Level 4+)',
    body: [
      'Captures cost sheebs and skreems. Above Level 3, sheebs can go negative (debt).',
      'Above Level 4, captures can strip a purchased shop item from your profile.',
      'Shleeb shop upgrades persist in your save between sessions.',
    ],
  },
]

export default function PlayersGuideModal({ onClose }) {
  return (
    <div className="deaths-modal players-guide-modal" role="dialog" aria-modal="true" aria-label="Player's guide">
      <div className="deaths-panel players-guide-panel">
        <div className="deaths-header">
          <div>
            <p className="eyebrow">PLAYER&apos;S GUIDE</p>
            <h2>How things work.</h2>
          </div>
          <button className="close-pill" onClick={onClose} aria-label="Close player's guide">
            ✕
          </button>
        </div>

        <p className="version-note">Mechanics that are easy to miss when learning by trial and error.</p>

        <div className="players-guide-list">
          {GUIDE_SECTIONS.map((section) => (
            <article key={section.title} className="players-guide-section">
              <h3>{section.title}</h3>
              <ul>
                {section.body.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
