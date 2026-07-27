const MAX_REWARDS = 20

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleString()
}

export default function RewardsHistoryModal({ rewardsHistory, onClose }) {
  const recentRewards = [...(Array.isArray(rewardsHistory) ? rewardsHistory : [])].slice(-MAX_REWARDS).reverse()

  return (
    <div className="deaths-modal rewards-modal" role="dialog" aria-modal="true" aria-label="Rewards history">
      <div className="deaths-panel rewards-panel">
        <div className="deaths-header rewards-header">
          <div>
            <p className="eyebrow">REWARDS LOG</p>
            <h2>History.</h2>
          </div>
          <button className="close-pill" onClick={onClose} aria-label="Close rewards history">
            ✕
          </button>
        </div>

        <p className="version-note">Most recent 20 rewards and purchases.</p>

        {recentRewards.length > 0 ? (
          <div className="deaths-list rewards-list">
            {recentRewards.map((entry, index) => (
              <article key={`${entry.timestamp}-${entry.type}-${index}`} className="death-card reward-card">
                <div className="death-card-top reward-card-top">
                  <time className="death-time reward-time" dateTime={new Date(entry.timestamp).toISOString()}>
                    {formatTime(entry.timestamp)}
                  </time>
                  <p className="death-level reward-level" style={{ marginTop: '4px', fontWeight: 'bold' }}>
                    {entry.type.toUpperCase()}: {entry.label}
                  </p>
                  {entry.amount != null && (
                    <span className="reward-amount" style={{ color: entry.amount > 0 ? '#2ecc71' : (entry.amount < 0 ? '#ff2e2e' : '#fff'), fontWeight: 'bold', display: 'block', marginTop: '4px' }}>
                      {entry.amount > 0 ? `+${entry.amount}` : entry.amount} Sheebs
                    </span>
                  )}
                </div>
                {entry.level != null && (
                  <div className="death-telemetry reward-telemetry" style={{ fontSize: '0.8rem', color: '#888', marginTop: '6px' }}>
                    <span>Level: {entry.levelName || `#${entry.level}`}</span>
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <p className="deaths-empty rewards-empty">No rewards yet.</p>
        )}
      </div>
    </div>
  )
}
