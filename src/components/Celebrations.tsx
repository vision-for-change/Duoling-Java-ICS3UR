import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { getAchievement } from '../engine/achievements'
import type { LevelInfo } from '../engine/gamification'
import { celebrate, sessionFlag } from '../lib/motion'
import { sfx } from '../lib/sound'
import { useStoreEvents } from '../state/hooks'
import type { StoreEvent } from '../state/store'
import { AchievementBadge } from './AchievementBadge'
import { Button } from './Button'
import { Mascot } from './Mascot'
import { Modal } from './Modal'

interface Toast {
  id: number
  achievementId: string
}

let toastId = 0

/** Global layer for achievement toasts and level-up celebrations outside of lessons. */
export function CelebrationLayer() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [levelUp, setLevelUp] = useState<LevelInfo | null>(null)

  const onEvent = useCallback((e: StoreEvent) => {
    if (sessionFlag.active) return
    if (e.type === 'achievement') {
      const id = ++toastId
      setToasts((t) => [...t, { id, achievementId: e.id }])
      sfx.achievement()
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4800)
    }
    if (e.type === 'level-up') {
      setLevelUp(e.level)
      sfx.levelUp()
      celebrate('big')
    }
  }, [])
  useStoreEvents(onEvent)

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex flex-col items-center gap-2 px-4 lg:top-5 lg:right-5 lg:bottom-auto lg:left-auto lg:items-end" aria-live="polite">
        <AnimatePresence>
          {toasts.map((t) => (
            <AchievementToast key={t.id} achievementId={t.achievementId} />
          ))}
        </AnimatePresence>
      </div>
      <LevelUpModal level={levelUp} onClose={() => setLevelUp(null)} />
    </>
  )
}

export function AchievementToast({ achievementId }: { achievementId: string }) {
  const def = getAchievement(achievementId)
  if (!def) return null
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border-2 border-espresso-900 bg-white p-3 shadow-[0_4px_0_var(--color-espresso-900)]"
    >
      <AchievementBadge def={def} unlocked size={52} />
      <div>
        <div className="text-xs font-extrabold tracking-wider text-brew-600 uppercase">Achievement unlocked!</div>
        <div className="font-display text-lg leading-tight font-semibold">{def.title}</div>
        <div className="text-sm text-espresso-500">{def.description}</div>
      </div>
    </motion.div>
  )
}

export function LevelUpModal({ level, onClose }: { level: LevelInfo | null; onClose: () => void }) {
  useEffect(() => {
    if (level) celebrate('big')
  }, [level])
  return (
    <Modal open={!!level} onClose={onClose} size="sm" dismissible>
      {level && (
        <div className="flex flex-col items-center text-center">
          <Mascot mood="celebrating" size={150} float />
          <div className="mt-2 text-sm font-extrabold tracking-widest text-brew-600 uppercase">Java level up!</div>
          <h2 className="mt-1 text-3xl font-bold">
            Level {level.level} {level.emoji}
          </h2>
          <p className="mt-1 font-display text-xl text-espresso-600">{level.title}</p>
          <Button className="mt-5" full onClick={onClose} data-autofocus>
            Keep brewing
          </Button>
        </div>
      )}
    </Modal>
  )
}
