import type { UnitColor } from '../data/types'

export interface UnitStyle {
  /** solid fill */
  bg: string
  /** soft background */
  soft: string
  /** darker border */
  border: string
  text: string
  /** CSS color for the pressed-button shadow */
  shade: string
  hex: string
  gradient: string
}

export const UNIT_STYLES: Record<UnitColor, UnitStyle> = {
  brew: { bg: 'bg-brew-500', soft: 'bg-brew-50', border: 'border-brew-700', text: 'text-brew-600', shade: 'var(--color-brew-700)', hex: '#f76f22', gradient: 'from-brew-400 to-brew-600' },
  sky: { bg: 'bg-sky-500', soft: 'bg-sky-50', border: 'border-sky-700', text: 'text-sky-600', shade: 'var(--color-sky-700)', hex: '#2388e6', gradient: 'from-sky-400 to-sky-600' },
  grape: { bg: 'bg-grape-500', soft: 'bg-grape-50', border: 'border-grape-700', text: 'text-grape-600', shade: 'var(--color-grape-700)', hex: '#7f55e6', gradient: 'from-grape-400 to-grape-600' },
  mint: { bg: 'bg-mint-500', soft: 'bg-mint-50', border: 'border-mint-700', text: 'text-mint-600', shade: 'var(--color-mint-700)', hex: '#17ad76', gradient: 'from-mint-400 to-mint-600' },
  berry: { bg: 'bg-berry-500', soft: 'bg-berry-50', border: 'border-berry-700', text: 'text-berry-600', shade: 'var(--color-berry-700)', hex: '#ec3a63', gradient: 'from-berry-400 to-berry-600' },
  sun: { bg: 'bg-sun-500', soft: 'bg-sun-50', border: 'border-sun-700', text: 'text-sun-700', shade: 'var(--color-sun-700)', hex: '#f2a900', gradient: 'from-sun-400 to-sun-600' },
  teal: { bg: 'bg-teal-500', soft: 'bg-teal-50', border: 'border-teal-700', text: 'text-teal-600', shade: 'var(--color-teal-700)', hex: '#12a0a4', gradient: 'from-teal-400 to-teal-600' },
  cocoa: { bg: 'bg-cocoa-500', soft: 'bg-cocoa-50', border: 'border-cocoa-700', text: 'text-cocoa-600', shade: 'var(--color-cocoa-700)', hex: '#966041', gradient: 'from-cocoa-400 to-cocoa-600' },
}
