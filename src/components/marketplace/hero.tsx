'use client'

import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { FileText, BookOpen, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react'

export default function HeroSection() {
  const { setCurrentView, setShowAuthDialog, currentUser } = useAppStore()

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50" />
      <div className="absolute inset-0 bg-[url('/hero-image.png')] bg-cover bg-center opacity-10 mix-blend-multiply" />

      <div className="relative container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-800">
            <Sparkles className="h-4 w-4" />
            The Student Marketplace
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
            Share Your Knowledge,{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Trade Your Books
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Upload and sell study notes, or donate them to help fellow students.
            Find affordable old textbooks, lend your books, or connect directly with sellers via WhatsApp.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/80 shadow-sm border">
              <div className="p-2 rounded-lg bg-emerald-100">
                <FileText className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-sm">Upload Notes</h3>
              <p className="text-xs text-muted-foreground">Sell or donate your study materials</p>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/80 shadow-sm border">
              <div className="p-2 rounded-lg bg-teal-100">
                <BookOpen className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-sm">Trade Books</h3>
              <p className="text-xs text-muted-foreground">Buy, sell, lend or donate old books</p>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/80 shadow-sm border">
              <div className="p-2 rounded-lg bg-cyan-100">
                <ShieldCheck className="h-6 w-6 text-cyan-600" />
              </div>
              <h3 className="font-semibold text-sm">Secure Payments</h3>
              <p className="text-xs text-muted-foreground">Safe checkout for paid notes</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 gap-2 text-base px-8"
              onClick={() => setCurrentView('notes')}
            >
              Browse Notes
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 text-base px-8 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              onClick={() => setCurrentView('books')}
            >
              <BookOpen className="h-4 w-4" />
              Find Books
            </Button>
          </div>

          {!currentUser && (
            <p className="text-sm text-muted-foreground pt-2">
              Already have an account?{' '}
              <button
                onClick={() => setShowAuthDialog(true)}
                className="text-emerald-600 font-medium hover:underline"
              >
                Sign in to get started
              </button>
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
