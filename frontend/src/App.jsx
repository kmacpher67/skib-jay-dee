import { useEffect, useRef, useState } from 'react'
import FaceUpload from './components/FaceUpload.jsx'
import GameCanvas from './components/GameCanvas.jsx'
import ProfileModal from './components/ProfileModal.jsx'
import ProfileSwitcherModal from './components/ProfileSwitcherModal.jsx'
import DeathsModal from './components/DeathsModal.jsx'
import RewardsHistoryModal from './components/RewardsHistoryModal.jsx'
import ShopModal from './components/ShopModal.jsx'
import VersionModal from './components/VersionModal.jsx'
import skreemLoopUrl from './assets/audio/jayden-skreem-loop.m4a'
import captureStingUrl from './assets/audio/capture-sting-final.mp3'
import levelStartUrl from './assets/audio/level-start-igottago.mp3'
import levelClearUrl from './assets/audio/level-win-cant-catch-me.mp3'
import boostStartUrl from './assets/audio/boost-start-igottago-x2.mp3'
import tiredUrl from './assets/audio/runner-tired-run.mp3'
import shartKnockerStubUrl from './assets/audio/shart-knocker-stub.mp3'
import chaseAmbientUrl from './assets/audio/chase-ambient-bopbop.mp3'
import chaserBarkCloseUrl from './assets/audio/chaser-bark-close-toiletking.mp3'
import chaserBarkMissAUrl from './assets/audio/chaser-bark-miss-ayayay.mp3'
import chaserBarkMissBUrl from './assets/audio/chaser-bark-miss-getoutofhere.mp3'
import chaserScreamUrl from './assets/audio/chaser-scream-freakout.mp3'
import chaserTauntUrl from './assets/audio/chaser-taunt-skibidforever.mp3'
import lvl2TransitionUrl from './assets/video/lvl2-transition.mp4'
import dadCaseDoorUrl from './assets/audio/door-sounds.m4a'
import dadCaseLightsUrl from './assets/audio/lights.m4a'
import warningBgUrl from './assets/level-4-warning-transition-screen.jpeg'
import {
  CHASER_FACE_POOL,
  buildLoadout,
  getChaserProfile,
  SHOP_ITEMS,
  randomFaces,
  BADGES,
} from './gameContent.js'
import { GAME_ITERATION } from './version.js'
import { loadProfile, persistProfile, listProfiles, switchProfile, createProfile } from './lib/cookies.js'
import { LEVEL_4_RULES } from './dialog.js'
import './App.css'

const CHASER_BARK_URLS = [
  chaserBarkCloseUrl,
  chaserBarkMissAUrl,
  chaserBarkMissBUrl,
  chaserScreamUrl,
  chaserTauntUrl,
]

