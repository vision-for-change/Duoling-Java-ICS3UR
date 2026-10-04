import { Suspense, type ReactNode } from 'react'
import { NavLink, Outlet } from 'react-router'
import { Dumbbell, FlaskConical, House, Map, Trophy, UserRound } from 'lucide-react'
import { useDerived } from '../state/hooks'
import { Logo, LogoMark } from './Logo'
import { Mascot } from './Mascot'
import { LevelBadge, StreakDisplay, XPDisplay } from './Stats'

const NAV = [
  { to: '/home', label: 'Home', icon: House },
  { to: '/learn', label: 'Learn', icon: Map },
  { to: '/practice', label: 'Practice', icon: Dumbbell },
  { to: '/sandbox', label: 'Sandbox', icon: FlaskConical },
  { to: '/achievements', label: 'Badges', icon: Trophy },
  { to: '/profile', label: 'Profile', icon: UserRound },
]

function SideNav() {
  return (
    <nav aria-label="Main" className="flex flex-col gap-1.5">
      {NAV.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-2xl border-2 px-4 py-2.5 font-display text-[17px] font-semibold tracking-wide transition ${
              isActive
                ? 'border-brew-300 bg-brew-50 text-brew-600'
                : 'border-transparent text-espresso-600 hover:bg-espresso-50 hover:text-espresso-800'
            }`
          }
        >
          <Icon size={24} strokeWidth={2.3} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

function BottomNav() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-espresso-100 bg-cream-50/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <div className="mx-auto grid max-w-xl grid-cols-6">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-2 text-[11px] font-bold transition ${isActive ? 'text-brew-600' : 'text-espresso-400 hover:text-espresso-600'}`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`flex h-9 w-12 items-center justify-center rounded-xl transition ${isActive ? 'bg-brew-100' : ''}`}>
                  <Icon size={22} strokeWidth={2.4} />
                </span>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export function TopStats() {
  const { streak, activeToday, progress, level } = useDerived()
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <StreakDisplay days={streak} active={activeToday} compact />
      <XPDisplay xp={progress.xp} compact />
      <NavLink to="/profile" className="ml-1 rounded-2xl" aria-label="Your level">
        <LevelBadge level={level.current} size={36} />
      </NavLink>
    </div>
  )
}

/** Main chrome: sidebar on desktop, top bar + bottom tabs on mobile. */
export function AppShell() {
  return (
    <div className="min-h-dvh lg:pl-64">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r-2 border-espresso-100 bg-cream-50 px-4 py-6 lg:flex">
        <div className="px-2">
          <Logo to="/home" />
        </div>
        <div className="mt-8">
          <SideNav />
        </div>
        <div className="mt-auto rounded-3xl border-2 border-espresso-100 bg-white p-4">
          <div className="flex items-center gap-3">
            <Mascot mood="encouraging" size={54} />
            <p className="text-sm leading-snug font-semibold text-espresso-600">A little every day beats cramming. One lesson a day keeps your streak going.</p>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b-2 border-espresso-100 bg-cream-50/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="lg:hidden">
            <NavLink to="/home" aria-label="ByteBrew home" className="flex items-center gap-2 rounded-xl">
              <LogoMark size={32} />
              <span className="hidden font-display text-xl font-bold sm:inline">
                Byte<span className="text-brew-500">Brew</span>
              </span>
            </NavLink>
          </div>
          <div className="hidden lg:block" />
          <TopStats />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-6 pb-28 sm:px-6 lg:pb-12">
        <Suspense
          fallback={
            <div className="flex min-h-[50vh] items-center justify-center" aria-label="Loading">
              <Mascot mood="thinking" size={84} float />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <BottomNav />
    </div>
  )
}

/** Two-column page with an optional right rail on wide screens. */
export function PageLayout({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  if (!aside) return <div>{children}</div>
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0">{children}</div>
      <aside className="space-y-4">{aside}</aside>
    </div>
  )
}

export function PageTitle({ title, subtitle, icon }: { title: string; subtitle?: string; icon?: ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      {icon}
      <div>
        <h1 className="text-3xl font-bold text-espresso-900 sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-1 text-espresso-500">{subtitle}</p>}
      </div>
    </div>
  )
}
