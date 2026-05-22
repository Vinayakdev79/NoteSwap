'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/lib/store'
import {
  BookOpen,
  User,
  GraduationCap,
  Calendar,
  Tag,
  MessageCircle,
  Mail,
  Phone,
  ShieldCheck,
  Send,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function BookDetailDialog() {
  const { selectedBook, setSelectedBook, currentUser, setShowAuthDialog } = useAppStore()
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  if (!selectedBook) return null

  const isOwner = currentUser?.id === selectedBook.userId
  const isAvailable = selectedBook.status === 'available'
  const sellerPhone = selectedBook.user?.phone
  const sellerEmail = selectedBook.user?.email

  const getWhatsAppLink = (phone: string, text: string) => {
    const cleanPhone = phone.replace(/[^0-9+]/g, '')
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
  }

  const getEmailLink = (email: string, subject: string, body: string) => {
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const handleContact = async (method: 'whatsapp' | 'email') => {
    if (!currentUser) {
      setShowAuthDialog(true)
      return
    }

    const greeting = `Hi ${selectedBook.user?.name || 'there'},\n\nI'm interested in your book "${selectedBook.title}" by ${selectedBook.author}.`

    if (method === 'whatsapp' && sellerPhone) {
      window.open(getWhatsAppLink(sellerPhone, greeting), '_blank')
      toast.success('Opening WhatsApp...')
    } else if (method === 'email' && sellerEmail) {
      const subject = `Interest in: ${selectedBook.title}`
      window.open(getEmailLink(sellerEmail, subject, greeting), '_blank')
      toast.success('Opening email...')
    }

    // Record the contact request
    try {
      await fetch('/api/books/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: selectedBook.id,
          toUserId: selectedBook.userId,
          message: message || `Interested in "${selectedBook.title}"`,
        }),
      })
    } catch {
      // Silently log contact
    }
  }

  const handleSendMessage = async () => {
    if (!currentUser) {
      setShowAuthDialog(true)
      return
    }
    if (!message.trim()) {
      toast.error('Please enter a message')
      return
    }

    setSending(true)
    try {
      const res = await fetch('/api/books/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: selectedBook.id,
          toUserId: selectedBook.userId,
          message: message,
        }),
      })
      if (!res.ok) throw new Error('Failed to send message')

      toast.success('Message sent! The seller will be notified.')
      setMessage('')
    } catch {
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const typeLabels = { sell: 'For Sale', lend: 'For Lending', donate: 'Free / Donate' }
  const typeColors = {
    sell: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    lend: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    donate: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  }

  return (
    <Dialog open={!!selectedBook} onOpenChange={(open) => !open && setSelectedBook(null)}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-[#111827] border-white/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <BookOpen className="h-5 w-5 text-teal-400" />
            {selectedBook.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Book Image */}
          {selectedBook.imageUrl && (
            <img
              src={`/api/serve-upload?path=${encodeURIComponent(selectedBook.imageUrl.replace('/uploads/', ''))}`}
              alt={selectedBook.title}
              className="w-full h-48 object-cover rounded-lg"
            />
          )}

          {/* Meta Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={`${typeColors[selectedBook.type as keyof typeof typeColors]} border-white/10 text-slate-400`}>
              {typeLabels[selectedBook.type as keyof typeof typeLabels]}
            </Badge>
            <Badge variant="outline" className="border-white/10 text-slate-400">{selectedBook.condition}</Badge>
            {selectedBook.edition && (
              <Badge variant="outline" className="border-white/10 text-slate-400">{selectedBook.edition}</Badge>
            )}
            {selectedBook.type !== 'donate' && (
              <Badge className="bg-amber-500/10 text-amber-400 border-white/10">
                {selectedBook.type === 'lend' ? `₹${selectedBook.price}/month` : `₹${selectedBook.price}`}
              </Badge>
            )}
            <Badge
              variant={isAvailable ? 'secondary' : 'destructive'}
              className={isAvailable ? 'bg-emerald-500/10 text-emerald-400 border-white/10' : 'border-white/10'}
            >
              {selectedBook.status}
            </Badge>
          </div>

          {/* Description */}
          {selectedBook.description && (
            <p className="text-sm text-slate-300 leading-relaxed">
              {selectedBook.description}
            </p>
          )}

          {/* Book Info */}
          <div className="border border-white/6 bg-white/[0.03] rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4 text-slate-400" />
              <span className="text-slate-300">By <strong className="text-white">{selectedBook.author}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Calendar className="h-4 w-4" />
              Listed on {formatDate(selectedBook.createdAt)}
            </div>
          </div>

          {/* Seller Info */}
          {selectedBook.user && !isOwner && (
            <div className="border border-white/6 bg-white/[0.03] rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2 text-white">
                <User className="h-4 w-4" />
                Listed by
              </h4>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-teal-500/10">
                  <User className="h-5 w-5 text-teal-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{selectedBook.user.name}</p>
                  {selectedBook.user.college && (
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <GraduationCap className="h-3 w-3" />
                      {selectedBook.user.college}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Contact Actions */}
          {!isOwner && isAvailable && (
            <div className="space-y-3 pt-2">
              <p className="text-sm font-medium flex items-center gap-2 text-white">
                <MessageCircle className="h-4 w-4 text-teal-400" />
                Contact Seller
              </p>

              <div className="grid grid-cols-2 gap-2">
                {sellerPhone && (
                  <Button
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white gap-2 w-full"
                    onClick={() => handleContact('whatsapp')}
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </Button>
                )}
                {sellerEmail && (
                  <Button
                    variant="outline"
                    className="gap-2 w-full border-white/10 text-slate-300 hover:bg-white/8 hover:text-white"
                    onClick={() => handleContact('email')}
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </Button>
                )}
              </div>

              {/* Direct Message */}
              <div className="space-y-2">
                <Label className="text-xs text-slate-400">
                  Or send a message directly
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Hi, I'm interested in this book..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-white/5 border-white/8 text-white placeholder:text-slate-500 focus:border-emerald-500/40"
                  />
                  <Button
                    size="icon"
                    className="shrink-0 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
                    onClick={handleSendMessage}
                    disabled={sending || !message.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Safety Notice */}
          {!isOwner && isAvailable && (
            <div className="flex items-start gap-2 text-xs text-slate-400 bg-amber-500/5 p-3 rounded-lg border border-amber-500/10">
              <ShieldCheck className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Meet in a safe, public place for book exchanges. NoteSwap is not responsible for transactions between users.
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Label({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <label className={`text-sm font-medium text-slate-300 ${className || ''}`}>
      {children}
    </label>
  )
}
