'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function AddBookmarkForm({ userId, onBookmarkAdded }: { userId: string, onBookmarkAdded: (bookmark: any) => void }) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .insert([
          { title, url, user_id: userId }
        ])
        .select()

      if (error) throw error
      
      if (data) {
        onBookmarkAdded(data[0])
        setTitle('')
        setUrl('')
        toast.success('Bookmark added successfully!')
      }
    } catch (error: any) {
      console.error('Error adding bookmark:', error)
      toast.error('Failed to add bookmark. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-5 items-end">
      <div className="flex-1 w-full space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-2">Title</label>
        <div className="relative group/input">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-blue-500 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="e.g. Portfolio"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full pl-12 pr-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/[0.08] outline-none transition-all text-white placeholder:text-gray-600 font-medium"
          />
        </div>
      </div>

      <div className="flex-[2] w-full space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-2">URL</label>
        <div className="relative group/input">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-indigo-500 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <input
            type="url"
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="w-full pl-12 pr-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:bg-white/[0.08] outline-none transition-all text-white placeholder:text-gray-600 font-medium"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full lg:w-auto px-10 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:from-blue-500 hover:to-indigo-500 active:scale-95 focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 transition-all shadow-xl shadow-blue-500/20 border border-white/10 relative overflow-hidden group"
      >
        <span className="relative z-10">{loading ? 'Adding...' : 'Add Bookmark'}</span>
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
      </button>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translate(100%);
          }
        }
      `}</style>
    </form>
  )
}
