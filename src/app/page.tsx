'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { Badge } from '@/components/ui/badge'
import Navbar from '@/components/marketplace/navbar'
import HeroSection from '@/components/marketplace/hero'
import Footer from '@/components/marketplace/footer'
import AuthDialog from '@/components/marketplace/auth-dialog'
import NotesSection from '@/components/marketplace/notes-section'
import BooksSection from '@/components/marketplace/books-section'
import DashboardSection from '@/components/marketplace/dashboard-section'

export default function Home() {
  const { currentView, setCurrentUser, notes, setNotes, books, setBooks } = useAppStore()

  // Restore user session
  useEffect(() => {
    const userId = localStorage.getItem('userId')
    if (userId) {
      fetch(`/api/users?id=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.user) setCurrentUser(data.user)
        })
        .catch(() => {})
    }
  }, [])

  // Fetch initial data
  useEffect(() => {
    fetch('/api/notes')
      .then((res) => res.json())
      .then((data) => { if (data.notes) setNotes(data.notes) })
      .catch(() => {})

    fetch('/api/books')
      .then((res) => res.json())
      .then((data) => { if (data.books) setBooks(data.books) })
      .catch(() => {})
  }, [])

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <>
            <HeroSection />
            {/* Featured Notes */}
            <section className="container mx-auto px-4 py-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Recent Notes</h2>
                  <p className="text-muted-foreground text-sm mt-1">Latest study materials uploaded by students</p>
                </div>
                <button
                  onClick={() => setCurrentView('notes')}
                  className="text-sm text-emerald-600 hover:underline font-medium"
                >
                  View All →
                </button>
              </div>
              {notes.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <p className="text-muted-foreground">No notes uploaded yet. Be the first!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {notes.slice(0, 3).map((note) => {
                    const isFree = note.price === 0 || note.type === 'donate'
                    return (
                      <div
                        key={note.id}
                        onClick={() => setCurrentView('notes')}
                        className="group cursor-pointer p-4 rounded-xl border bg-card hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 rounded bg-emerald-100">
                            <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          </div>
                          <Badge variant={isFree ? 'secondary' : 'default'} className={`text-xs ${isFree ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            {isFree ? 'Free' : `₹${note.price}`}
                          </Badge>
                        </div>
                        <h3 className="font-medium text-sm group-hover:text-emerald-600 transition-colors truncate">{note.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{note.subject} · by {note.user?.name || 'Anonymous'}</p>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>

            {/* Featured Books */}
            <section className="container mx-auto px-4 py-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Available Books</h2>
                  <p className="text-muted-foreground text-sm mt-1">Find textbooks, novels, and study guides</p>
                </div>
                <button
                  onClick={() => setCurrentView('books')}
                  className="text-sm text-teal-600 hover:underline font-medium"
                >
                  View All →
                </button>
              </div>
              {books.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <p className="text-muted-foreground">No books listed yet. Be the first!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {books.slice(0, 3).map((book) => {
                    const typeColors = {
                      sell: 'border-amber-200 text-amber-700 bg-amber-50',
                      lend: 'border-blue-200 text-blue-700 bg-blue-50',
                      donate: 'border-emerald-200 text-emerald-700 bg-emerald-50',
                    }
                    return (
                      <div
                        key={book.id}
                        onClick={() => setCurrentView('books')}
                        className="group cursor-pointer p-4 rounded-xl border bg-card hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 rounded bg-teal-100">
                            <svg className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                          </div>
                          <Badge variant="outline" className={`text-xs ${typeColors[book.type as keyof typeof typeColors]}`}>
                            {book.type === 'sell' ? 'Sell' : book.type === 'lend' ? 'Lend' : 'Free'}
                          </Badge>
                        </div>
                        <h3 className="font-medium text-sm group-hover:text-teal-600 transition-colors truncate">{book.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{book.author} · {book.condition}</p>
                        {book.type !== 'donate' && (
                          <p className="text-xs font-medium text-amber-700 mt-1">
                            ₹{book.price}{book.type === 'lend' ? '/month' : ''}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </section>

            {/* How it works */}
            <section className="container mx-auto px-4 py-12">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 md:p-12">
                <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center space-y-3">
                    <div className="mx-auto w-12 h-12 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-800 font-bold">
                      1
                    </div>
                    <h3 className="font-semibold">Upload & List</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload your study notes as PDFs or list your old books with details and pricing.
                    </p>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="mx-auto w-12 h-12 rounded-full bg-teal-200 flex items-center justify-center text-teal-800 font-bold">
                      2
                    </div>
                    <h3 className="font-semibold">Browse & Connect</h3>
                    <p className="text-sm text-muted-foreground">
                      Students browse and buy notes securely, or connect with book sellers via WhatsApp/email.
                    </p>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="mx-auto w-12 h-12 rounded-full bg-cyan-200 flex items-center justify-center text-cyan-800 font-bold">
                      3
                    </div>
                    <h3 className="font-semibold">Share & Earn</h3>
                    <p className="text-sm text-muted-foreground">
                      Download purchased notes instantly. Meet up for books. Help each other succeed!
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )
      case 'notes':
        return <NotesSection />
      case 'books':
        return <BooksSection />
      case 'dashboard':
        return <DashboardSection />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {renderContent()}
      </main>
      <Footer />
      <AuthDialog />
    </div>
  )
}
