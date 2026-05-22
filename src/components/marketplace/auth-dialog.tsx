'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppStore } from '@/lib/store'
import { LogIn, UserPlus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function AuthDialog() {
  const { showAuthDialog, setShowAuthDialog, setCurrentUser } = useAppStore()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
  })

  const resetForm = () => {
    setForm({ name: '', email: '', phone: '', college: '' })
    setIsLogin(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email.trim()) {
      toast.error('Please enter your email')
      return
    }
    if (!isLogin && !form.name.trim()) {
      toast.error('Please enter your name')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, isLogin }),
      })

      const contentType = res.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        throw new Error('Server error. Please try again in a moment.')
      }

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')

      setCurrentUser(data.user)
      localStorage.setItem('userId', data.user.id)
      toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!')
      setShowAuthDialog(false)
      resetForm()
    } catch (err: unknown) {
      if (err instanceof SyntaxError) {
        toast.error('Server error. Please try again.')
      } else {
        toast.error(err instanceof Error ? err.message : 'Failed to sign in')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={showAuthDialog} onOpenChange={(open) => {
      if (!open) resetForm()
      setShowAuthDialog(open)
    }}>
      <DialogContent className="sm:max-w-md bg-[#111827] border-white/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            {isLogin ? <LogIn className="h-5 w-5 text-emerald-400" /> : <UserPlus className="h-5 w-5 text-emerald-400" />}
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {isLogin
              ? 'Sign in to upload notes, list books, and manage your marketplace.'
              : 'Join NoteSwap to start sharing and trading with fellow students.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-300">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                className="bg-white/5 border-white/8 text-white placeholder:text-slate-500 focus:border-emerald-500/40"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@university.edu"
              className="bg-white/5 border-white/8 text-white placeholder:text-slate-500 focus:border-emerald-500/40"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {!isLogin && (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-300">WhatsApp Number (optional)</Label>
                <Input
                  id="phone"
                  placeholder="+91 98765 43210"
                  className="bg-white/5 border-white/8 text-white placeholder:text-slate-500 focus:border-emerald-500/40"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="college" className="text-slate-300">College / University (optional)</Label>
                <Input
                  id="college"
                  placeholder="Your college name"
                  className="bg-white/5 border-white/8 text-white placeholder:text-slate-500 focus:border-emerald-500/40"
                  value={form.college}
                  onChange={(e) => setForm({ ...form, college: e.target.value })}
                />
              </div>
            </>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-emerald-400 hover:text-emerald-300 hover:underline font-medium"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
