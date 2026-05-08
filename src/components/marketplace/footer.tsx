'use client'

import { useAppStore } from '@/lib/store'
import {
  GraduationCap,
  FileText,
  BookOpen,
  Upload,
  Plus,
  HelpCircle,
  FileCheck,
  Shield,
  Mail,
  MessageCircle,
  Users,
  ExternalLink,
} from 'lucide-react'

export default function Footer() {
  const { setCurrentView, setShowUploadDialog, setShowListBookDialog, currentUser, setShowAuthDialog } = useAppStore()

  const handleNav = (view: 'home' | 'notes' | 'books' | 'dashboard') => {
    setCurrentView(view)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAction = (action: string) => {
    if (!currentUser) {
      setShowAuthDialog(true)
      return
    }
    if (action === 'upload-note') {
      setCurrentView('notes')
      setTimeout(() => setShowUploadDialog(true), 100)
    } else if (action === 'list-book') {
      setCurrentView('books')
      setTimeout(() => setShowListBookDialog(true), 100)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <button onClick={() => handleNav('home')} className="flex items-center gap-2 font-bold text-lg">
              <GraduationCap className="h-6 w-6 text-emerald-600" />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                NoteSwap
              </span>
            </button>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The student marketplace for sharing knowledge and trading books.
              Connect, learn, and save together.
            </p>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Marketplace</h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => handleNav('notes')}
                  className="text-sm text-muted-foreground hover:text-emerald-600 transition-colors flex items-center gap-1.5"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Browse Notes
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('books')}
                  className="text-sm text-muted-foreground hover:text-emerald-600 transition-colors flex items-center gap-1.5"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  Browse Books
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleAction('upload-note')}
                  className="text-sm text-muted-foreground hover:text-emerald-600 transition-colors flex items-center gap-1.5"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Upload Notes
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleAction('list-book')}
                  className="text-sm text-muted-foreground hover:text-emerald-600 transition-colors flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  List a Book
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Support</h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="text-sm text-muted-foreground hover:text-emerald-600 transition-colors flex items-center gap-1.5"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  Help Center
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="text-sm text-muted-foreground hover:text-emerald-600 transition-colors flex items-center gap-1.5"
                >
                  <FileCheck className="h-3.5 w-3.5" />
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="text-sm text-muted-foreground hover:text-emerald-600 transition-colors flex items-center gap-1.5"
                >
                  <Shield className="h-3.5 w-3.5" />
                  Privacy Policy
                </button>
              </li>
              <li>
                <a
                  href="mailto:support@noteswap.in"
                  className="text-sm text-muted-foreground hover:text-emerald-600 transition-colors flex items-center gap-1.5"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Contact Us
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Connect</h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://wa.me/?text=Check%20out%20NoteSwap%20-%20the%20student%20marketplace%20for%20notes%20and%20books!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-emerald-600 transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Share on WhatsApp
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@noteswap.in"
                  className="text-sm text-muted-foreground hover:text-emerald-600 transition-colors flex items-center gap-1.5"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Email Support
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </li>
              <li>
                <button
                  onClick={() => handleNav('dashboard')}
                  className="text-sm text-muted-foreground hover:text-emerald-600 transition-colors flex items-center gap-1.5"
                >
                  <Users className="h-3.5 w-3.5" />
                  Student Community
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} NoteSwap. All rights reserved. Built for students, by students.
          </p>
          <p className="text-xs text-muted-foreground">
            Payments secured by Razorpay · ₹5 platform fee per note sale
          </p>
        </div>
      </div>
    </footer>
  )
}
