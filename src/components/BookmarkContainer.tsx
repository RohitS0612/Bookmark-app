'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import BookmarkList from './BookmarkList'
import AddBookmarkModal from './AddBookmarkModal'
import { motion, AnimatePresence } from 'framer-motion'

type Bookmark = {
  id: string
  title: string
  url: string
  created_at: string
  is_favorite: boolean
}

export default function BookmarkContainer({ userId }: { userId: string }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'favorites'>('newest')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchBookmarks = useCallback(async () => {
    // ... same fetch logic ...
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching bookmarks:', error)
    } else {
      setBookmarks(data || [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchBookmarks()

    const channel = supabase
      .channel('bookmarks-sync')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newBookmark = payload.new as Bookmark
            setBookmarks((prev) => {
              if (prev.find(b => b.id === newBookmark.id)) return prev
              return [newBookmark, ...prev]
            })
          } else if (payload.eventType === 'DELETE') {
            setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id))
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as Bookmark
            setBookmarks((prev) => 
              prev.map(b => b.id === updated.id ? updated : b)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchBookmarks])

  const handleBookmarkAdded = (newBookmark: Bookmark) => {
    setBookmarks((prev) => [newBookmark, ...prev])
  }

  const handleBookmarkDeleted = (id: string) => {
    setBookmarks((prev) => prev.filter(b => b.id !== id))
  }

  const handleToggleFavorite = (id: string, isFavorite: boolean) => {
    setBookmarks((prev) => 
      prev.map(b => b.id === id ? { ...b, is_favorite: isFavorite } : b)
    )
  }

  const filteredAndSortedBookmarks = bookmarks
    .filter(b => 
      b.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'favorites') {
        if (a.is_favorite && !b.is_favorite) return -1
        if (!a.is_favorite && b.is_favorite) return 1
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12 max-w-full"
    >
      <AddBookmarkModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        userId={userId} 
        onBookmarkAdded={handleBookmarkAdded} 
      />

      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight uppercase">Collection</h2>
            <p className="text-xs text-gray-500 font-bold tracking-[0.3em] uppercase mt-1">Manage your digital universe</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-80 group">
              <input
                type="text"
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/[0.08] outline-none transition-all text-sm text-white placeholder:text-gray-600 font-medium"
              />
              <svg className="w-5 h-5 text-gray-600 absolute left-5 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 w-full sm:w-auto shadow-inner">
              <button
                onClick={() => setSortBy('newest')}
                className={`flex-1 sm:flex-none px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${sortBy === 'newest' ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Newest
              </button>
              <button
                onClick={() => setSortBy('favorites')}
                className={`flex-1 sm:flex-none px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${sortBy === 'favorites' ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Favorites
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Advanced Trigger Card */}
          <motion.div 
            layout
            onClick={() => setIsModalOpen(true)}
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.99 }}
            className="group p-6 rounded-2xl border-2 border-dashed border-white/10 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all cursor-pointer flex items-center justify-center gap-4 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-blue-600/0 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-lg group-hover:shadow-blue-500/50">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="font-black text-white uppercase tracking-tight text-lg group-hover:text-blue-400 transition-colors leading-none">Add New Bookmark</h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Start building your archive</p>
            </div>
            
            {/* Glossy shine */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
          </motion.div>

          <BookmarkList 
            bookmarks={filteredAndSortedBookmarks} 
            loading={loading} 
            onDeleted={handleBookmarkDeleted}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>
      </section>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translate(100%);
          }
        }
      `}</style>
    </motion.div>
  )
}
