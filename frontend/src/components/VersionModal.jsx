const PAST_VERSION_NOTES = [
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
  const versionNotes = [
    {
      version: iteration,
      title: 'Version page lands',
      description: 'Menu now opens a small build log showing the current GAME_ITERATION and recent shipped changes.',
    },
    ...PAST_VERSION_NOTES,
  ]

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
