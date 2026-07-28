import { BADGES } from '../gameContent.js'

export default function PlayRecapModal({ stats, onClose }) {
  const pickupEntries = Object.entries(stats.pickups || {})
  const hasBadges = stats.badges && stats.badges.length > 0
  const hasPickups = pickupEntries.length > 0
  
  return (
    <div className="deaths-modal rewards-modal" role="dialog" aria-modal="true" aria-label="Play Recap">
      <div className="deaths-panel rewards-panel">
        <div className="deaths-header rewards-header">
          <div>
            <p className="eyebrow">LEVEL CLEAR</p>
            <h2>Play Recap.</h2>
          </div>
        </div>

        <p className="version-note">Here's how you did this run.</p>

        <div className="deaths-list rewards-list" style={{ marginTop: '16px', flex: '1', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div className="recap-section">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#ffd54a' }}>Totals</h3>
            <div style={{ display: 'flex', gap: '16px', fontSize: '1.1rem' }}>
              <span style={{ color: '#2ecc71' }}>+{stats.sheebsEarned || 0} Sheebs</span>
              <span style={{ color: '#ff2e2e' }}>+{Math.floor(stats.skreemsEarned || 0)} Skreems</span>
            </div>
          </div>

          {hasBadges && (
            <div className="recap-section">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#ffd54a' }}>Badges Earned</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {stats.badges.map((badgeId, i) => {
                  const b = BADGES[badgeId]
                  return (
                    <div key={i} style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.5rem' }}>{b?.emoji || '🏅'}</span>
                      <span>{b?.name || badgeId}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="recap-section">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#ffd54a' }}>Pickups Found</h3>
            {hasPickups ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {pickupEntries.map(([type, entry]) => (
                  <div key={type} style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '4px' }}>
                    <span style={{ fontWeight: 'bold' }}>{type}</span>: {entry.count}
                    {entry.outcome === 'bad' && <span style={{ marginLeft: '6px', fontSize: '0.9rem', color: '#ff2e2e' }}> (skill issue)</span>}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#aaa', fontStyle: 'italic', margin: 0 }}>Nothing found this run.</p>
            )}
          </div>
          
        </div>

        <button className="play-btn" onClick={onClose} style={{ marginTop: '20px', width: '100%' }}>
          CONTINUE
        </button>
      </div>
    </div>
  )
}
