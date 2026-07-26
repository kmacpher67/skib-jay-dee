import { getChaserProfile } from '../gameContent.js'

const MAX_DEATHS = 10

function formatDeathTime(timestamp) {
  return new Date(timestamp).toLocaleString()
}

export default function DeathsModal({ deathsHistory, onViewProfile, onClose }) {
  const recentDeaths = [...(Array.isArray(deathsHistory) ? deathsHistory : [])].slice(-MAX_DEATHS).reverse()

  return (
    <div className="deaths-modal" role="dialog" aria-modal="true" aria-label="Deaths history">
      <div className="deaths-panel">
        <div className="deaths-header">
          <div>
            <p className="eyebrow">DEATHS LOG</p>
            <h2>Recent captures.</h2>
          </div>
          <button className="close-pill" onClick={onClose} aria-label="Close deaths history">
            ✕
          </button>
        </div>

        <p className="version-note">Most recent 10 captures are saved with their level and time.</p>

        {recentDeaths.length > 0 ? (
          <div className="deaths-list">
            {recentDeaths.map((entry, index) => (
              <article key={`${entry.timestamp}-${entry.levelName}-${index}`} className="death-card">
                <div className="death-card-top">
                  <time className="death-time" dateTime={new Date(entry.timestamp).toISOString()}>
                    {formatDeathTime(entry.timestamp)}
                  </time>
                  <p className="death-level">Level: {entry.levelName || `#${entry.level || '?'}`}</p>
                  {entry.chaserId && (
                    <button
                      type="button"
                      className="death-killer-pill"
                      onClick={() => onViewProfile?.(entry.chaserId)}
                    >
                      Killer ID: {entry.chaserId}
                      <span className="death-killer-name">{getChaserProfile(entry.chaserId).name}</span>
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="deaths-empty">No deaths yet.</p>
        )}
      </div>
    </div>
  )
}
