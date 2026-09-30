import { Link } from 'react-router'

export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden><circle cx="32.0" cy="14.0" r="10" fill="#f6b922" stroke="#241812" strokeWidth="3"/><circle cx="43.2" cy="17.6" r="10" fill="#f6b922" stroke="#241812" strokeWidth="3"/><circle cx="50.1" cy="27.1" r="10" fill="#f6b922" stroke="#241812" strokeWidth="3"/><circle cx="50.1" cy="38.9" r="10" fill="#f6b922" stroke="#241812" strokeWidth="3"/><circle cx="43.2" cy="48.4" r="10" fill="#f6b922" stroke="#241812" strokeWidth="3"/><circle cx="32.0" cy="52.0" r="10" fill="#f6b922" stroke="#241812" strokeWidth="3"/><circle cx="20.8" cy="48.4" r="10" fill="#f6b922" stroke="#241812" strokeWidth="3"/><circle cx="13.9" cy="38.9" r="10" fill="#f6b922" stroke="#241812" strokeWidth="3"/><circle cx="13.9" cy="27.1" r="10" fill="#f6b922" stroke="#241812" strokeWidth="3"/><circle cx="20.8" cy="17.6" r="10" fill="#f6b922" stroke="#241812" strokeWidth="3"/><circle cx="32.0" cy="14.0" r="10" fill="#f6b922"/><circle cx="43.2" cy="17.6" r="10" fill="#f6b922"/><circle cx="50.1" cy="27.1" r="10" fill="#f6b922"/><circle cx="50.1" cy="38.9" r="10" fill="#f6b922"/><circle cx="43.2" cy="48.4" r="10" fill="#f6b922"/><circle cx="32.0" cy="52.0" r="10" fill="#f6b922"/><circle cx="20.8" cy="48.4" r="10" fill="#f6b922"/><circle cx="13.9" cy="38.9" r="10" fill="#f6b922"/><circle cx="13.9" cy="27.1" r="10" fill="#f6b922"/><circle cx="20.8" cy="17.6" r="10" fill="#f6b922"/><circle cx="32" cy="33" r="26" fill="#fbd04a"/><circle cx="14" cy="14" r="7" fill="#d98a3d" stroke="#241812" strokeWidth="2.5"/><circle cx="14" cy="14.5" r="3" fill="#f2c592"/><circle cx="50" cy="14" r="7" fill="#d98a3d" stroke="#241812" strokeWidth="2.5"/><circle cx="50" cy="14.5" r="3" fill="#f2c592"/><ellipse cx="32" cy="36" rx="21" ry="19" fill="#d98a3d" stroke="#241812" strokeWidth="3"/><ellipse cx="32" cy="43" rx="11" ry="8.5" fill="#f2c592" stroke="#241812" strokeWidth="2"/><path d="M26.5 38 Q32 34 37.5 38 Q37 43 32 45 Q27 43 26.5 38 Z" fill="#241812" stroke="#241812" strokeWidth="1.5" strokeLinejoin="round"/><ellipse cx="22.5" cy="31" rx="5" ry="5.5" fill="#fff" stroke="#241812" strokeWidth="2"/><circle cx="22.5" cy="31.5" r="3.2" fill="#241812"/><circle cx="23.6" cy="30.2" r="1.1" fill="#fff"/><ellipse cx="41.5" cy="31" rx="5" ry="5.5" fill="#fff" stroke="#241812" strokeWidth="2"/><circle cx="41.5" cy="31.5" r="3.2" fill="#241812"/><circle cx="42.6" cy="30.2" r="1.1" fill="#fff"/><path d="M32 45 V47.5 M32 47.5 Q27.5 52 24 48.5 M32 47.5 Q36.5 52 40 48.5" stroke="#241812" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
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
