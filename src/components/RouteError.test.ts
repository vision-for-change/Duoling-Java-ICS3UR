import { describe, expect, it } from 'vitest'
import { isChunkLoadError } from './RouteError'

describe('isChunkLoadError', () => {
  it('recognizes a page that could not be downloaded, in every browser', () => {
    expect(isChunkLoadError(new TypeError('Failed to fetch dynamically imported module: http://localhost:5173/src/pages/ProfilePage.tsx'))).toBe(true) // Chrome
    expect(isChunkLoadError(new TypeError('error loading dynamically imported module: http://localhost:5173/src/pages/ProfilePage.tsx'))).toBe(true) // Firefox
    expect(isChunkLoadError(new TypeError('Importing a module script failed.'))).toBe(true) // Safari
    expect(isChunkLoadError(new Error('Unable to preload CSS for /assets/index-abc123.css'))).toBe(true) // Vite build
  })

  it('leaves ordinary errors alone', () => {
    expect(isChunkLoadError(new TypeError("Cannot read properties of null (reading 'includes')"))).toBe(false)
    expect(isChunkLoadError('something else')).toBe(false)
    expect(isChunkLoadError(undefined)).toBe(false)
  })
})
