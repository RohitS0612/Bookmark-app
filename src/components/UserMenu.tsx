'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function UserMenu({ email }: { email: string | undefined }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  
  const initial = email ? email[0].toUpperCase() : '?'

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-black text-white hover:bg-white/10 transition-all shadow-lg hover:border-white/20 active:scale-95 translate-y-[-1px]"
      >
        {initial}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute right-0 mt-4 w-64 glass-dark border border-white/10 rounded-2xl shadow-2xl p-4 z-[100] origin-top-right overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] bg-blue-500/10 blur-xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="mb-4 px-2">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Signed in as</p>
                <p className="text-sm font-bold text-gray-200 truncate">{email}</p>
              </div>

              <div className="h-px bg-white/5 mb-4" />

              <form action="/auth/signout" method="post">
                <button 
                  type="submit"
                  className="w-full group flex items-center justify-between gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all px-4 py-3 rounded-xl border border-white/5 hover:border-red-500/20 hover:bg-red-500/10"
                >
                  <span>Sign Out</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