export default function App() {
  const [profile, setProfile] = useState(() => loadProfile())
  const [screen, setScreen] = useState('menu')
  const [shopOpen, setShopOpen] = useState(false)
  const [versionOpen, setVersionOpen] = useState(false)
  const [deathsOpen, setDeathsOpen] = useState(false)
  const [rewardsHistoryOpen, setRewardsHistoryOpen] = useState(false)
  const [runnerFaceSelection, setRunnerFaceSelection] = useState(() => randomFaces().runnerFace)
  const [chaserFaceSelection, setChaserFaceSelection] = useState(() => randomFaces().chaserFace)
  const [runnerIsCustom, setRunnerIsCustom] = useState(false)
  const [chaserIsCustom, setChaserIsCustom] = useState(false)
  const [lastCaptureLine, setLastCaptureLine] = useState('')
  const [showLvl2Transition, setShowLvl2Transition] = useState(false)
  const [dadCaseSpawned, setDadCaseSpawned] = useState(false)
  const [isChaserMode, setIsChaserMode] = useState(false)
  const [showLevel4Warning, setShowLevel4Warning] = useState(false)
  const [activeBadgeToast, setActiveBadgeToast] = useState(null)
  const hasSeenLevel4WarningRef = useRef(false)
  const sessionDeathsRef = useRef(0)
  const turdstoneOverlayRef = useRef(false)
  const [showTurdstoneOverlay, setShowTurdstoneOverlay] = useState(false)
  const [profileModal, setProfileModal] = useState(null)
  const [profileModalMode, setProfileModalMode] = useState(null)
  const [profileSwitcherOpen, setProfileSwitcherOpen] = useState(false)
  const loadout = buildLoadout(profile.ownedItems)
  const engineRef = useRef(null)
  const muted = profile.muted
  const mutedRef = useRef(muted)
  mutedRef.current = muted
  const menuAudioRef = useRef(null)
  const catchAudioRef = useRef(null)
  const oneShotPoolRef = useRef(new Map())
  const ambientAudioRef = useRef(null)
  const ambientDelayTimerRef = useRef(null)
  const ambientArmedRef = useRef(false)

  const syncProfile = (updater) => {
    setProfile((current) => {
      const nextProfile = persistProfile(
        typeof updater === 'function' ? updater(current) : updater,
      )
      return nextProfile
    })
  }

  const getAudio = (ref, url, loop, volume) => {
    if (!ref.current) {
      const audio = new Audio(url)
      audio.preload = 'auto'
      audio.loop = loop
      audio.volume = volume
      ref.current = audio
    }

    return ref.current
  }

  const playAudio = (audio, restart = true) => {
    if (!audio || mutedRef.current) return
    if (!restart && !audio.paused) return
    audio.currentTime = 0
    audio.play().catch(() => {})
  }

  // One preloaded <Audio> per one-shot clip URL, reused across triggers so
  // repeated barks/stings don't re-decode the file every time.
  const playOneShot = (url, volume = 0.4) => {
    if (mutedRef.current) return
    let audio = oneShotPoolRef.current.get(url)
    if (!audio) {
      audio = new Audio(url)
      audio.preload = 'auto'
      audio.volume = volume
      oneShotPoolRef.current.set(url, audio)
    }
    audio.currentTime = 0
    audio.play().catch(() => {})
  }

  const playRandomOneShot = (urls, volume) => {
    playOneShot(urls[Math.floor(Math.random() * urls.length)], volume)
  }

  // Primes the audio element on the first user gesture so browsers allow
  // playback later; must stay silent and non-looping or it becomes an
  // unwanted permanent scream loop on the menu screen.
  const startMenuAudio = () => {
    if (mutedRef.current) return
    const audio = getAudio(menuAudioRef, skreemLoopUrl, false, 0)
    if (!audio.paused) return
    audio.currentTime = 0
    audio.play().then(() => audio.pause()).catch(() => {})
  }

  const playCaughtAudio = () => {
    playAudio(getAudio(catchAudioRef, captureStingUrl, false, 0.45))
  }

  const handleBoostStart = () => playOneShot(boostStartUrl, 0.35)
  const handleTired = () => playOneShot(tiredUrl, 0.35)
  const handleShart = () => playOneShot(shartKnockerStubUrl, 0.5)
  const handleChaserBark = () => playRandomOneShot(CHASER_BARK_URLS, 0.32)
  const handleLevelClear = ({ index, showLvl2Transition = false } = {}) => {
    playOneShot(levelClearUrl, 0.4)
    if (index === 2) setShowLvl2Transition(!!showLvl2Transition)

    syncProfile((current) => {
      const bestRun = current.bestRun || { level: 1, deaths: 0 }
      const sessionDeaths = sessionDeathsRef.current
      if (index > bestRun.level || (index === bestRun.level && sessionDeaths < bestRun.deaths)) {
        return {
          ...current,
          bestRun: { level: index, deaths: sessionDeaths }
        }
      }
      return current
    })
  }

  const handleLevelChangeAudio = () => playOneShot(levelStartUrl, 0.35)

  const startAmbientAudio = () => {
    if (!ambientArmedRef.current) return
    playAudio(getAmbientAudio(), false)
  }

  const armAmbientAudio = () => {
    ambientArmedRef.current = true
    startAmbientAudio()
  }

  const toggleMuted = () => {
    syncProfile((current) => ({ ...current, muted: !current.muted }))
  }

  const handlePlay = (asChaser = false) => {
    setIsChaserMode(asChaser)
    const nextFaces = randomFaces()
    if (!runnerIsCustom) setRunnerFaceSelection(nextFaces.runnerFace)
    if (!chaserIsCustom) setChaserFaceSelection(nextFaces.chaserFace)
    setShopOpen(false)
    setVersionOpen(false)
    setDeathsOpen(false)
    setRewardsHistoryOpen(false)
    setLastCaptureLine('')
    setShowLvl2Transition(false)
    setShowLevel4Warning(false)
    hasSeenLevel4WarningRef.current = false
    sessionDeathsRef.current = 0
    setDadCaseSpawned(false)
    setProfileModal(null)
    setProfileModalMode(null)
    setScreen('playing')
  }

  const handlePurchase = (itemId) => {
    syncProfile((current) => {
      if (current.ownedItems.includes(itemId)) return current

      const shopItem = SHOP_ITEMS.find((item) => item.id === itemId)

      if (!shopItem || current.sheebs < shopItem.cost) return current

      const historyEntry = {
        timestamp: Date.now(),
        type: 'purchase',
        label: shopItem.name,
        amount: -shopItem.cost,
        level: null,
        levelName: null,
      }

      return {
        ...current,
        sheebs: current.sheebs - shopItem.cost,
        ownedItems: [...current.ownedItems, itemId],
        rewardsHistory: [...(current.rewardsHistory || []), historyEntry].slice(-50),
      }
    })
  }

  const handleSheebsChange = (nextSheebs) => {
    syncProfile((current) => ({ ...current, sheebs: nextSheebs }))
  }

  const handleDeath = (payload) => {
    const nextDeaths = typeof payload === 'number' ? payload : payload?.deaths
    const levelName = typeof payload === 'object' && payload && typeof payload.levelName === 'string'
      ? payload.levelName
      : 'Unknown level'
    const level = typeof payload === 'object' && payload && Number.isFinite(payload.level)
      ? payload.level
      : null
    const chaserId = typeof payload === 'object' && payload && typeof payload.chaserId === 'string'
      ? payload.chaserId
      : null

    const timePlayed = typeof payload === 'object' && payload && Number.isFinite(payload.timePlayed)
      ? payload.timePlayed
      : null
    const sessionSheebDelta = typeof payload === 'object' && payload && Number.isFinite(payload.sessionSheebDelta)
      ? payload.sessionSheebDelta
      : null
    const sessionSkreemDelta = typeof payload === 'object' && payload && Number.isFinite(payload.sessionSkreemDelta)
      ? payload.sessionSkreemDelta
      : null

    sessionDeathsRef.current += 1

    syncProfile((current) => {
      const nextHistory = [
        ...(Array.isArray(current.deathsHistory) ? current.deathsHistory : []),
        { timestamp: Date.now(), level, levelName, chaserId, timePlayed, sessionSheebDelta, sessionSkreemDelta },
      ]

      return {
        ...current,
        deaths: Number.isFinite(nextDeaths) ? Math.max(current.deaths, nextDeaths) : current.deaths + 1,
        deathsHistory: nextHistory.slice(-50),
      }
    })
  }

  const handleLevelChange = ({ index }) => {
    syncProfile((current) => ({
      ...current,
      highestLevel: Math.max(current.highestLevel, index),
    }))
    handleLevelChangeAudio()
    setDadCaseSpawned(false)

    if (index === 4 && !hasSeenLevel4WarningRef.current) {
      hasSeenLevel4WarningRef.current = true
      setShowLevel4Warning(true)
      engineRef.current?.stop()
    }
  }

  const handleAcceptLevel4Warning = () => {
    setShowLevel4Warning(false)
    engineRef.current?.start()
  }

  const hideLvl2Transition = () => setShowLvl2Transition(false)

  const handleExtraChaserSpawn = ({ faceId }) => {
    armAmbientAudio()
    if (faceId === 'dad-case') {
      setDadCaseSpawned(true)
      playOneShot(dadCaseDoorUrl, 0.6)
      playOneShot(dadCaseLightsUrl, 0.6)
    }
  }

  const handleCaught = (payload) => {
    const captureLine =
      typeof payload === 'object' && payload
        ? payload.captureLine
        : payload
    const isTurdstoneOave = typeof payload === 'object' && payload && payload.turdstoneSaved
    setShowLvl2Transition(false)
    setDadCaseSpawned(false)
    setProfileModal(null)
    setProfileModalMode(null)

    if (isTurdstoneOave) {
      // Turdstone save: don't show the capture line or do item-loss.
      // The Turdstone overlay fires via handleCaughtProfileReady once the
      // jump-scare animation finishes, so store the flag for that handler.
      turdstoneOverlayRef.current = true
      playCaughtAudio()
      return
    }

    setLastCaptureLine(captureLine)
    playCaughtAudio()

    syncProfile((current) => {
      let nextOwnedItems = current.ownedItems
      if (current.highestLevel > 4 && Math.random() < 0.25 && current.ownedItems.length > 0) {
        const randomIndex = Math.floor(Math.random() * current.ownedItems.length)
        nextOwnedItems = current.ownedItems.filter((_, idx) => idx !== randomIndex)
      }
      return { ...current, ownedItems: nextOwnedItems }
    })
  }

  const handleBadgeEarned = (badgeId) => {
    if (profile.earnedBadges.includes(badgeId)) return
    
    syncProfile((current) => {
      if (current.earnedBadges.includes(badgeId)) return current

      const badge = BADGES[badgeId]
      const historyEntry = {
        timestamp: Date.now(),
        type: 'badge',
        label: badge ? badge.name : badgeId,
        amount: 50,
        level: engineRef.current ? engineRef.current.levelIndex + 1 : null,
        levelName: engineRef.current && engineRef.current.levels && engineRef.current.levels[engineRef.current.levelIndex] ? engineRef.current.levels[engineRef.current.levelIndex].name : null,
      }

      return { 
        ...current, 
        earnedBadges: [...current.earnedBadges, badgeId],
        rewardsHistory: [...(current.rewardsHistory || []), historyEntry].slice(-50),
      }
    })

    if (engineRef.current) {
      const nextSheebs = engineRef.current.sheebs + 50
      engineRef.current.setSheebs(nextSheebs)
      handleSheebsChange(nextSheebs)
    }

    const badge = BADGES[badgeId]
    if (badge) {
      setActiveBadgeToast(badge)
      setTimeout(() => setActiveBadgeToast(null), 5000)
    }
  }

  const handleCaughtProfileReady = (payload) => {
    // If a Turdstone Token save is pending, show the save overlay instead of
    // the normal killer profile card — the engine is paused in 'caught-profile'
    // waiting for beginResumeCountdown().
    if (turdstoneOverlayRef.current) {
      turdstoneOverlayRef.current = false
      setShowTurdstoneOverlay(true)
      return
    }
    setProfileModal(payload)
    setProfileModalMode('caught')
  }

  const handleAcceptTurdstone = () => {
    setShowTurdstoneOverlay(false)
    engineRef.current?.beginResumeCountdown()
  }

  const handleContinueAfterProfile = () => {
    if (profileModalMode === 'caught') {
      setProfileModal(null)
      setProfileModalMode(null)
      setScreen('menu')
      return
    }

    setProfileModal(null)
    setProfileModalMode(null)
  }

  const handleViewDeathProfile = (chaserId) => {
    const face = CHASER_FACE_POOL.find((entry) => entry.id === chaserId) ?? null
    setProfileModal({
      chaserId,
      chaserName: getChaserProfile(chaserId).name,
      chaserFaceSrc: face?.src ?? null,
      source: 'log',
    })
    setProfileModalMode('log')
  }

  const handleOpenDeaths = () => {
    setShopOpen(false)
    setVersionOpen(false)
    setRewardsHistoryOpen(false)
    setDeathsOpen(true)
  }

  const handleOpenRewardsHistory = () => {
    setShopOpen(false)
    setVersionOpen(false)
    setDeathsOpen(false)
    setProfileSwitcherOpen(false)
    setRewardsHistoryOpen(true)
  }

  const handleOpenProfileSwitcher = () => {
    setShopOpen(false)
    setVersionOpen(false)
    setDeathsOpen(false)
    setRewardsHistoryOpen(false)
    setProfileSwitcherOpen(true)
  }

  const handleSwitchProfile = (userId) => {
    setProfile(switchProfile(userId))
    setProfileSwitcherOpen(false)
  }

  const handleCreateProfile = (label) => {
    setProfile(createProfile(label))
    setProfileSwitcherOpen(false)
  }

  const getAmbientAudio = () => getAudio(ambientAudioRef, chaseAmbientUrl, true, 0.14)

  useEffect(() => {
    if (screen !== 'menu' && menuAudioRef.current) {
      menuAudioRef.current.pause()
      menuAudioRef.current.currentTime = 0
    }
  }, [screen])

  useEffect(() => {
    if (screen === 'playing') {
      ambientArmedRef.current = false
      if (ambientDelayTimerRef.current) clearTimeout(ambientDelayTimerRef.current)
      ambientDelayTimerRef.current = setTimeout(() => {
        ambientDelayTimerRef.current = null
        armAmbientAudio()
      }, 15000)
    } else if (ambientAudioRef.current) {
      ambientArmedRef.current = false
      if (ambientDelayTimerRef.current) clearTimeout(ambientDelayTimerRef.current)
      ambientDelayTimerRef.current = null
      ambientAudioRef.current.pause()
      ambientAudioRef.current.currentTime = 0
    }
    return () => {
      if (ambientDelayTimerRef.current) clearTimeout(ambientDelayTimerRef.current)
      ambientDelayTimerRef.current = null
    }
  }, [screen])

  useEffect(() => {
    if (muted) {
      menuAudioRef.current?.pause()
      ambientAudioRef.current?.pause()
    } else if (screen === 'playing' && ambientArmedRef.current) {
      startAmbientAudio()
    } else if (screen === 'menu') {
      // Menu loop only resumes on the next user gesture (see onPrimeAudio),
      // browsers won't allow us to unmute-and-autoplay here.
    }
  }, [muted])

  useEffect(
    () => () => {
      menuAudioRef.current?.pause()
      catchAudioRef.current?.pause()
      ambientAudioRef.current?.pause()
    },
    [],
  )

  useEffect(() => {
    if (!showLvl2Transition) return undefined
    // Safety net if autoplay gets blocked or the clip never fires `ended`.
    const timer = setTimeout(hideLvl2Transition, 11000)
    return () => clearTimeout(timer)
  }, [showLvl2Transition])

  const handleRunnerFace = (src) => {
    setRunnerIsCustom(true)
    setRunnerFaceSelection({ id: 'custom-runner', label: 'Custom Runner', src })
  }

  const handleChaserFace = (src) => {
    setChaserIsCustom(true)
    setChaserFaceSelection({ id: 'custom-chaser', label: 'Custom Chaser', src })
  }

  const runnerFace = runnerFaceSelection?.src ?? null
  const chaserFace = chaserFaceSelection?.src ?? null
  const chaserFaceId = chaserFaceSelection?.id ?? null

  return (
    <div className="stage">
      <div className="portrait-frame">
        {screen === 'menu' && (
          <>
            <MainMenu
              profile={profile}
              iteration={GAME_ITERATION}
              runnerFace={runnerFace}
              chaserFace={chaserFace}
              loadout={loadout}
              onRunnerFace={handleRunnerFace}
              onChaserFace={handleChaserFace}
              onPlay={() => handlePlay(false)}
              onPlayAsChaser={() => handlePlay(true)}
              onOpenShop={() => {
                setVersionOpen(false)
                setShopOpen(true)
              }}
              onOpenVersion={() => {
                setShopOpen(false)
                setDeathsOpen(false)
                setRewardsHistoryOpen(false)
                setVersionOpen(true)
              }}
              onOpenDeaths={handleOpenDeaths}
              onOpenRewardsHistory={handleOpenRewardsHistory}
              onOpenProfileSwitcher={handleOpenProfileSwitcher}
              onPrimeAudio={startMenuAudio}
              muted={muted}
              onToggleMuted={toggleMuted}
            />

            {shopOpen && (
              <ShopModal
                balance={profile.sheebs}
                ownedItems={profile.ownedItems}
                onPurchase={handlePurchase}
                onClose={() => setShopOpen(false)}
              />
            )}

            {versionOpen && (
              <VersionModal iteration={GAME_ITERATION} onClose={() => setVersionOpen(false)} />
            )}

            {deathsOpen && (
              <DeathsModal
                deathsHistory={profile.deathsHistory}
                onViewProfile={handleViewDeathProfile}
                onClose={() => setDeathsOpen(false)}
              />
            )}

            {rewardsHistoryOpen && (
              <RewardsHistoryModal
                rewardsHistory={profile.rewardsHistory}
                onClose={() => setRewardsHistoryOpen(false)}
              />
            )}

            {profileSwitcherOpen && (
              <ProfileSwitcherModal
                profiles={listProfiles()}
                activeUserId={profile.userId}
                onSwitch={handleSwitchProfile}
                onCreate={handleCreateProfile}
                onClose={() => setProfileSwitcherOpen(false)}
              />
            )}
          </>
        )}

        {screen === 'playing' && (
          <>
            <GameCanvas
              runnerFace={runnerFace}
              chaserFace={chaserFace}
              chaserFaceId={chaserFaceId}
              runnerIsCustom={runnerIsCustom}
              isChaserMode={isChaserMode}
              loadoutSpeedBonus={loadout.speedBonus}
              loadoutStaminaBonus={loadout.staminaBonus}
              loadoutRewardBonus={loadout.rewardBonus}
              loadoutLuckBonus={loadout.luckBonus}
              neonJumpscareFilter={profile.ownedItems.includes('jump-scare-filter-neon')}
              initialSheebs={profile.sheebs}
              initialDeaths={profile.deaths}
              highestLevel={profile.highestLevel}
              earnedBadges={profile.earnedBadges}
              onCaught={handleCaught}
              onLevelChange={handleLevelChange}
              onSheebsChange={handleSheebsChange}
              onDeath={handleDeath}
              onBoostStart={handleBoostStart}
              onTired={handleTired}
              onChaserBark={handleChaserBark}
              onLevelClear={handleLevelClear}
              onExtraChaserSpawn={handleExtraChaserSpawn}
              onCaughtProfileReady={handleCaughtProfileReady}
              onBadgeEarned={handleBadgeEarned}
              onShart={handleShart}
              onEngineReady={(engine) => {
                engineRef.current = engine
              }}
            />
            {showLvl2Transition && (
              <video
                className="lvl2-transition"
                src={lvl2TransitionUrl}
                autoPlay
                muted={muted}
                playsInline
                onEnded={hideLvl2Transition}
                onError={hideLvl2Transition}
              />
            )}
            {dadCaseSpawned && <div className="dad-case-darkness" />}
            {showLevel4Warning && (
              <Level4WarningOverlay onAccept={handleAcceptLevel4Warning} />
            )}
            <button className="exit-btn" onClick={() => setScreen('menu')}>
              ✕
            </button>
            <button
              className="mute-btn"
              onClick={toggleMuted}
              aria-label={muted ? 'Unmute audio' : 'Mute audio'}
            >
              {muted ? '🔇' : '🔊'}
            </button>
          </>
        )}

        {profileModal && (
          <ProfileModal
            profile={profileModal}
            mode={profileModalMode}
            onPrimary={handleContinueAfterProfile}
            onClose={handleContinueAfterProfile}
          />
        )}
      </div>

      {lastCaptureLine && (
        <div className="toast-panel" aria-live="polite">
          {lastCaptureLine}
        </div>
      )}

      {showTurdstoneOverlay && (
        <div className="turdstone-overlay" role="dialog" aria-modal="true" aria-labelledby="turdstone-title">
          <div className="turdstone-overlay-inner">
            <div className="turdstone-icon" aria-hidden="true">🪦</div>
            <h2 id="turdstone-title" className="turdstone-title">SAVED BY THE TURDSTONE!</h2>
            <p className="turdstone-body">
              The porcelain tombstone intervened.
              Your loadout is intact. Your sheebs are intact.
              The Turdstone Token has been consumed.
            </p>
            <button
              id="turdstone-accept-btn"
              className="turdstone-accept-btn"
              onClick={handleAcceptTurdstone}
              autoFocus
            >
              GET BACK IN THERE 💩
            </button>
          </div>
        </div>
      )}

      {activeBadgeToast && (
        <div className="toast-panel badge-toast" aria-live="polite" style={{ backgroundColor: '#2ecc71', color: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: '3px solid #000' }}>
          <div style={{ fontSize: '2rem' }}>{activeBadgeToast.emoji}</div>
          <div style={{ fontWeight: 'bold', margin: '4px 0' }}>ACHIEVEMENT UNLOCKED: {activeBadgeToast.name}</div>
          <div style={{ fontSize: '0.9rem' }}>{activeBadgeToast.lore}</div>
        </div>
      )}
    </div>
  )
}

