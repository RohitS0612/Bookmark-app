'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isDestructive?: boolean
  loading?: boolean
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  loading = false
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[101] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-sm glass rounded-3xl p-6 shadow-2xl relative overflow-hidden pointer-events-auto"
            >
              {/* Animated Glow */}
              <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 pointer-events-none rounded-full ${isDestructive ? 'bg-red-500' : 'bg-blue-500'}`} />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDestructive ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    <AlertCircle size={20} />
                  </div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">{title}</h3>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed mb-8">
                  {message}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 bg-transparent border border-white/5 rounded-2xl transition-all"
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={onConfirm}
                    disabled={loading}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-white rounded-2xl transition-all shadow-lg ${isDestructive ? 'bg-gradient-to-r from-red-600 to-red-700 shadow-red-500/20 hover:from-red-500 hover:to-red-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500'}`}
                  >
                    {loading ? 'Processing...' : confirmText}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
