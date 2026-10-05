import {
  Bomb,
  BookOpen,
  Bug,
  BrickWall,
  Brain,
  Calculator,
  CircleCheck,
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
  Footprints,
  GitBranch,
  GraduationCap,
  HeartCrack,
  Keyboard,
  Landmark,
  Layers,
  Lightbulb,
  Medal,
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
  Target,
  ThumbsDown,
  ThumbsUp,
  Timer,
  Trophy,
  TriangleAlert,
  Type,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import type { IconName } from '../data/types'

const ICONS: Record<IconName, LucideIcon> = {
  alert: TriangleAlert,
  bank: Landmark,
  cart: ShoppingCart,
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
