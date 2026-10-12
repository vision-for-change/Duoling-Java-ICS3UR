import { useEffect, useState, type ReactNode } from 'react'
import { House, RefreshCw } from 'lucide-react'
import { isRouteErrorResponse, useRouteError } from 'react-router'
import type { MascotMood } from '../data/types'
import { buttonClass } from './Button'
import { Mascot } from './Mascot'

/**
 * Error screen for the router. The most common failure is a page whose code (a lazily loaded chunk)
 * can't be downloaded: the dev server stopped, the network dropped or a new version was deployed.
 * Those reload the page as soon as the app can be reached; anything else shows a friendly error page.
 */

/** True when a lazily loaded page couldn't be downloaded (browsers word this differently). */
export function isChunkLoadError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? '')
  return /dynamically imported module|importing a module script failed|unable to preload css/i.test(message)
}

const RELOAD_KEY = 'bytebrew:chunk-reload'

/** Reload the page, but never twice within 30 seconds, so a page that keeps failing can't loop forever. */
function reloadOnce(): boolean {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) ?? 0)
    if (Date.now() - last < 30_000) return false
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()))
  } catch {
    // without storage there's no loop guard, so leave reloading to the Reload button
    return false
  }
  window.location.reload()
  return true
}

async function appReachable(): Promise<boolean> {
  try {
    const res = await fetch(import.meta.env.BASE_URL, { method: 'HEAD', cache: 'no-store' })
    return res.ok
  } catch {
    return false
  }
}

function ErrorLayout({ fullPage, mood, title, children }: { fullPage: boolean; mood: MascotMood; title: string; children: ReactNode }) {
  return (
    <div role="alert" className={`flex flex-col items-center justify-center gap-4 px-4 py-10 text-center ${fullPage ? 'min-h-dvh' : 'min-h-[60vh]'}`}>
      <Mascot mood={mood} size={130} float />
      <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
      {children}
    </div>
  )
}

function Actions() {
  return (
    <div className="mt-2 flex flex-wrap justify-center gap-3">
      <button type="button" onClick={() => window.location.reload()} className={buttonClass('primary', 'lg')}>
        <RefreshCw size={20} /> Reload
      </button>
      {/* a full page load, so nothing broken is left in memory */}
      <a href={`${import.meta.env.BASE_URL}home`} className={buttonClass('secondary', 'lg')}>
        <House size={20} /> Dashboard
      </a>
    </div>
  )
}

function Details({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : String(error)
  return (
    <details className="w-full max-w-lg rounded-2xl border-2 border-espresso-100 bg-white p-3 text-left text-sm">
      <summary className="cursor-pointer font-bold text-espresso-600">Technical details</summary>
      <pre className="mt-2 font-mono text-xs break-words whitespace-pre-wrap text-espresso-700">{message}</pre>
    </details>
  )
}

function ChunkLoadError({ error, fullPage }: { error: unknown; fullPage: boolean }) {
  const [status, setStatus] = useState<'checking' | 'offline' | 'failed'>('checking')

  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined
    const check = async () => {
      const reachable = await appReachable()
      if (cancelled) return
      if (!reachable) {
        setStatus('offline')
        // keep checking, and reload as soon as ByteBrew is back
        timer = setTimeout(() => void check(), 3000)
      } else if (!reloadOnce()) {
        setStatus('failed')
      }
    }
    void check()
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [])

  if (status === 'checking') {
    return (
      <ErrorLayout fullPage={fullPage} mood="thinking" title="Loading this page…">
        <p className="max-w-md text-espresso-600">One moment while Mr. Lauder fetches it again.</p>
      </ErrorLayout>
    )
  }
  if (status === 'offline') {
    return (
      <ErrorLayout fullPage={fullPage} mood="confused" title="ByteBrew can't be reached">
        <p className="max-w-md text-espresso-600">
          {import.meta.env.DEV ? (
            <>
              This page couldn't be downloaded because the app server stopped. Start it again with{' '}
              <code className="rounded bg-espresso-50 px-1.5 py-0.5 font-mono text-sm font-bold text-brew-600">npm run dev</code> in the project folder.
            </>
          ) : (
            'This page couldn\'t be downloaded. Check your internet connection.'
          )}
        </p>
        <p className="max-w-md font-semibold text-espresso-700">The page reloads by itself as soon as ByteBrew is back. Your progress is saved in this browser.</p>
      </ErrorLayout>
    )
  }
  return (
    <ErrorLayout fullPage={fullPage} mood="confused" title="This page didn't load">
      <p className="max-w-md text-espresso-600">Mr. Lauder couldn't open this part of ByteBrew. Reloading usually fixes it, and your progress is saved in this browser.</p>
      <Actions />
      <Details error={error} />
    </ErrorLayout>
  )
}

/** `errorElement` for the router. `fullPage` fills the screen; otherwise it sits inside the app shell. */
export function RouteError({ fullPage = false }: { fullPage?: boolean }) {
  const error = useRouteError()
  if (isChunkLoadError(error)) return <ChunkLoadError error={error} fullPage={fullPage} />
  if (isRouteErrorResponse(error)) {
    return (
      <ErrorLayout fullPage={fullPage} mood="confused" title={`${error.status}: ${error.statusText || 'Something went wrong'}`}>
        <Actions />
      </ErrorLayout>
    )
  }
  return (
    <ErrorLayout fullPage={fullPage} mood="surprised" title="Oops! Mr. Lauder spilled the coffee">
      <p className="max-w-md text-espresso-600">Something went wrong on this page. Your progress is saved in this browser, so reloading is safe.</p>
      <Actions />
      <Details error={error} />
    </ErrorLayout>
  )
}
