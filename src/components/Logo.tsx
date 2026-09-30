import { Link } from 'react-router'

export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <line x1="32" y1="10" x2="32" y2="4" stroke="#241812" strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="4.5" r="3.5" fill="#ff8a45" stroke="#241812" strokeWidth="2" />
      <rect x="3" y="24" width="7" height="14" rx="3" fill="#f76f22" stroke="#241812" strokeWidth="2" />
      <rect x="54" y="24" width="7" height="14" rx="3" fill="#f76f22" stroke="#241812" strokeWidth="2" />
      <rect x="7" y="10" width="50" height="44" rx="15" fill="#fff5e8" stroke="#241812" strokeWidth="3" />
      <rect x="13" y="16" width="38" height="30" rx="10" fill="#2a1d17" />
      <path d="M19 31 Q23.5 25 28 31" stroke="#6cdbae" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M36 31 Q40.5 25 45 31" stroke="#6cdbae" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M27 37 Q32 41 37 37" stroke="#6cdbae" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-display text-2xl font-bold leading-none tracking-tight ${className}`}>
      <span className="text-espresso-900">Byte</span>
      <span className="text-brew-500">Brew</span>
    </span>
  )
}

export function Logo({ to = '/', compact = false }: { to?: string; compact?: boolean }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2 rounded-xl" aria-label="ByteBrew home">
      <LogoMark />
      {!compact && <Wordmark />}
    </Link>
  )
}
