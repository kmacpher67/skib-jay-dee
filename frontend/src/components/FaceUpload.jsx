import { useRef } from 'react'

// Lets a player upload a local photo, converts it to a base64 string, and
// hands it back to the parent so it can be drawn onto the Canvas sprite.
export default function FaceUpload({ label, previewSrc, onFace }) {
  const inputRef = useRef(null)

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onFace(reader.result)
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
