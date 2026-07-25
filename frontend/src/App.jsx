import { useState } from 'react'
import FaceUpload from './components/FaceUpload.jsx'
import GameCanvas from './components/GameCanvas.jsx'
import jaydenDefault from './assets/jayden-default.jpg'
import skibDefault from './assets/skib-default.jpg'
import './App.css'

export default function App() {
  const [screen, setScreen] = useState('menu') // 'menu' | 'playing'
  const [runnerFace, setRunnerFace] = useState(jaydenDefault)
  const [chaserFace, setChaserFace] = useState(skibDefault)

  return (
    <div className="stage">
      <div className="portrait-frame">
        {screen === 'menu' && (
          <MainMenu
            runnerFace={runnerFace}
            chaserFace={chaserFace}
            onRunnerFace={setRunnerFace}
            onChaserFace={setChaserFace}
            onPlay={() => setScreen('playing')}
          />
        )}

        {screen === 'playing' && (
          <>
            <GameCanvas runnerFace={runnerFace} chaserFace={chaserFace} />
            <button className="exit-btn" onClick={() => setScreen('menu')}>
              ✕
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function MainMenu({ runnerFace, chaserFace, onRunnerFace, onChaserFace, onPlay }) {
  return (
    <div className="menu">
      <div className="menu-worldstar">● WORLD STAR!!! ●</div>
      <h1>SKIB-JAY-DEE-TOILET</h1>
      <p className="tagline">"Run like hell." — Screeeeming Kid</p>

      <div className="face-row">
        <FaceUpload label="Your Face (Runner)" previewSrc={runnerFace} onFace={onRunnerFace} />
        <FaceUpload label="Skib (Chaser)" previewSrc={chaserFace} onFace={onChaserFace} />
      </div>

      <button className="play-btn" onClick={onPlay}>
        QUICK PLAY
      </button>
      <button className="shop-btn" disabled title="Coming in a later phase">
        SKREEM SHOP
      </button>

      <p className="hint">
        Skibidty Toilet Guy is hunting you through The Porcelain Palace.
        Drag the joystick bottom-left to run, hold SPRINT bottom-right to
        escape — but don't run out of steam.
      </p>
    </div>
  )
}
