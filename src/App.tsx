import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react'
import { MotionConfig } from 'motion/react'
import { createBrowserRouter, Navigate, Outlet, RouterProvider, ScrollRestoration } from 'react-router'
import { CelebrationLayer } from './components/Celebrations'
import { Mascot } from './components/Mascot'
import { AppShell } from './components/Navbar'
import { RouteError } from './components/RouteError'
import { useProgress } from './state/hooks'
import { store } from './state/store'
import { DashboardPage } from './pages/DashboardPage'
import { LandingPage } from './pages/LandingPage'
import { LearnPage } from './pages/LearnPage'
import { NotFoundPage } from './pages/NotFoundPage'

// Heavier screens (lesson player, Java sandbox, final project…) load on demand.
const AchievementsPage = lazy(() => import('./pages/AchievementsPage').then((m) => ({ default: m.AchievementsPage })))
const FinalPage = lazy(() => import('./pages/FinalPage').then((m) => ({ default: m.FinalPage })))
const GuidePage = lazy(() => import('./pages/GuidePage').then((m) => ({ default: m.GuidePage })))
const LessonPage = lazy(() => import('./pages/LessonPage').then((m) => ({ default: m.LessonPage })))
const CheckpointPage = lazy(() => import('./pages/LessonPage').then((m) => ({ default: m.CheckpointPage })))
const OnboardingPage = lazy(() => import('./pages/OnboardingPage').then((m) => ({ default: m.OnboardingPage })))
const PlacementPage = lazy(() => import('./pages/PlacementPage').then((m) => ({ default: m.PlacementPage })))
const PracticePage = lazy(() => import('./pages/PracticePage').then((m) => ({ default: m.PracticePage })))
const PracticeSessionPage = lazy(() => import('./pages/PracticePage').then((m) => ({ default: m.PracticeSessionPage })))
const ProfilePage = lazy(() => import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage })))
const SandboxPage = lazy(() => import('./pages/SandboxPage').then((m) => ({ default: m.SandboxPage })))

function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" aria-label="Loading">
      <Mascot mood="thinking" size={96} float />
    </div>
  )
}

/** Only onboarded learners can enter the app; everyone else starts on the landing page. */
function RequireOnboarding({ children }: { children: ReactNode }) {
  const p = useProgress()
  if (!p.onboarded) return <Navigate to="/" replace />
  return <>{children}</>
}

function Root() {
  const p = useProgress()
  const motion = p.settings.motion
  useEffect(() => {
    const reduce = motion === 'reduced'
    document.documentElement.classList.toggle('reduce-motion', reduce)
  }, [motion])
  return (
    <MotionConfig reducedMotion={motion === 'reduced' ? 'always' : motion === 'full' ? 'never' : 'user'}>
      <ScrollRestoration />
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
      <CelebrationLayer />
    </MotionConfig>
  )
}

function Home() {
  const p = useProgress()
  return p.onboarded ? <Navigate to="/home" replace /> : <LandingPage />
}

const router = createBrowserRouter([
  {
    element: <Root />,
    errorElement: <RouteError fullPage />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/welcome', element: <LandingPage /> },
      { path: '/start', element: <OnboardingPage /> },
      { path: '/placement', element: <PlacementPage /> },
      {
        element: (
          <RequireOnboarding>
            <AppShell />
          </RequireOnboarding>
        ),
        children: [
          {
            // errors inside a page keep the navigation around them
            errorElement: <RouteError />,
            children: [
              { path: '/home', element: <DashboardPage /> },
              { path: '/learn', element: <LearnPage /> },
              { path: '/practice', element: <PracticePage /> },
              { path: '/sandbox', element: <SandboxPage /> },
              { path: '/achievements', element: <AchievementsPage /> },
              { path: '/profile', element: <ProfilePage /> },
              { path: '/guide/:unitId', element: <GuidePage /> },
              { path: '/final', element: <FinalPage /> },
            ],
          },
        ],
      },
      { path: '/lesson/:lessonId', element: <RequireOnboarding><LessonPage /></RequireOnboarding> },
      { path: '/checkpoint/:unitId', element: <RequireOnboarding><CheckpointPage /></RequireOnboarding> },
      { path: '/practice/session', element: <RequireOnboarding><PracticeSessionPage /></RequireOnboarding> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export function App() {
  const [ready, setReady] = useState(store.ready)
  useEffect(() => {
    if (!store.ready) void store.hydrate().then(() => setReady(true))
  }, [])
  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Mascot mood="thinking" size={110} float />
      </div>
    )
  }
  return <RouterProvider router={router} />
}
