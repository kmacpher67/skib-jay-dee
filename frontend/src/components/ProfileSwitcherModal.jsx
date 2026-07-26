import { useState } from 'react'

function displayName(entry) {
  return entry.label || entry.userId
}

export default function ProfileSwitcherModal({ profiles, activeUserId, onSwitch, onCreate, onClose }) {
  const [newLabel, setNewLabel] = useState('')

  const handleCreate = () => {
    onCreate(newLabel)
    setNewLabel('')
  }

  return (
    <div className="deaths-modal profile-switcher-modal" role="dialog" aria-modal="true" aria-label="Switch profile">
      <div className="deaths-panel profile-switcher-panel">
        <div className="deaths-header">
          <div>
            <p className="eyebrow">PROFILES ON THIS DEVICE</p>
            <h2>Switch or create a save.</h2>
          </div>
          <button className="close-pill" onClick={onClose} aria-label="Close profile switcher">
            ✕
          </button>
        </div>

        <p className="version-note">
          Profiles are saved in this browser only — sheebs, items, and deaths history don&apos;t follow you to
          another device yet.
        </p>

        <div className="deaths-list">
          {profiles.map((entry) => {
            const isActive = entry.userId === activeUserId
            return (
              <article key={entry.userId} className={`death-card profile-switcher-card${isActive ? ' active' : ''}`}>
                <div className="death-card-top">
                  <p className="death-level">{displayName(entry)}</p>
                  <p className="version-note" style={{ margin: 0 }}>
                    Level {entry.highestLevel} · {entry.sheebs} sheebs · {entry.deaths} deaths
                  </p>
                </div>
                {isActive ? (
                  <span className="version-tag">ACTIVE</span>
                ) : (
                  <button type="button" className="death-killer-pill" onClick={() => onSwitch(entry.userId)}>
                    Play as this profile
                  </button>
                )}
              </article>
            )
          })}
        </div>

        <div className="profile-switcher-create">
          <input
            type="text"
            className="profile-switcher-input"
            placeholder="New profile nickname (optional)"
            value={newLabel}
            maxLength={24}
            onChange={(e) => setNewLabel(e.target.value)}
          />
          <button type="button" className="shop-btn" onClick={handleCreate}>
            + NEW PROFILE
          </button>
        </div>
      </div>
    </div>
  )
}
