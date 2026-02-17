'use client'

import { motion, AnimatePresence } from 'framer-motion'
import AddBookmarkForm from './AddBookmarkForm'

interface AddBookmarkModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  onBookmarkAdded: (bookmark: any) => void
}

export default function AddBookmarkModal({ isOpen, onClose, userId, onBookmarkAdded }: AddBookmarkModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] cursor-pointer"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] pointer-events-none p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl glass p-8 rounded-[32px] shadow-2xl relative overflow-hidden pointer-events-auto"
            >
              {/* Decorative Glow */}
              <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-blue-500/10 blur-[80px] pointer-events-none" />
              <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-purple-500/10 blur-[80px] pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-black tracking-tight text-white uppercase">New Bookmark</h2>
                      <p className="text-xs text-gray-500 font-bold tracking-widest uppercase mt-0.5">Add to your collection</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={onClose}
                    className="p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all text-gray-500 hover:text-white"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                  <AddBookmarkForm 
                    userId={userId} 
                    onBookmarkAdded={(b) => {
                      onBookmarkAdded(b)
                      onClose()
                    }} 
                  />
                </div>
              </div>

              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/30 via-indigo-500/30 to-purple-500/30" />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
