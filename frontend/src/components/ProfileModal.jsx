import { CHASER_FACE_POOL, getChaserProfile } from '../gameContent.js'

export default function ProfileModal({ profile, mode = 'caught', onPrimary, onClose }) {
  if (!profile) return null

  const chaserProfile = getChaserProfile(profile.chaserId)
  const displayName = profile.chaserName || chaserProfile.name
  const faceSrc =
    CHASER_FACE_POOL.find((entry) => entry.id === profile.chaserId)?.src ||
    profile.chaserFaceSrc ||
    null
  const primaryLabel = mode === 'caught' ? 'CONTINUE' : 'BACK TO LOG'
  const note = mode === 'caught'
    ? 'This toilet cleanup killen gets logged in your profile before the menu comes back.'
    : 'Tap back to return to the deaths log after checking the killer profile.'

  return (
    <div className="profile-modal" role="dialog" aria-modal="true" aria-label="Chaser profile">
      <div className="profile-panel">
        <div className="profile-header">
          <div>
            <p className="eyebrow">POST-KILL PROFILE</p>
            <h2>{displayName}</h2>
          </div>
          <button className="close-pill" onClick={onClose} aria-label="Close chaser profile">
            ✕
          </button>
        </div>

        <div className="profile-media">
          {faceSrc ? (
            <img className="profile-portrait" src={faceSrc} alt={displayName} />
          ) : (
            <div className="profile-portrait profile-portrait-fallback">NO PHOTO</div>
          )}
        </div>

        <p className="profile-vibe">{chaserProfile.vibe}</p>
        <p className="profile-note">
          {note}
          {profile.levelName ? ` Level: ${profile.levelName}.` : ''}
        </p>

        <div className="profile-section">
          <h3>Main scare</h3>
          <p>{chaserProfile.mainScare}</p>
        </div>

        <div className="profile-section">
          <h3>Killing tricks</h3>
          <p>{chaserProfile.tricks}</p>
        </div>

        {profile.captureLine && (
          <p className="profile-quote">Capture line: {profile.captureLine}</p>
        )}

        <button className="play-btn" onClick={onPrimary}>
          {primaryLabel}
        </button>
      </div>
    </div>
  )
}
