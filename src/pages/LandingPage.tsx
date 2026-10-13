import { motion } from 'motion/react'
import { Brain, FlaskConical, Flame, Map, Trophy, Zap } from 'lucide-react'
import { ButtonLink } from '../components/Button'
import { CodeBlock } from '../components/CodeBlock'
import { Logo } from '../components/Logo'
import { Mascot, MascotSays } from '../components/Mascot'
import { UNITS } from '../data/curriculum'
import { useProgress } from '../state/hooks'
import { UNIT_STYLES } from '../lib/unitStyles'
import { AppIcon } from '../components/AppIcon'
import signatureUrl from '../assets/signature.webp'

const FLOATERS = [
  { text: 'int streak = 7;', className: 'top-2 -left-4 rotate-[-6deg]', delay: 0 },
  { text: 'if (coffee > 0) {', className: 'top-24 -right-4 rotate-[5deg]', delay: 0.6 },
  { text: 'while (learning) xp++;', className: 'bottom-10 -left-6 rotate-[4deg]', delay: 1.2 },
  { text: 'System.out.println("Hi!");', className: 'bottom-0 right-0 rotate-[-4deg]', delay: 1.8 },
]

function Feature({ icon, title, body, tint }: { icon: React.ReactNode; title: string; body: string; tint: string }) {
  return (
    <div className="rounded-3xl border-2 border-espresso-100 bg-white p-6 shadow-[0_4px_0_var(--color-espresso-100)]">
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${tint}`}>{icon}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-1.5 leading-relaxed text-espresso-600">{body}</p>
    </div>
  )
}

export function LandingPage() {
  const p = useProgress()
  const cta = p.onboarded ? { to: '/home', label: 'Continue learning' } : { to: '/start', label: 'Start learning' }
  return (
    <div className="min-h-dvh overflow-x-hidden bg-cream-50">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Logo />
        <ButtonLink to={cta.to} variant="secondary" size="sm">
          {p.onboarded ? 'Dashboard' : 'Get started'}
        </ButtonLink>
      </header>

      {/* hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-6 pb-16 sm:px-6 lg:grid-cols-2 lg:pt-12">
        <div>
          <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-4 text-5xl leading-[1.05] font-bold text-espresso-900 sm:text-6xl">
            Learn Java one <span className="relative whitespace-nowrap text-brew-500">byte<svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 120 12" aria-hidden><path d="M2 8 Q30 2 60 7 T118 5" stroke="#ffc21f" strokeWidth="5" fill="none" strokeLinecap="round" /></svg></span> at a time.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-5 max-w-lg text-lg leading-relaxed text-espresso-600">
            Short lessons, quick feedback and Mr. Lauder in your corner. We start with your very first variable and finish with a real program that you built yourself.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to={cta.to} size="lg" className="whitespace-nowrap">
              {cta.label}
            </ButtonLink>
            {!p.onboarded && (
              <ButtonLink to="/start?mode=placement" size="lg" variant="secondary" className="whitespace-nowrap">
                I already know some Java
              </ButtonLink>
            )}
          </motion.div>
          <div className="mt-8 flex flex-wrap gap-5 text-sm font-bold text-espresso-500">
            <span className="flex items-center gap-1.5">
              <Flame size={18} className="text-brew-500" /> Daily streaks
            </span>
            <span className="flex items-center gap-1.5">
              <Zap size={18} className="text-sun-600" /> XP & 6 levels
            </span>
            <span className="flex items-center gap-1.5">
              <FlaskConical size={18} className="text-mint-600" /> Runs Java in your browser
            </span>
          </div>
        </div>

        <div className="relative mx-auto h-[380px] w-full max-w-[440px] sm:h-[420px]">
          <div className="absolute inset-6 rounded-[48px] bg-gradient-to-br from-brew-200 via-sun-100 to-mint-100" />
          <div className="paper-dots absolute inset-6 rounded-[48px] opacity-60" />
          {FLOATERS.map((f) => (
            <motion.div
              key={f.text}
              className={`absolute z-10 hidden rounded-xl border-2 border-espresso-900 bg-code-bg px-3 py-1.5 font-mono text-sm text-code-text shadow-[0_3px_0_var(--color-espresso-900)] sm:block ${f.className}`}
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3.4, delay: f.delay }}
            >
              {f.text}
            </motion.div>
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <Mascot mood="excited" size={230} float />
          </div>
        </div>
      </section>

      {/* sample question */}
      <section className="border-y-2 border-espresso-100 bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 className="text-4xl font-bold">We learn Java by doing it, not by staring at walls of text.</h2>
            <p className="mt-4 text-lg leading-relaxed text-espresso-600">
              Every lesson follows the same rhythm. First a short explanation, then an example you can run yourself, then a few questions with feedback right away. Get one wrong? Mr. Lauder shows you <em>why</em>, gives you another try, and follows up with an easier question.
            </p>
            <ul className="mt-6 grid gap-2 text-espresso-700 sm:grid-cols-2">
              {['Predict the output', 'Fill in the blank', 'Find the bug', 'Arrange the code', 'Fix broken programs', 'Write real code'].map((t) => (
                <li key={t} className="flex items-center gap-2 font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full bg-brew-400" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <CodeBlock
              code={'int x = 5;\nint y = 3;\nSystem.out.println(x + y);'}
              title="Predict the output"
            />
            <div className="grid grid-cols-4 gap-2">
              {['2', '8', '15', '53'].map((o, i) => (
                <div key={o} className={`rounded-2xl border-2 py-3 text-center font-mono text-lg font-bold ${i === 1 ? 'border-mint-500 bg-mint-50 text-mint-700 shadow-[0_4px_0_var(--color-mint-500)]' : 'border-espresso-200 bg-white shadow-[0_4px_0_var(--color-espresso-200)]'}`}>
                  {o}
                </div>
              ))}
            </div>
            <MascotSays mood="happy" size={70} tone="success">
              Right! With two ints, <code className="font-mono">+</code> adds them: 5 + 3 is 8. <span className="font-bold text-sun-700">+10 XP</span>
            </MascotSays>
          </div>
        </div>
      </section>

      {/* features */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-4xl font-bold">Everything you need for your first year of Java</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <Feature icon={<Map className="text-brew-600" />} tint="bg-brew-100" title="A clear path" body="8 units that follow our course in order, from variables to exceptions, ending with a real multi-stage project." />
          <Feature icon={<Brain className="text-grape-600" />} tint="bg-grape-100" title="Adapts to you" body="Questions get harder as you improve, and practice mode works on the topics you find tricky." />
          <Feature icon={<FlaskConical className="text-mint-600" />} tint="bg-mint-100" title="Real Java sandbox" body="Run and edit code right in your browser, and step through it line by line." />
          <Feature icon={<Trophy className="text-sun-700" />} tint="bg-sun-100" title="Fun to stick with" body="Earn XP, keep your streak going, level up and collect badges." />
        </div>
      </section>

      {/* path preview */}
      <section className="bg-espresso-900 text-cream-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-4xl font-bold">Your learning path</h2>
          <p className="mt-2 text-center text-cream-200">Not sure where to start? A short placement test will find your level.</p>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {UNITS.map((u) => {
              const s = UNIT_STYLES[u.color]
              return (
                <li key={u.id} className={`rounded-3xl border-2 ${s.border} bg-gradient-to-br ${s.gradient} p-4 text-white shadow-[0_4px_0_var(--shade)]`} style={{ ['--shade' as string]: s.shade }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold tracking-widest text-white/80 uppercase">Unit {u.number}</span>
                    <AppIcon name={u.icon} size={26} className="text-white/90" />
                  </div>
                  <div className="mt-2 font-display text-lg leading-tight font-bold">{u.title}</div>
                  <div className="mt-1 text-sm text-white/85">{u.lessons.length} lessons + checkpoint</div>
                </li>
              )
            })}
          </ol>
          <div className="mt-6 flex items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-sun-400/60 p-4 text-center font-display text-lg text-sun-200">
            <AppIcon name="flag" size={22} className="mr-2 inline-block align-[-4px]" />
            Then: your final project. Pick one of six, from a Shopping Cart to a Java Quiz, and build it yourself!
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center sm:px-6">
        <Mascot mood="encouraging" size={140} float />
        <h2 className="mt-4 text-4xl font-bold">Ready for your first byte?</h2>
        <p className="mt-2 text-lg text-espresso-600">Five minutes a day is all it takes.</p>
        <ButtonLink to={cta.to} size="lg" className="mt-6">
          {cta.label}
        </ButtonLink>
      </section>

      <footer className="border-t-2 border-espresso-100 py-8 text-center text-sm text-espresso-400">
        <p className="font-semibold text-espresso-500">ByteBrew - Your chance to get good at java</p>
        <img src={signatureUrl} alt="ByteBrew signature" className="mx-auto mt-4 h-16 w-auto max-w-full object-contain opacity-80 sm:h-20" />
      </footer>
    </div>
  )
}
