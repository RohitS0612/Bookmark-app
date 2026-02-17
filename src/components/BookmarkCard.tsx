'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'

type Bookmark = {
  id: string
  title: string
  url: string
  created_at: string
  is_favorite: boolean
}

export default function BookmarkCard({ 
  bookmark, 
  onDeleted,
  onToggleFavorite 
}: { 
  bookmark: Bookmark, 
  onDeleted?: (id: string) => void,
  onToggleFavorite?: (id: string, isFavorite: boolean) => void
}) {
  const [deleting, setDeleting] = useState(false)
  const [favoriting, setFavoriting] = useState(false)

  const handleCardClick = () => {
    window.open(bookmark.url, '_blank', 'noopener,noreferrer')
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Are you sure you want to delete this bookmark?')) return

    setDeleting(true)
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmark.id)

      if (error) throw error

      if (onDeleted) {
        onDeleted(bookmark.id)
      }
    } catch (error: any) {
      console.error('Error deleting bookmark:', error)
      alert('Failed to delete bookmark.')
      setDeleting(false)
    }
  }

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setFavoriting(true)
    try {
      const { error } = await supabase
        .from('bookmarks')
        .update({ is_favorite: !bookmark.is_favorite })
        .eq('id', bookmark.id)

      if (error) throw error

      if (onToggleFavorite) {
        onToggleFavorite(bookmark.id, !bookmark.is_favorite)
      }
    } catch (error: any) {
      console.error('Error toggling favorite:', error)
    } finally {
      setFavoriting(false)
    }
  }

  const domain = new URL(bookmark.url).hostname
  const date = new Date(bookmark.created_at)
  const formattedDate = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  const formattedTime = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })

  return (
    <motion.div 
      layout
      onClick={handleCardClick}
      whileHover={{ y: -2, scale: 1.005 }}
      whileTap={{ scale: 0.99 }}
      className="group flex flex-col p-6 glass rounded-2xl hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 cursor-pointer shadow-lg shadow-black/5 relative overflow-hidden"
    >
      {/* Top Section: Icon & Title */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl transition-all duration-500 shadow-lg ${bookmark.is_favorite ? 'bg-yellow-500/20 text-yellow-500 shadow-yellow-500/10' : 'bg-blue-600/20 text-blue-400 shadow-blue-600/10'}`}>
          {bookmark.title[0].toUpperCase()}
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={handleToggleFavorite}
            disabled={favoriting}
            className={`p-2 rounded-xl transition-all duration-300 ${bookmark.is_favorite ? 'text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 opacity-100' : 'text-gray-500 hover:text-yellow-500 hover:bg-white/5 border border-transparent group-hover:opacity-100 opacity-0 focus:opacity-100'}`}
            title={bookmark.is_favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <svg className={`w-4 h-4 ${bookmark.is_favorite ? 'fill-current' : 'fill-none stroke-current'}`} strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Middle Section: Title & Details */}
      <div className="mb-6">
        <h3 className="font-black text-white text-lg leading-tight mb-2 group-hover:text-blue-400 transition-colors uppercase tracking-tight line-clamp-2">
          {bookmark.title}
        </h3>
        <p className="text-sm text-gray-500 font-bold tracking-widest uppercase truncate mb-3">
          {domain}
        </p>
        <div className="flex items-center gap-2 text-[10px] text-gray-600 font-black uppercase tracking-[0.2em]">
          <span>{formattedDate}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/5" />
          <span>{formattedTime}</span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
        <div className="flex items-center gap-2 text-blue-500">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Go To Link</span>
        </div>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Glass Shimmer on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
    </motion.div>
  )
}
