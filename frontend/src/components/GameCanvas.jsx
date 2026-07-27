import { useEffect, useRef } from 'react'
import { GameEngine } from '../GameEngine.js'
import { RUNNER_STATE_FACES } from '../gameContent.js'

function loadImage(src) {
  return new Promise((resolve) => {
    if (!src) return resolve(null)
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

export default function GameCanvas({
  runnerFace,
  chaserFace,
  chaserFaceId,
  runnerIsCustom,
  loadoutSpeedBonus,
  loadoutStaminaBonus,
  loadoutRewardBonus,
  loadoutLuckBonus,
  initialSheebs,
  initialDeaths,
  highestLevel,
  earnedBadges,
  onCaught,
  onSkreem,
  onLevelChange,
  onSheebsChange,
  onDeath,
  onBoostStart,
  onTired,
  onChaserBark,
  onLevelClear,
  onExtraChaserSpawn,
  onCaughtProfileReady,
  onBadgeEarned,
  onEngineReady,
}) {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)

  useEffect(() => {
    // Mount the canvas engine once per play session; subsequent prop
    // changes flow through the dedicated setter effects below.
    const engine = new GameEngine(canvasRef.current, {
      onCaught,
      onSkreem,
      onLevelChange,
      onSheebsChange,
      onDeath,
      onBoostStart,
      onTired,
      onChaserBark,
      onLevelClear,
      onExtraChaserSpawn,
      onCaughtProfileReady,
      onBadgeEarned,
      initialSheebs,
      initialDeaths,
      highestLevel,
      earnedBadges,
      loadout: {
        speedBonus: loadoutSpeedBonus,
        staminaBonus: loadoutStaminaBonus,
        rewardBonus: loadoutRewardBonus,
        luckBonus: loadoutLuckBonus,
      },
    })
    engineRef.current = engine
    onEngineReady?.(engine)
    // Exposed for e2e verification (see e2e/caught-face.spec.js) — lets a
    // test force a capture and inspect phase/face state directly instead
    // of relying on real-time movement/collision timing.
    window.__skibEngine = engine
    engine.start()
    return () => {
      onEngineReady?.(null)
      window.__skibEngine = null
      engine.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let cancelled = false
    Promise.all([
      loadImage(runnerFace),
      loadImage(chaserFace),
      loadImage(RUNNER_STATE_FACES.gettingCaptured),
      loadImage(RUNNER_STATE_FACES.captured),
    ]).then(([runnerImg, chaserImg, gettingCapturedImg, capturedImg]) => {
      if (cancelled || !engineRef.current) return
      engineRef.current.setFaces({
        runnerFace: runnerImg,
        chaserFace: chaserImg,
        chaserFaceId,
        runnerIsCustom: !!runnerIsCustom,
        runnerGettingCapturedFace: gettingCapturedImg,
        runnerCapturedFace: capturedImg,
      })
    })
    return () => {
      cancelled = true
    }
  }, [runnerFace, chaserFace, chaserFaceId, runnerIsCustom])

  useEffect(() => {
    if (!engineRef.current) return
    engineRef.current.setLoadout({
      speedBonus: loadoutSpeedBonus,
      staminaBonus: loadoutStaminaBonus,
      rewardBonus: loadoutRewardBonus,
      luckBonus: loadoutLuckBonus,
    })
  }, [loadoutSpeedBonus, loadoutStaminaBonus, loadoutRewardBonus, loadoutLuckBonus])

  useEffect(() => {
    if (!engineRef.current) return
    engineRef.current.setSheebs(initialSheebs)
  }, [initialSheebs])

  useEffect(() => {
    if (!engineRef.current) return
    engineRef.current.setEarnedBadges(earnedBadges)
  }, [earnedBadges])

  return <canvas ref={canvasRef} />
}
