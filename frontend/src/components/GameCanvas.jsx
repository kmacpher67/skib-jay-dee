import { useEffect, useRef } from 'react'
import { GameEngine } from '../GameEngine.js'

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
  loadoutSpeedBonus,
  loadoutStaminaBonus,
  loadoutRewardBonus,
  initialSheebs,
  onCaught,
  onSkreem,
  onLevelChange,
  onSheebsChange,
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
      initialSheebs,
      loadout: {
        speedBonus: loadoutSpeedBonus,
        staminaBonus: loadoutStaminaBonus,
        rewardBonus: loadoutRewardBonus,
      },
    })
    engineRef.current = engine
    engine.start()
    return () => engine.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let cancelled = false
    Promise.all([loadImage(runnerFace), loadImage(chaserFace)]).then(
      ([runnerImg, chaserImg]) => {
        if (cancelled || !engineRef.current) return
        engineRef.current.setFaces({ runnerFace: runnerImg, chaserFace: chaserImg })
      },
    )
    return () => {
      cancelled = true
    }
  }, [runnerFace, chaserFace])

  useEffect(() => {
    if (!engineRef.current) return
    engineRef.current.setLoadout({
      speedBonus: loadoutSpeedBonus,
      staminaBonus: loadoutStaminaBonus,
      rewardBonus: loadoutRewardBonus,
    })
  }, [loadoutSpeedBonus, loadoutStaminaBonus, loadoutRewardBonus])

  useEffect(() => {
    if (!engineRef.current) return
    engineRef.current.setSheebs(initialSheebs)
  }, [initialSheebs])

  return <canvas ref={canvasRef} />
}
