import {
  Bomb,
  Bot,
  BookOpen,
  Bug,
  BrickWall,
  Brain,
  Calculator,
  CircleCheck,
  CircleX,
  Coffee,
  Compass,
  Construction,
  Crown,
  Dices,
  Divide,
  Dumbbell,
  Flag,
  Flame,
  FlaskConical,
  Gamepad2,
  Footprints,
  GitBranch,
  GraduationCap,
  Handshake,
  Heart,
  HeartCrack,
  Keyboard,
  Landmark,
  Laugh,
  Layers,
  Lightbulb,
  Medal,
  Megaphone,
  Package,
  PartyPopper,
  PenLine,
  Printer,
  Puzzle,
  Recycle,
  Repeat,
  Repeat1,
  RefreshCw,
  Rocket,
  Ruler,
  Scale,
  ShoppingCart,
  ShieldCheck,
  Sparkles,
  Sprout,
  Star,
  Sun,
  Swords,
  Target,
  ThumbsDown,
  ThumbsUp,
  Timer,
  Trophy,
  TriangleAlert,
  Type,
  Zap,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react'
import type { ComponentType } from 'react'
import type { IconName } from '../data/types'

/** A football in the same line style as the rest of the icons (lucide has none). */
function Football({ size = 24, strokeWidth = 2, className = '', ...rest }: LucideProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...rest}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 7.5l4.3 3.1-1.6 5h-5.4l-1.6-5z" />
      <path d="M12 7.5V2.3M16.3 10.6l4.9-1.6M14.7 15.6l3 4.2M9.3 15.6l-3 4.2M7.7 10.6L2.8 9" />
    </svg>
  )
}

const ICONS: Record<IconName, LucideIcon | ComponentType<LucideProps>> = {
  alert: TriangleAlert,
  bank: Landmark,
  bot: Bot,
  cart: ShoppingCart,
  football: Football,
  gamepad: Gamepad2,
  handshake: Handshake,
  heart: Heart,
  laugh: Laugh,
  megaphone: Megaphone,
  sun: Sun,
  swords: Swords,
  'x-circle': CircleX,
  bomb: Bomb,
  book: BookOpen,
  'brick-wall': BrickWall,
  brain: Brain,
  bug: Bug,
  calculator: Calculator,
  'check-circle': CircleCheck,
  coffee: Coffee,
  compass: Compass,
  construction: Construction,
  crown: Crown,
  dice: Dices,
  divide: Divide,
  dumbbell: Dumbbell,
  flag: Flag,
  flame: Flame,
  flask: FlaskConical,
  footsteps: Footprints,
  'git-branch': GitBranch,
  graduation: GraduationCap,
  'heart-crack': HeartCrack,
  keyboard: Keyboard,
  layers: Layers,
  lightbulb: Lightbulb,
  medal: Medal,
  package: Package,
  party: PartyPopper,
  pen: PenLine,
  printer: Printer,
  puzzle: Puzzle,
  recycle: Recycle,
  refresh: RefreshCw,
  repeat: Repeat,
  'repeat-once': Repeat1,
  rocket: Rocket,
  ruler: Ruler,
  scale: Scale,
  shield: ShieldCheck,
  sparkles: Sparkles,
  sprout: Sprout,
  star: Star,
  target: Target,
  'thumbs-down': ThumbsDown,
  'thumbs-up': ThumbsUp,
  timer: Timer,
  trophy: Trophy,
  type: Type,
  zap: Zap,
}

/** One of the app's line icons, looked up by name so lesson data can stay plain text. */
export function AppIcon({ name, size = 20, className = '', strokeWidth = 2.4 }: { name: IconName; size?: number; className?: string; strokeWidth?: number }) {
  const Icon = ICONS[name]
  return <Icon size={size} strokeWidth={strokeWidth} className={className} aria-hidden />
}

const DOT_COLOR = ['', 'bg-mint-500', 'bg-sun-400', 'bg-berry-500']

/** A small colored dot for a question difficulty (1 beginner, 2 intermediate, 3 advanced). */
export function DifficultyDot({ level, size = 10 }: { level: 1 | 2 | 3; size?: number }) {
  return <span aria-hidden className={`inline-block shrink-0 rounded-full border border-espresso-900/25 align-middle ${DOT_COLOR[level]}`} style={{ width: size, height: size }} />
}

/** The dots for every difficulty up to and including `upTo`. */
export function DifficultyDots({ upTo, size }: { upTo: 1 | 2 | 3; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {([1, 2, 3] as const).filter((d) => d <= upTo).map((d) => (
        <DifficultyDot key={d} level={d} size={size} />
      ))}
    </span>
  )
}
