import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'sky' | 'sun' | 'dark'
export type ButtonSize = 'sm' | 'md' | 'lg'

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-brew-500 text-white border-brew-700 shadow-[0_4px_0_var(--color-brew-700)] hover:bg-brew-400 active:shadow-[0_1px_0_var(--color-brew-700)]',
  secondary:
    'bg-white text-espresso-800 border-espresso-200 shadow-[0_4px_0_var(--color-espresso-200)] hover:bg-cream-100 active:shadow-[0_1px_0_var(--color-espresso-200)]',
  success:
    'bg-mint-500 text-white border-mint-700 shadow-[0_4px_0_var(--color-mint-700)] hover:bg-mint-400 active:shadow-[0_1px_0_var(--color-mint-700)]',
  danger:
    'bg-berry-500 text-white border-berry-700 shadow-[0_4px_0_var(--color-berry-700)] hover:bg-berry-400 active:shadow-[0_1px_0_var(--color-berry-700)]',
  sky: 'bg-sky-500 text-white border-sky-700 shadow-[0_4px_0_var(--color-sky-700)] hover:bg-sky-400 active:shadow-[0_1px_0_var(--color-sky-700)]',
  sun: 'bg-sun-400 text-espresso-900 border-sun-600 shadow-[0_4px_0_var(--color-sun-600)] hover:bg-sun-300 active:shadow-[0_1px_0_var(--color-sun-600)]',
  dark: 'bg-espresso-800 text-cream-50 border-espresso-900 shadow-[0_4px_0_var(--color-espresso-900)] hover:bg-espresso-700 active:shadow-[0_1px_0_var(--color-espresso-900)]',
  ghost: 'bg-transparent text-espresso-600 border-transparent hover:bg-espresso-100/70 shadow-none',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-2 text-sm rounded-xl gap-1.5',
  md: 'px-5 py-3 text-base rounded-2xl gap-2',
  lg: 'px-7 py-4 text-lg rounded-2xl gap-2.5',
}

const DISABLED =
  'disabled:bg-espresso-100 disabled:text-espresso-300 disabled:border-espresso-200 disabled:shadow-none disabled:translate-y-0 disabled:hover:bg-espresso-100'

export function buttonClass(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', extra = '') {
  return [
    'inline-flex select-none items-center justify-center border-2 font-display font-semibold tracking-wide uppercase transition-[transform,box-shadow,background-color] duration-100 active:translate-y-[3px]',
    variant === 'ghost' ? 'active:translate-y-0 normal-case tracking-normal' : '',
    VARIANTS[variant],
    SIZES[size],
    DISABLED,
    extra,
  ].join(' ')
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: ReactNode
  full?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', icon, full, className = '', children, type = 'button', ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} className={buttonClass(variant, size, `${full ? 'w-full' : ''} ${className}`)} {...rest}>
      {icon}
      {children}
    </button>
  )
})

interface ButtonLinkProps extends LinkProps {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: ReactNode
  full?: boolean
}

export function ButtonLink({ variant = 'primary', size = 'md', icon, full, className = '', children, ...rest }: ButtonLinkProps) {
  return (
    <Link className={buttonClass(variant, size, `${full ? 'w-full' : ''} ${className}`)} {...rest}>
      {icon}
      {children}
    </Link>
  )
}
