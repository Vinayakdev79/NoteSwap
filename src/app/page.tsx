'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import Navbar from '@/components/marketplace/navbar'
import HeroSection from '@/components/marketplace/hero'
import FeaturesSection from '@/components/marketplace/features-section'
import StatsSection from '@/components/marketplace/stats-section'
import HowItWorksSection from '@/components/marketplace/how-it-works-section'
import TestimonialsSection from '@/components/marketplace/testimonials-section'
import CTASection from '@/components/marketplace/cta-section'
import Footer from '@/components/marketplace/footer'
import AuthDialog from '@/components/marketplace/auth-dialog'
import NotesSection from '@/components/marketplace/notes-section'
import BooksSection from '@/components/marketplace/books-section'
import DashboardSection from '@/components/marketplace/dashboard-section'

export default function Home() {
  const { currentView, setCurrentView, setCurrentUser, notes, setNotes, books, setBooks } = useAppStore()

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
            <FeaturesSection />
            <StatsSection />
            <HowItWorksSection />
            <TestimonialsSection />
            <CTASection />
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
