'use client'

import { useState, useEffect } from 'react'
import { useAppStore, type Note } from '@/lib/store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  FileText,
  Download,
  Eye,
  Search,
  Filter,
  Gift,
  DollarSign,
  Plus,
  Loader2,
  FileCheck,
} from 'lucide-react'
import { toast } from 'sonner'
import NoteDetailDialog from './note-detail-dialog'
import UploadNoteDialog from './upload-note-dialog'
import PaymentDialog from './payment-dialog'

const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
  'English', 'History', 'Economics', 'Engineering', 'Medicine',
  'Law', 'Business', 'Accounting', 'Philosophy', 'Other',
]

function NoteCard({ note }: { note: Note }) {
  const { setSelectedNote, currentUser, setPaymentNote, setShowPaymentDialog, setShowAuthDialog } = useAppStore()
  const [purchasing, setPurchasing] = useState(false)

  const isOwner = currentUser?.id === note.userId
  const isFree = note.price === 0 || note.type === 'donate'

  const handleGetNote = async () => {
    if (!currentUser) {
      setShowAuthDialog(true)
      return
    }

    if (isFree) {
      setPurchasing(true)
      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ noteId: note.id, amount: 0 }),
        })
        if (res.ok) {
          toast.success('Download started!')
          window.open(`/api/upload/download/${note.id}`, '_blank')
        }
      } catch {
        toast.error('Failed to download')
      } finally {
        setPurchasing(false)
      }
    } else {
      setPaymentNote(note)
      setShowPaymentDialog(true)
    }
  }

  return (
    <div className="group rounded-xl border border-white/6 bg-white/[0.03] overflow-hidden hover:border-emerald-500/20 hover:bg-white/[0.05] transition-all duration-300">
      {/* Thumbnail Area */}
      <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-emerald-600/80 to-teal-700/80 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <FileCheck className="h-14 w-14 text-white/70" />
          <span className="text-xs text-white/50 font-medium uppercase tracking-wider">Study Notes</span>
        </div>
        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          {isFree ? (
            <Badge className="bg-emerald-500 text-white border-0 text-xs font-semibold px-2.5 py-1">Free</Badge>
          ) : (
            <Badge className="bg-amber-500 text-white border-0 text-xs font-semibold px-2.5 py-1">₹{note.price}</Badge>
          )}
        </div>
        {/* Subject Badge */}
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-white/15 backdrop-blur-sm text-white border-0 text-xs font-medium">{note.subject}</Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2.5">
        <div>
          <h3 className="font-semibold text-white line-clamp-1 text-sm">{note.title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">by {note.user?.name || 'Anonymous'}</p>
        </div>
        <p className="text-xs text-slate-400 line-clamp-2">{note.description || 'No description provided'}</p>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Download className="h-3.5 w-3.5" />
          <span>{note.downloads} downloads</span>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 pt-0 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-1.5 text-xs h-9 rounded-lg border-white/10 text-slate-300 hover:bg-white/8 hover:text-white hover:border-emerald-500/30"
          onClick={() => setSelectedNote(note)}
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Button>
        {!isOwner && (
          <Button
            size="sm"
            className="flex-1 gap-1.5 text-xs h-9 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
            onClick={handleGetNote}
            disabled={purchasing}
          >
            {purchasing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : isFree ? (
              <Gift className="h-3.5 w-3.5" />
            ) : (
              <DollarSign className="h-3.5 w-3.5" />
            )}
            {isFree ? 'Get Free' : `Buy ₹${note.price}`}
          </Button>
        )}
      </div>
    </div>
  )
}

export default function NotesSection() {
  const { notes, setNotes, setShowUploadDialog, currentUser, setShowAuthDialog, searchQuery, setSearchQuery } = useAppStore()
  const [subjectFilter, setSubjectFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchNotes() }, [])

  const fetchNotes = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/notes')
      const data = await res.json()
      if (res.ok) setNotes(data.notes)
    } catch {
      toast.error('Failed to load notes')
    } finally {
      setLoading(false)
    }
  }

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = !searchQuery ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject = subjectFilter === 'all' || note.subject === subjectFilter
    const matchesType = typeFilter === 'all' || note.type === typeFilter
    return matchesSearch && matchesSubject && matchesType
  })

  return (
    <section className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">Study Notes</h2>
          <p className="text-slate-400 mt-1">Browse, buy, or download free study materials</p>
        </div>
        <Button
          onClick={() => {
            if (!currentUser) { setShowAuthDialog(true); return }
            setShowUploadDialog(true)
          }}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 gap-2 shrink-0 rounded-lg h-10 text-white"
        >
          <Plus className="h-4 w-4" />
          Upload Notes
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search notes by title, subject..."
            className="pl-10 rounded-lg bg-white/5 border-white/8 text-white placeholder:text-slate-500 focus:border-emerald-500/40"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
          <SelectTrigger className="w-full sm:w-48 rounded-lg bg-white/5 border-white/8 text-slate-300">
            <Filter className="h-4 w-4 mr-2 text-slate-500" />
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent className="bg-[#111827] border-white/10">
            <SelectItem value="all">All Subjects</SelectItem>
            {SUBJECTS.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-40 rounded-lg bg-white/5 border-white/8 text-slate-300">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className="bg-[#111827] border-white/10">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="sell">Paid</SelectItem>
            <SelectItem value="donate">Free / Donate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-20">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-emerald-500" />
          </div>
          <h3 className="font-semibold text-lg text-white">No notes found</h3>
          <p className="text-slate-400 mt-1">
            {notes.length === 0 ? 'Be the first to upload notes!' : 'Try adjusting your search or filters'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}

      <NoteDetailDialog />
      <UploadNoteDialog onUploaded={fetchNotes} />
      <PaymentDialog />
    </section>
  )
}
