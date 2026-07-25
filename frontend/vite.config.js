import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path matches the nginx deployment target:
// https://kenmacpherson.com/skib-jay-dee-toilet-game/index.html
export default defineConfig({
  plugins: [react()],
  base: './',
})
