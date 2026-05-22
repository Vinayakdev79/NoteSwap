'use client'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/lib/store'
import {
  BookOpen,
  FileText,
  LayoutDashboard,
  Menu,
  Plus,
  LogIn,
  LogOut,
  Search,
} from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const {
    currentView,
    setCurrentView,
    currentUser,
    setCurrentUser,
    setShowUploadDialog,
    setShowListBookDialog,
    setShowAuthDialog,
    searchQuery,
    setSearchQuery,
  } = useAppStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { id: 'home' as const, label: 'Home' },
    { id: 'notes' as const, label: 'Notes' },
    { id: 'books' as const, label: 'Books' },
  ]

  const handleNav = (view: 'home' | 'notes' | 'books' | 'dashboard') => {
    setCurrentView(view)
    setMobileOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogout = () => {
    localStorage.removeItem('userId')
    setCurrentUser(null)
    setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/8 bg-[#0a0f1c]/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <button onClick={() => handleNav('home')} className="flex items-center gap-2.5 shrink-0">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            NoteSwap
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                currentView === item.id
                  ? 'text-emerald-300 bg-white/8'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
              {currentView === item.id && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-400" />
              )}
            </button>
          ))}
          {currentUser && (
            <button
              onClick={() => handleNav('dashboard')}
              className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                currentView === 'dashboard'
                  ? 'text-emerald-300 bg-white/8'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Dashboard
              {currentView === 'dashboard' && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-400" />
              )}
            </button>
          )}
        </nav>

        {/* Desktop Search + Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <Input
              placeholder="Search..."
              className="pl-9 pr-4 h-9 w-48 rounded-lg bg-white/5 border-white/8 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500/40 focus:bg-white/8 focus:w-56 transition-all duration-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {currentUser ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowUploadDialog(true)
                  setCurrentView('notes')
                }}
                className="gap-1.5 h-9 rounded-lg border-white/10 text-slate-300 hover:bg-white/8 hover:text-white hover:border-emerald-500/30 text-xs font-medium"
              >
                <Plus className="h-3.5 w-3.5" />
                Upload
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowListBookDialog(true)
                  setCurrentView('books')
                }}
                className="gap-1.5 h-9 rounded-lg border-white/10 text-slate-300 hover:bg-white/8 hover:text-white hover:border-teal-500/30 text-xs font-medium"
              >
                <Plus className="h-3.5 w-3.5" />
                List Book
              </Button>
              <div className="flex items-center gap-2 ml-1 pl-3 border-l border-white/10">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-slate-200">{currentUser.name}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-400" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <Button 
              size="sm" 
              onClick={() => setShowAuthDialog(true)} 
              className="gap-2 h-9 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:bg-white/8">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-[#0a0f1c] border-white/8">
            <SheetTitle className="flex items-center gap-2.5 mb-6">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <span className="text-white font-bold text-xs">N</span>
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                NoteSwap
              </span>
            </SheetTitle>

            {/* Mobile Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search..."
                className="pl-9 rounded-lg bg-white/5 border-white/8 text-white placeholder:text-slate-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    currentView === item.id
                      ? 'bg-white/8 text-emerald-300'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {item.id === 'home' && <LayoutDashboard className="h-4 w-4" />}
                  {item.id === 'notes' && <FileText className="h-4 w-4" />}
                  {item.id === 'books' && <BookOpen className="h-4 w-4" />}
                  {item.label}
                </button>
              ))}
              {currentUser && (
                <button
                  onClick={() => handleNav('dashboard')}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    currentView === 'dashboard'
                      ? 'bg-white/8 text-emerald-300'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </button>
              )}

              <div className="border-t border-white/8 my-3" />

              {currentUser ? (
                <>
                  <button
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                    onClick={() => {
                      setShowUploadDialog(true)
                      setCurrentView('notes')
                      setMobileOpen(false)
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    Upload Note
                  </button>
                  <button
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                    onClick={() => {
                      setShowListBookDialog(true)
                      setCurrentView('books')
                      setMobileOpen(false)
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    List Book
                  </button>
                  <div className="flex items-center gap-3 px-3 py-2.5">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-white">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{currentUser.name}</p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Button
                  className="justify-start gap-3 h-11 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 mt-1"
                  onClick={() => {
                    setShowAuthDialog(true)
                    setMobileOpen(false)
                  }}
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