function MainMenu({
  profile,
  iteration,
  runnerFace,
  chaserFace,
  loadout,
  onRunnerFace,
  onChaserFace,
  onPlay,
  onPlayAsChaser,
  onOpenShop,
  onOpenVersion,
  onOpenDeaths,
  onOpenRewardsHistory,
  onOpenProfileSwitcher,
  onPrimeAudio,
  muted,
  onToggleMuted,
}) {
  return (
    <div className="menu" onPointerDown={onPrimeAudio}>
      <div className="menu-sheen" />
      <button
        className="mute-btn mute-btn-menu"
        onClick={(e) => {
          e.stopPropagation()
          onToggleMuted()
        }}
        aria-label={muted ? 'Unmute audio' : 'Mute audio'}
      >
        {muted ? '🔇' : '🔊'}
      </button>
      <div className="menu-worldstar">● WORLD STAR!!! ●</div>
      <h1>SKIB-JAY-DEE-TOILET</h1>
      <p className="tagline">"Run like hell." — Screeeeming Kid</p>

      <div className="status-row">
        <button
          type="button"
          className="status-pill user-pill"
          onClick={(e) => {
            e.stopPropagation()
            onOpenProfileSwitcher()
          }}
        >
          User {profile.label || profile.userId}
        </button>
        {profile.sheebs < 0 ? (
          <span className="debt-badge" style={{ backgroundColor: '#ff2e2e', color: 'white', padding: '0 6px', borderRadius: '4px' }}>DEBT: {profile.sheebs}</span>
        ) : (
          <span>{profile.sheebs} sheebs</span>
        )}
        <span>Best level {profile.highestLevel}</span>
        <button className="status-pill deaths-pill" onClick={onOpenDeaths} type="button">
          Deaths {profile.deaths}
        </button>
      </div>

      <div className="best-run-row" style={{ display: 'flex', justifyContent: 'center', margin: '4px 0', fontSize: '0.9rem', color: '#ffea00', textShadow: '1px 1px 2px #000' }}>
        Best Run: Lvl {profile.bestRun?.level || 1} ({profile.bestRun?.deaths || 0} deaths)
      </div>

      {profile.earnedBadges && profile.earnedBadges.length > 0 && (
        <div className="badges-row" style={{ display: 'flex', justifyContent: 'center', gap: '8px', margin: '10px 0' }}>
          {profile.earnedBadges.map(badgeId => {
            const badge = BADGES[badgeId]
            return badge ? (
              <span key={badgeId} title={`${badge.name}: ${badge.lore}`} style={{ fontSize: '1.5rem', cursor: 'help' }}>
                {badge.emoji}
              </span>
            ) : null
          })}
        </div>
      )}

      <div className="face-row">
        <FaceUpload label="Your Face (Runner)" previewSrc={runnerFace} onFace={onRunnerFace} />
        <FaceUpload label="Skib (Chaser)" previewSrc={chaserFace} onFace={onChaserFace} />
      </div>

      <div className="menu-actions">
        <button className="play-btn" onClick={onPlay}>
          QUICK PLAY
        </button>
        <button className="play-btn chaser-btn" onClick={onPlayAsChaser} style={{ backgroundColor: '#8a5a34' }}>
          PLAY AS CHASER
        </button>
        <button className="shop-btn" onClick={onOpenShop}>
          OPEN SHLEEB SHOP
        </button>
        <button className="version-btn" onClick={onOpenVersion}>
          WHAT&apos;S NEW
        </button>
      </div>

      <div className="perk-strip">
        <span>Speed +{loadout.speedBonus}</span>
        <span>Stamina +{loadout.staminaBonus}</span>
        <button type="button" className="perk-btn rewards-btn" onClick={onOpenRewardsHistory} style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
          Rewards +{Math.round(loadout.rewardBonus * 100)}%
        </button>
        {loadout.luckBonus > 0 && <span>Luck +{Math.round(loadout.luckBonus * 100)}%</span>}
      </div>

      <p className="hint">
        Desktop: Arrow keys or WASD to move, SPACE to boost. Mobile: drag the joystick
        bottom-left and hold SPRINT bottom-right. Random default faces reshuffle every time you play
        unless you upload your own.
      </p>

      <p className="hint hint-quiet">
        The Porcelain Palace now has three levels, the Shleeb shop works, and your user id stays in
        cookies so the save survives reloads.
      </p>

      <div className="menu-footer">
        <p className="parody-warning">
          <strong>Fair Use / Parody Warning:</strong> This is a non-commercial fan parody game. Not affiliated with any official brand or IP.
        </p>
        <div className="footer-links">
          <a href="https://github.com/kmacpher67/skib-jay-dee/blob/master/docs/players-guide.md" target="_blank" rel="noopener noreferrer">Player's Guide</a>
          {' · '}
          <a href="https://github.com/kmacpher67/skib-jay-dee/issues" target="_blank" rel="noopener noreferrer">Report issues or leave feedback here.</a>
        </div>
      </div>

      <p className="build-tag" aria-label={`Game iteration ${iteration}`}>
        {iteration}
      </p>
    </div>
  )
}

