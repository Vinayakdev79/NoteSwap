'use client'

import { useAppStore } from '@/lib/store'
import {
  FileText,
  BookOpen,
  Upload,
  Plus,
  HelpCircle,
  Shield,
  Mail,
  MessageCircle,
  Users,
  ExternalLink,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Heart,
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

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: Facebook, href: '#', label: 'Facebook' },
  ]

  const footerLinks = {
    marketplace: [
      { icon: FileText, label: 'Browse Notes', action: () => handleNav('notes') },
      { icon: BookOpen, label: 'Browse Books', action: () => handleNav('books') },
      { icon: Upload, label: 'Upload Notes', action: () => handleAction('upload-note') },
      { icon: Plus, label: 'List a Book', action: () => handleAction('list-book') },
    ],
    support: [
      { icon: HelpCircle, label: 'Help Center', action: () => handleNav('home') },
      { icon: Shield, label: 'Privacy Policy', action: () => handleNav('home') },
      { icon: Mail, label: 'Contact Us', action: () => {} },
    ],
    community: [
      { icon: Users, label: 'Students', action: () => handleNav('dashboard') },
      { icon: MessageCircle, label: 'WhatsApp', action: () => {} },
    ],
  }

  return (
    <footer className="relative bg-slate-950 text-gray-300 overflow-hidden">
      {/* Top gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

      {/* Background decoration */}
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/3 rounded-full blur-3xl" />
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-teal-500/3 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-4 pt-16 pb-8">
        {/* Social Links Row */}
        <div className="flex items-center justify-center gap-3 mb-12">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              aria-label={social.label}
              className="h-10 w-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:bg-emerald-500/20 hover:border-emerald-500/30 hover:text-emerald-400 transition-all duration-300"
            >
              <social.icon className="h-4 w-4" />
            </a>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <button onClick={() => handleNav('home')} className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="font-bold text-lg text-white">NoteSwap</span>
            </button>
            <p className="text-sm text-gray-400 leading-relaxed">
              India&apos;s student marketplace for sharing knowledge and trading books.
              Connect, learn, and save together.
            </p>
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              Made with <Heart className="h-3 w-3 text-emerald-500 fill-emerald-500" /> for students
            </p>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="font-semibold mb-4 text-xs text-white uppercase tracking-wider">Marketplace</h4>
            <ul className="space-y-3">
              {footerLinks.marketplace.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={link.action}
                    className="text-sm text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group"
                  >
                    <link.icon className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-xs text-white uppercase tracking-wider">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  {link.label === 'Contact Us' ? (
                    <a
                      href="mailto:support@noteswap.in"
                      className="text-sm text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group"
                    >
                      <Mail className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                      <ExternalLink className="h-2.5 w-2.5 opacity-30" />
                    </a>
                  ) : (
                    <button
                      onClick={link.action}
                      className="text-sm text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group"
                    >
                      <link.icon className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold mb-4 text-xs text-white uppercase tracking-wider">Community</h4>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.label}>
                  {link.label === 'WhatsApp' ? (
                    <a
                      href="https://wa.me/?text=Check%20out%20NoteSwap%20-%20the%20student%20marketplace!"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group"
                    >
                      <link.icon className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                      <ExternalLink className="h-2.5 w-2.5 opacity-30" />
                    </a>
                  ) : (
                    <button
                      onClick={link.action}
                      className="text-sm text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group"
                    >
                      <link.icon className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} NoteSwap. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Powered by Supabase
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              Payments by Razorpay
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
