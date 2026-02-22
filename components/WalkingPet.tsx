'use client'

import { useEffect } from 'react'
import { motion, useAnimationControls } from 'motion/react'
import Image from 'next/image'

export default function WalkingPet() {
  const controls = useAnimationControls()

  useEffect(() => {
    let cancelled = false

    async function walk() {
      // start just off-screen left
      controls.set({ x: '-60px' })

      while (!cancelled) {
        // hop to the center (~50vw)
        await controls.start({
          x: 'calc(50vw - 48px)',
          transition: { duration: 8, ease: 'linear' },
        })
        if (cancelled) break

        // pause at center
        await new Promise((r) => setTimeout(r, 900))
        if (cancelled) break

        // walk back off-screen left
        await controls.start({
          x: '-60px',
          transition: { duration: 8, ease: 'linear' },
        })
        if (cancelled) break

        // brief pause before next loop
        await new Promise((r) => setTimeout(r, 400))
      }
    }

    walk()
    return () => {
      cancelled = true
      controls.stop()
    }
  }, [controls])

  return (
    <motion.div
      animate={controls}
      initial={{ x: '-80px' }}
      className="fixed bottom-4 left-0 z-40 pointer-events-none select-none"
    >
      {/* hop: quick up-down bounce in sync with steps */}
      <motion.div
        animate={{ y: [0, -10, 0, -7, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Image
          src="/mono.png"
          alt="mono caminando"
          width={60}
          height={60}
          className="object-contain"
          draggable={false}
        />
      </motion.div>
    </motion.div>
  )
}
