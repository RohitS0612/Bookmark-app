import { createClient } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'
import BookmarkContainer from '@/components/BookmarkContainer'
import UserMenu from '@/components/UserMenu'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  return (
    <div className="min-h-screen text-white relative">
      {/* Mesh Background Decorations */}
      <div className="fixed top-[-15%] right-[-15%] w-[60%] h-[60%] rounded-full bg-blue-600/5 blur-[200px] pointer-events-none" />
      <div className="fixed bottom-[-15%] left-[-15%] w-[60%] h-[60%] rounded-full bg-purple-600/5 blur-[200px] pointer-events-none" />

      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/10 shadow-2xl shadow-black/20">
        {/* Glossy overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3 transition-transform hover:scale-105 cursor-default">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h1 className="text-xl font-black tracking-tighter text-gradient uppercase">
              Mark.
            </h1>
          </div>

          <UserMenu email={user.email} />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-24 relative z-10">
        <BookmarkContainer userId={user.id} />
      </main>
    </div>
  )
}
