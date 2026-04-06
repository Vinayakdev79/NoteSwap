'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { useAppStore } from '@/lib/store'
import {
  BookOpen,
  FileText,
  LayoutDashboard,
  Menu,
  Plus,
  LogIn,
  LogOut,
  User,
  GraduationCap,
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
  } = useAppStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { id: 'home' as const, label: 'Home', icon: GraduationCap },
    { id: 'notes' as const, label: 'Notes', icon: FileText },
    { id: 'books' as const, label: 'Books', icon: BookOpen },
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <button onClick={() => handleNav('home')} className="flex items-center gap-2 font-bold text-xl">
          <GraduationCap className="h-7 w-7 text-emerald-600" />
          <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            NoteSwap
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={currentView === item.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleNav(item.id)}
              className="gap-2"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          ))}
          {currentUser && (
            <Button
              variant={currentView === 'dashboard' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleNav('dashboard')}
              className="gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          {currentUser ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowUploadDialog(true)
                  setCurrentView('notes')
                }}
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                Upload Note
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowListBookDialog(true)
                  setCurrentView('books')
                }}
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                List Book
              </Button>
              <div className="flex items-center gap-2 ml-2 pl-2 border-l">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{currentUser.name}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <Button size="sm" onClick={() => setShowAuthDialog(true)} className="gap-2">
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="flex items-center gap-2 mb-6">
              <GraduationCap className="h-5 w-5 text-emerald-600" />
              <span className="font-bold">NoteSwap</span>
            </SheetTitle>
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? 'default' : 'ghost'}
                  className="justify-start gap-2"
                  onClick={() => handleNav(item.id)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              ))}
              {currentUser && (
                <Button
                  variant={currentView === 'dashboard' ? 'default' : 'ghost'}
                  className="justify-start gap-2"
                  onClick={() => handleNav('dashboard')}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              )}
              <div className="border-t my-3" />
              {currentUser ? (
                <>
                  <Button
                    variant="outline"
                    className="justify-start gap-2"
                    onClick={() => {
                      setShowUploadDialog(true)
                      setCurrentView('notes')
                      setMobileOpen(false)
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    Upload Note
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start gap-2"
                    onClick={() => {
                      setShowListBookDialog(true)
                      setCurrentView('books')
                      setMobileOpen(false)
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    List Book
                  </Button>
                  <div className="flex items-center gap-2 px-3 py-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{currentUser.name}</span>
                  </div>
                  <Button variant="ghost" className="justify-start gap-2 text-destructive" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button className="justify-start gap-2" onClick={() => {
                  setShowAuthDialog(true)
                  setMobileOpen(false)
                }}>
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
