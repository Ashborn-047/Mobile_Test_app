import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set base path for GitHub Pages when building in CI
const repo = process.env.GITHUB_REPOSITORY ? process.env.GITHUB_REPOSITORY.split('/')[1] : ''
const isCI = !!process.env.GITHUB_ACTIONS

export default defineConfig({
  plugins: [react()],
  base: isCI && repo ? `/${repo}/` : '/',
})

