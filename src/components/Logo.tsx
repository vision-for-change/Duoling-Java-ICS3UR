import { useId } from 'react'
import { Link } from 'react-router'

/** Mr. Lauder's head: the site logo (the same drawing is the favicon). */
export function LogoMark({ size = 34 }: { size?: number }) {
  const gid = `logo-beard-${useId().replace(/:/g, '')}`
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2b231f"/><stop offset="0.4" stopColor="#433b36"/><stop offset="0.75" stopColor="#938e89"/><stop offset="1" stopColor="#cfccc7"/></linearGradient></defs><circle cx="11.5" cy="31" r="5" fill="#7a4a2c" stroke="#241812" strokeWidth="2.5"/><circle cx="52.5" cy="31" r="5" fill="#7a4a2c" stroke="#241812" strokeWidth="2.5"/><ellipse cx="32" cy="28" rx="20" ry="23" fill="#7a4a2c" stroke="#241812" strokeWidth="3"/><ellipse cx="24" cy="12" rx="6" ry="3" fill="#fff" opacity="0.2" transform="rotate(-18 24 12)"/><path d="M12.5 31 C12.5 45 17 54 24 58.5 C28 61 30 61.5 32 61.5 C34 61.5 36 61 40 58.5 C47 54 51.5 45 51.5 31 C50 37 47 40 44 42 C40 44.5 36 46 32 46 C28 46 24 44.5 20 42 C17 40 14 37 12.5 31 Z" fill={`url(#${gid})`} stroke="#241812" strokeWidth="2.5" strokeLinejoin="round"/><path d="M22 51 q2 -2.5 4 0 M30 55 q2 -2.5 4 0 M38 51 q2 -2.5 4 0" stroke="#ece9e4" strokeWidth="1.4" strokeLinecap="round" fill="none"/><ellipse cx="32" cy="42.5" rx="5" ry="2.4" fill="#93553a"/><path d="M24 38.5 Q28 35 32 37 Q36 35 40 38.5 Q37 41 32 39.6 Q27 41 24 38.5 Z" fill="#2b231f" stroke="#241812" strokeWidth="1.2" strokeLinejoin="round"/><path d="M27.5 41.5 Q32 45 36.5 41.5" stroke="#241812" strokeWidth="1.8" strokeLinecap="round" fill="none"/><path d="M28.5 33.5 Q32 36 35.5 33.5" stroke="#241812" strokeWidth="1.8" strokeLinecap="round" fill="none"/><path d="M18 21.5 Q22.5 19.5 27 21.5 M37 21.5 Q41.5 19.5 46 21.5" stroke="#1e1613" strokeWidth="3" strokeLinecap="round" fill="none"/><ellipse cx="22.5" cy="27" rx="4.3" ry="4.6" fill="#fff" stroke="#241812" strokeWidth="1.8"/><ellipse cx="41.5" cy="27" rx="4.3" ry="4.6" fill="#fff" stroke="#241812" strokeWidth="1.8"/><circle cx="22.5" cy="28" r="2.6" fill="#241812"/><circle cx="41.5" cy="28" r="2.6" fill="#241812"/><path d="M17.7 26.5 Q22.5 22.8 27.3 26.5 L27.3 21.8 L17.7 21.8 Z M36.7 26.5 Q41.5 22.8 46.3 26.5 L46.3 21.8 L36.7 21.8 Z" fill="#7a4a2c"/><path d="M17.9 26.5 Q22.5 22.8 27.1 26.5 M36.9 26.5 Q41.5 22.8 46.1 26.5" stroke="#241812" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
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
