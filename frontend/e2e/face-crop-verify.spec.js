import { test, expect } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

test('uploaded face is oval-masked, not a raw square', async ({ page }) => {
  await page.goto('./')

  const fileInput = page.locator('.face-upload input[type="file"]').first()
  await fileInput.setInputFiles(path.join(__dirname, '../src/assets/jayden-default.jpg'))

  const preview = page.locator('.face-upload').first().locator('img')
  await expect(preview).toBeVisible()

  const src = await preview.getAttribute('src')
  expect(src.startsWith('data:image/png')).toBe(true)

  const alphaInfo = await page.evaluate(async (dataUrl) => {
    const img = new Image()
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
      img.src = dataUrl
    })
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    const corner = ctx.getImageData(2, 2, 1, 1).data
    const center = ctx.getImageData(Math.floor(img.width / 2), Math.floor(img.height / 2), 1, 1).data
    return { cornerAlpha: corner[3], centerAlpha: center[3] }
  }, src)

  expect(alphaInfo.cornerAlpha).toBe(0)
  expect(alphaInfo.centerAlpha).toBeGreaterThan(0)
})
