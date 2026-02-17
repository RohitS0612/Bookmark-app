import { motion, AnimatePresence } from 'framer-motion'
import BookmarkCard from './BookmarkCard'

type Bookmark = {
  id: string
  title: string
  url: string
  created_at: string
  is_favorite: boolean
}

export default function BookmarkList({
  bookmarks,
  loading,
  onDeleted,
  onToggleFavorite
}: {
  bookmarks: Bookmark[],
  loading: boolean,
  onDeleted?: (id: string) => void,
  onToggleFavorite?: (id: string, isFavorite: boolean) => void
}) {
  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 bg-white/5 rounded-2xl animate-pulse border border-white/5" />
        ))}
      </div>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20 glass rounded-3xl border-2 border-dashed border-white/5"
      >
        <p className="text-gray-500 font-medium">Your collection is empty. Start adding some!</p>
      </motion.div>
    )
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 p-2">
      <AnimatePresence mode="popLayout">
        {bookmarks.map((bookmark) => (
          <motion.div
            key={bookmark.id}
            layout
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="mb-6 break-inside-avoid"
          >
            <BookmarkCard 
              bookmark={bookmark} 
              onDeleted={onDeleted} 
              onToggleFavorite={onToggleFavorite}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
