'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, CheckCircle, Loader2, UserCheck } from 'lucide-react'

interface RsvpModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function RsvpModal({ isOpen, onClose }: RsvpModalProps) {
  const [name, setName] = useState('')
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setName('')
      setStatus('idle')
      setErrorMsg('')
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'loading' || status === 'success') return

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error || 'Error al registrar.')
        setStatus('error')
      } else {
        setStatus('success')
      }
    } catch {
      setErrorMsg('Error de conexión. Intenta de nuevo.')
      setStatus('error')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4 modal-overlay"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card w-full max-w-md p-10 relative"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-300 hover:text-white transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-4"
              >
                <CheckCircle className="w-14 h-14 text-slate-300 mx-auto mb-5 stroke-[1.5px]" />
                <h3 className="text-2xl font-serif text-white mb-3">
                  ¡Confirmado!
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Tu asistencia ha sido registrada.
                  <br />
                  Nos vemos el{' '}
                  <span className="text-white font-medium">25 de Febrero</span>.
                </p>
                <button
                  onClick={onClose}
                  className="mt-8 text-xs uppercase tracking-widest text-slate-300 hover:text-white transition-colors border-b border-transparent hover:border-white/20 pb-1"
                >
                  Cerrar
                </button>
              </motion.div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-8">
                  <UserCheck className="w-5 h-5 text-accent-blue stroke-[1.5px]" />
                  <h3 className="text-sm uppercase tracking-[0.4em] text-slate-300 font-bold">
                    Confirmar Asistencia
                  </h3>
                </div>

                <p className="text-slate-300 text-sm mb-8 leading-relaxed">
                  Ingresa tu nombre para confirmar tu asistencia a la defensa de
                  tesis de <span className="text-white">Steven Sagnay</span>.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="rsvp-name"
                      className="block text-xs uppercase tracking-widest text-slate-400 mb-2"
                    >
                      Nombre completo
                    </label>
                    <input
                      ref={inputRef}
                      id="rsvp-name"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value)
                        if (status === 'error') setStatus('idle')
                      }}
                      placeholder="Tu nombre"
                      className="w-full bg-transparent border border-white/10 focus:border-accent-blue/60 outline-none px-4 py-3 text-white text-sm placeholder-slate-600 transition-colors rounded-none"
                      disabled={status === 'loading'}
                      required
                      minLength={2}
                    />
                    {status === 'error' && (
                      <p className="text-red-400/80 text-[11px] mt-2">
                        {errorMsg}
                      </p>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={status === 'loading' || !name.trim()}
                    whileHover={
                      status !== 'loading' && name.trim()
                        ? { scale: 1.03, backgroundColor: '#f1f5f9' }
                        : {}
                    }
                    whileTap={status !== 'loading' ? { scale: 0.97 } : {}}
                    className="w-full bg-white text-navy-deep py-4 text-sm font-bold uppercase tracking-[0.3em] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Registrando…
                      </>
                    ) : (
                      'Confirmar'
                    )}
                  </motion.button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
