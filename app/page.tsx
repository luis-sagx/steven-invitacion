'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import {
  Calendar,
  Clock,
  MapPin,
  Dna,
  Map as MapIcon,
  FlaskConical,
  Microscope,
} from 'lucide-react'
import dynamic from 'next/dynamic'
import RsvpModal from '@/components/RsvpModal'

const BiotechBackground = dynamic(
  () => import('@/components/BiotechBackground'),
  { ssr: false },
)

const ESPE_MAPS_URL =
  'https://www.google.com/maps/search/Universidad+de+las+Fuerzas+Armadas+ESPE+Sangolqu%C3%AD+Pichincha+Ecuador'

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <BiotechBackground />

      <main className="relative z-10 w-full max-w-4xl px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          {/* DNA double-helix animation – spins on its Y axis for a 3-D feel */}
          <motion.div
            animate={{ rotateY: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-6"
            style={{ perspective: 400 }}
          >
            <Dna className="text-slate-300 w-12 h-12 stroke-[1px]" />
          </motion.div>

          <h2 className="text-sm uppercase tracking-[0.6em] text-slate-300 font-bold mb-4">
            Invitación
          </h2>

          <div className="h-[1px] w-16 bg-accent-blue/40 mx-auto mb-10" />

          <h1 className="text-lg md:text-xl font-serif italic text-slate-300 mb-4">
            Defensa de Proyecto de Titulación
          </h1>

          <p className="text-4xl md:text-6xl font-serif text-white mb-6 tracking-tight">
            Steven Sagnay
          </p>

          <p className="text-xs uppercase tracking-[0.4em] text-slate-400 mb-16">
            Ingeniería en Biotecnología
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card px-6 py-8 sm:px-10 sm:py-10 md:p-12 mb-12 relative overflow-hidden group"
        >
          <div className="grid grid-cols-3 gap-2 sm:gap-4 divide-x divide-white/10">
            <div className="flex flex-col items-center justify-center px-2 sm:px-4 py-2">
              <Calendar className="text-slate-300 mb-2 sm:mb-3 w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5px]" />
              <p className="text-sm sm:text-base md:text-lg font-serif text-white leading-tight">
                <span className="hidden sm:inline">25 de Febrero, 2026</span>
                <span className="sm:hidden">
                  25 Feb
                  <br />
                  2026
                </span>
              </p>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-400 mt-1">
                Fecha
              </span>
            </div>

            <div className="flex flex-col items-center justify-center px-2 sm:px-4 py-2">
              <Clock className="text-slate-300 mb-2 sm:mb-3 w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5px]" />
              <p className="text-sm sm:text-base md:text-lg font-serif text-white">
                12:00 PM
              </p>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-400 mt-1">
                Hora
              </span>
            </div>

            <div className="flex flex-col items-center justify-center px-2 sm:px-4 py-2">
              <MapPin className="text-slate-300 mb-2 sm:mb-3 w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5px]" />
              <p className="text-sm sm:text-base md:text-lg font-serif text-white leading-tight">
                <span className="hidden sm:inline">Universidad ESPE</span>
                <span className="sm:hidden">ESPE</span>
              </p>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-400 mt-1">
                Salón 2001
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col items-center gap-8"
        >
          <motion.button
            onClick={() => setIsModalOpen(true)}
            whileHover={{ scale: 1.05, backgroundColor: '#f1f5f9' }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-navy-deep px-12 py-5 text-sm font-bold uppercase tracking-[0.3em] transition-all duration-300 shadow-2xl"
          >
            Confirmar Asistencia
          </motion.button>

          <div className="flex gap-4">
            <span className="text-slate-500">•</span>
            <a
              href={ESPE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 uppercase tracking-widest text-slate-400 hover:text-white transition-colors border-b border-transparent hover:border-white/20 pb-1"
            >
              <MapIcon className="w-3 h-3" />
              Ver Ubicación
            </a>
          </div>
        </motion.div>

        <footer className="mt-32">
          <div className="flex justify-center gap-12 grayscale hover:opacity-50 transition-opacity">
            <Microscope className="w-10 h-10 stroke-[1px]" />
            <Dna className="w-10 h-10 stroke-[1px]" />
            <FlaskConical className="w-10 h-10 stroke-[1px]" />
          </div>

          <p className="text-xs uppercase tracking-[0.5em] text-slate-400 mt-12">
            25-02-2026 · Defensa de Tesis · Steven Sagnay · ESPE
          </p>
        </footer>
      </main>

      <RsvpModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