function Level4WarningOverlay({ onAccept }) {
  return (
    <div className="modal-overlay level-4-warning">
      <div 
        className="modal-content warning-content" 
        style={{ 
          backgroundImage: `url(${warningBgUrl})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          color: 'white',
          textShadow: '1px 1px 2px black',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '80%'
        }}
      >
        <h2 
          className="warning-header" 
          style={{ color: '#ff2e2e', textShadow: '2px 2px black', textAlign: 'center', fontSize: '1.5rem', marginBottom: '20px' }}
        >
          {LEVEL_4_RULES.header}
        </h2>
        
        <div className="warning-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'rgba(0,0,0,0.6)', padding: '16px', borderRadius: '8px' }}>
          {LEVEL_4_RULES.body.map((line, i) => (
            <p key={i} style={{ margin: 0, lineHeight: 1.4, fontSize: '1.1rem' }}>{line}</p>
          ))}
        </div>
        
        <button 
          className="accept-btn" 
          onClick={onAccept} 
          style={{ 
            backgroundColor: '#ff2e2e', 
            color: 'white', 
            padding: '16px 20px', 
            fontWeight: 'bold', 
            fontSize: '1.2rem',
            border: 'none',
            borderRadius: '8px',
            marginTop: 'auto',
            cursor: 'pointer'
          }}
        >
          {LEVEL_4_RULES.button}
        </button>
      </div>
    </div>
  )
}

