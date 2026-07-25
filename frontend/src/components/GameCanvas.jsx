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

export default function GameCanvas({ runnerFace, chaserFace, onCaught, onSkreem }) {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)

  useEffect(() => {
    const engine = new GameEngine(canvasRef.current, { onCaught, onSkreem })
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

  return <canvas ref={canvasRef} />
}
