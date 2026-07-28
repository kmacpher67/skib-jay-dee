import { useState } from 'react'

const MAX_REWARDS = 20

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleString()
}

export default function RewardsHistoryModal({ rewardsHistory, badgeAwardCounts, onClose }) {
  const [activeTab, setActiveTab] = useState('history')
  const recentRewards = [...(Array.isArray(rewardsHistory) ? rewardsHistory : [])].slice(-MAX_REWARDS).reverse()

  const allRewards = Array.isArray(rewardsHistory) ? rewardsHistory : []
  const pickupStats = {}
  allRewards.forEach(r => {
    if (r.type === 'pickup') {
      pickupStats[r.label] = (pickupStats[r.label] || 0) + 1
    }
  })
  const pickupEntries = Object.entries(pickupStats).sort((a, b) => b[1] - a[1])

  const totalBadgeAwards = badgeAwardCounts 
    ? Object.values(badgeAwardCounts).reduce((sum, count) => sum + count, 0)
    : 0

  return (
    <div className="deaths-modal rewards-modal" role="dialog" aria-modal="true" aria-label="Rewards history">
      <div className="deaths-panel rewards-panel" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="deaths-header rewards-header">
          <div>
            <p className="eyebrow">REWARDS LOG</p>
            <h2>History & Stats.</h2>
          </div>
          <button className="close-pill" onClick={onClose} aria-label="Close rewards history">
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button 
            className={`play-btn ${activeTab === 'history' ? '' : 'chaser-btn'}`}
            style={{ padding: '8px 16px', fontSize: '1rem', flex: 1 }}
            onClick={() => setActiveTab('history')}
          >
            HISTORY
          </button>
          <button 
            className={`play-btn ${activeTab === 'stats' ? '' : 'chaser-btn'}`}
            style={{ padding: '8px 16px', fontSize: '1rem', flex: 1 }}
            onClick={() => setActiveTab('stats')}
          >
            LIFETIME STATS
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {activeTab === 'history' ? (
            <>
              <p className="version-note">Most recent 20 rewards and purchases.</p>
              {totalBadgeAwards > 0 && (
                <div style={{ fontSize: '0.9rem', marginBottom: '8px', color: '#888' }}>
                  Badge awards: {totalBadgeAwards}
                </div>
              )}
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
                        {entry.amount != null && entry.amount !== 0 && (
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
            </>
          ) : (
            <>
              <p className="version-note">Lifetime pickups collected.</p>
              {pickupEntries.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {pickupEntries.map(([type, count]) => (
                    <div key={type} style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '4px' }}>
                      <span style={{ fontWeight: 'bold' }}>{type}</span>: {count}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="deaths-empty rewards-empty">No pickups found yet.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
