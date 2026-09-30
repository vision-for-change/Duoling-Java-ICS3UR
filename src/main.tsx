import '@fontsource-variable/fredoka'
import '@fontsource-variable/nunito'
import '@fontsource-variable/jetbrains-mono'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { store } from './state/store'
import './index.css'

// handy for debugging and manual testing: window.__bytebrew.importJson(...)
if (import.meta.env.DEV) (window as unknown as { __bytebrew: typeof store }).__bytebrew = store

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
