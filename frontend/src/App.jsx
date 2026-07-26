import { useEffect, useRef, useState } from 'react'
import FaceUpload from './components/FaceUpload.jsx'
import GameCanvas from './components/GameCanvas.jsx'
import ShopModal from './components/ShopModal.jsx'
import skreemLoopUrl from './assets/audio/jayden-skreem-loop.m4a'
import {
  buildLoadout,
  SHOP_ITEMS,
  randomFaces,
} from './gameContent.js'
import { GAME_ITERATION } from './version.js'
import { loadProfile, persistProfile } from './lib/cookies.js'
import './App.css'

export default function App() {
  const [profile, setProfile] = useState(() => loadProfile())
  const [screen, setScreen] = useState('menu')
  const [shopOpen, setShopOpen] = useState(false)
  const [runnerFace, setRunnerFace] = useState(() => randomFaces().runnerFace)
  const [chaserFace, setChaserFace] = useState(() => randomFaces().chaserFace)
  const [runnerIsCustom, setRunnerIsCustom] = useState(false)
  const [chaserIsCustom, setChaserIsCustom] = useState(false)
  const [lastCaptureLine, setLastCaptureLine] = useState('')
  const loadout = buildLoadout(profile.ownedItems)
  const menuAudioRef = useRef(null)
  const catchAudioRef = useRef(null)

  const syncProfile = (updater) => {
    setProfile((current) => {
      const nextProfile = persistProfile(
        typeof updater === 'function' ? updater(current) : updater,
      )
      return nextProfile
    })
  }

  const getAudio = (ref, loop) => {
    if (!ref.current) {
      const audio = new Audio(skreemLoopUrl)
      audio.preload = 'auto'
      audio.loop = loop
      audio.volume = loop ? 0.22 : 0.35
      ref.current = audio
    }

    return ref.current
  }

  const playAudio = (audio, restart = true) => {
    if (!audio) return
    if (!restart && !audio.paused) return
    audio.currentTime = 0
    audio.play().catch(() => {})
  }

  const startMenuAudio = () => {
    playAudio(getAudio(menuAudioRef, true), false)
  }

  const playCaughtAudio = () => {
    playAudio(getAudio(catchAudioRef, false))
  }

  const handlePlay = () => {
    const nextFaces = randomFaces()
    if (!runnerIsCustom) setRunnerFace(nextFaces.runnerFace)
    if (!chaserIsCustom) setChaserFace(nextFaces.chaserFace)
    setShopOpen(false)
    setLastCaptureLine('')
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
  }

  const handleCaught = (captureLine) => {
    setLastCaptureLine(captureLine)
    playCaughtAudio()
  }

  useEffect(() => {
    if (screen !== 'menu' && menuAudioRef.current) {
      menuAudioRef.current.pause()
      menuAudioRef.current.currentTime = 0
    }
  }, [screen])

  useEffect(
    () => () => {
      menuAudioRef.current?.pause()
      catchAudioRef.current?.pause()
    },
    [],
  )

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
              loadoutSpeedBonus={loadout.speedBonus}
              loadoutStaminaBonus={loadout.staminaBonus}
              loadoutRewardBonus={loadout.rewardBonus}
              initialSheebs={profile.sheebs}
              initialDeaths={profile.deaths}
              onCaught={handleCaught}
              onLevelChange={handleLevelChange}
              onSheebsChange={handleSheebsChange}
              onDeath={handleDeath}
            />
            <button className="exit-btn" onClick={() => setScreen('menu')}>
              ✕
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
}) {
  return (
    <div className="menu" onPointerDown={onPrimeAudio}>
      <div className="menu-sheen" />
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
