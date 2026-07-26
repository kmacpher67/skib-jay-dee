import { useEffect, useRef, useState } from 'react'
import FaceUpload from './components/FaceUpload.jsx'
import GameCanvas from './components/GameCanvas.jsx'
import ShopModal from './components/ShopModal.jsx'
import skreemLoopUrl from './assets/audio/jayden-skreem-loop.m4a'
import captureStingUrl from './assets/audio/capture-sting-final.mp3'
import levelStartUrl from './assets/audio/level-start-igottago.mp3'
import levelClearUrl from './assets/audio/level-win-cant-catch-me.mp3'
import boostStartUrl from './assets/audio/boost-start-igottago-x2.mp3'
import tiredUrl from './assets/audio/runner-tired-run.mp3'
import chaseAmbientUrl from './assets/audio/chase-ambient-bopbop.mp3'
import chaserBarkCloseUrl from './assets/audio/chaser-bark-close-toiletking.mp3'
import chaserBarkMissAUrl from './assets/audio/chaser-bark-miss-ayayay.mp3'
import chaserBarkMissBUrl from './assets/audio/chaser-bark-miss-getoutofhere.mp3'
import chaserScreamUrl from './assets/audio/chaser-scream-freakout.mp3'
import chaserTauntUrl from './assets/audio/chaser-taunt-skibidforever.mp3'
import lvl2TransitionUrl from './assets/video/lvl2-transition.mp4'
import {
  buildLoadout,
  SHOP_ITEMS,
  randomFaces,
} from './gameContent.js'
import { GAME_ITERATION } from './version.js'
import { loadProfile, persistProfile } from './lib/cookies.js'
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
  const [runnerFace, setRunnerFace] = useState(() => randomFaces().runnerFace)
  const [chaserFace, setChaserFace] = useState(() => randomFaces().chaserFace)
  const [runnerIsCustom, setRunnerIsCustom] = useState(false)
  const [chaserIsCustom, setChaserIsCustom] = useState(false)
  const [lastCaptureLine, setLastCaptureLine] = useState('')
  const [showLvl2Transition, setShowLvl2Transition] = useState(false)
  const [dadCaseSpawned, setDadCaseSpawned] = useState(false)
  const loadout = buildLoadout(profile.ownedItems)
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
  const handleChaserBark = () => playRandomOneShot(CHASER_BARK_URLS, 0.32)
  const handleLevelClear = ({ index, showLvl2Transition = false } = {}) => {
    playOneShot(levelClearUrl, 0.4)
    if (index === 2) setShowLvl2Transition(!!showLvl2Transition)
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

  const handlePlay = () => {
    const nextFaces = randomFaces()
    if (!runnerIsCustom) setRunnerFace(nextFaces.runnerFace)
    if (!chaserIsCustom) setChaserFace(nextFaces.chaserFace)
    setShopOpen(false)
    setLastCaptureLine('')
    setShowLvl2Transition(false)
    setDadCaseSpawned(false)
    setScreen('playing')
  }

  const handlePurchase = (itemId) => {
    syncProfile((current) => {
      if (current.ownedItems.includes(itemId)) return current

      const shopItem = SHOP_ITEMS.find((item) => item.id === itemId)

      if (!shopItem || current.sheebs < shopItem.cost) return current

      return {
        ...current,
        sheebs: current.sheebs - shopItem.cost,
        ownedItems: [...current.ownedItems, itemId],
      }
    })
  }

  const handleSheebsChange = (nextSheebs) => {
    syncProfile((current) => ({ ...current, sheebs: nextSheebs }))
  }

  const handleDeath = (nextDeaths) => {
    syncProfile((current) => ({
      ...current,
      deaths: Number.isFinite(nextDeaths) ? Math.max(current.deaths, nextDeaths) : current.deaths + 1,
    }))
  }

  const handleLevelChange = ({ index }) => {
    syncProfile((current) => ({
      ...current,
      highestLevel: Math.max(current.highestLevel, index),
    }))
    handleLevelChangeAudio()
    setDadCaseSpawned(false)
  }

  const hideLvl2Transition = () => setShowLvl2Transition(false)

  const handleExtraChaserSpawn = ({ faceId }) => {
    armAmbientAudio()
    if (faceId === 'dad-case') {
      setDadCaseSpawned(true)
    }
  }

  const handleCaught = (captureLine) => {
    setShowLvl2Transition(false)
    setDadCaseSpawned(false)
    setLastCaptureLine(captureLine)
    playCaughtAudio()
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
    setRunnerFace(src)
  }

  const handleChaserFace = (src) => {
    setChaserIsCustom(true)
    setChaserFace(src)
  }

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
              onPlay={handlePlay}
              onOpenShop={() => setShopOpen(true)}
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
          </>
        )}

        {screen === 'playing' && (
          <>
            <GameCanvas
              runnerFace={runnerFace}
              chaserFace={chaserFace}
              runnerIsCustom={runnerIsCustom}
              loadoutSpeedBonus={loadout.speedBonus}
              loadoutStaminaBonus={loadout.staminaBonus}
              loadoutRewardBonus={loadout.rewardBonus}
              initialSheebs={profile.sheebs}
              initialDeaths={profile.deaths}
              onCaught={handleCaught}
              onLevelChange={handleLevelChange}
              onSheebsChange={handleSheebsChange}
              onDeath={handleDeath}
              onBoostStart={handleBoostStart}
              onTired={handleTired}
              onChaserBark={handleChaserBark}
              onLevelClear={handleLevelClear}
              onExtraChaserSpawn={handleExtraChaserSpawn}
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
            {dadCaseSpawned && (
              <div className="dad-case-darkness">
                <div className="dad-case-sound-text">*DOOR SLAM SOUND*</div>
              </div>
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
      </div>

      {lastCaptureLine && (
        <div className="toast-panel" aria-live="polite">
          {lastCaptureLine}
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
  onOpenShop,
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
        <span>User {profile.userId}</span>
        <span>{profile.sheebs} sheebs</span>
        <span>Best level {profile.highestLevel}</span>
        <span>Deaths {profile.deaths}</span>
      </div>

      <div className="face-row">
        <FaceUpload label="Your Face (Runner)" previewSrc={runnerFace} onFace={onRunnerFace} />
        <FaceUpload label="Skib (Chaser)" previewSrc={chaserFace} onFace={onChaserFace} />
      </div>

      <div className="menu-actions">
        <button className="play-btn" onClick={onPlay}>
          QUICK PLAY
        </button>
        <button className="shop-btn" onClick={onOpenShop}>
          OPEN SHLEEB SHOP
        </button>
      </div>

      <div className="perk-strip">
        <span>Speed +{loadout.speedBonus}</span>
        <span>Stamina +{loadout.staminaBonus}</span>
        <span>Rewards +{Math.round(loadout.rewardBonus * 100)}%</span>
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

      <p className="build-tag" aria-label={`Game iteration ${iteration}`}>
        {iteration}
      </p>
    </div>
  )
}
