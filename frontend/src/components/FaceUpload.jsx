import { useRef } from 'react'

const CROP_SIZE = 256

// Crops the source image to a centered square, then masks it to an oval so
// uploaded faces don't render as a raw stretched square on the sprite.
function cropToOval(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const side = Math.min(img.width, img.height)
      const sx = (img.width - side) / 2
      const sy = (img.height - side) / 2

      const canvas = document.createElement('canvas')
      canvas.width = CROP_SIZE
      canvas.height = CROP_SIZE
      const ctx = canvas.getContext('2d')

      ctx.save()
      ctx.beginPath()
      ctx.ellipse(CROP_SIZE / 2, CROP_SIZE / 2, CROP_SIZE / 2, CROP_SIZE / 2, 0, 0, Math.PI * 2)
      ctx.clip()
      ctx.drawImage(img, sx, sy, side, side, 0, 0, CROP_SIZE, CROP_SIZE)
      ctx.restore()

      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = reject
    img.src = dataUrl
  })
}

// Lets a player upload a local photo, converts it to a base64 string, oval-
// crops it, and hands it back to the parent so it can be drawn onto the
// Canvas sprite.
export default function FaceUpload({ label, previewSrc, onFace }) {
  const inputRef = useRef(null)

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      cropToOval(reader.result).then(onFace).catch(() => onFace(reader.result))
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="face-upload">
      <div className="face-preview" onClick={() => inputRef.current?.click()}>
        {previewSrc ? (
          <img src={previewSrc} alt={label} />
        ) : (
          <span>+ upload</span>
        )}
      </div>
      <p>{label}</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleFile}
        hidden
      />
    </div>
  )
}
