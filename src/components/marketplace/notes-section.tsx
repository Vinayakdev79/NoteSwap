'use client'

import { useState, useEffect } from 'react'
import { useAppStore, type Note } from '@/lib/store'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
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
} from 'lucide-react'
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
        // Record free download
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
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm hover:border-emerald-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-2 rounded-lg bg-emerald-100 shrink-0">
              <FileText className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm line-clamp-1">{note.title}</h3>
              <p className="text-xs text-muted-foreground">by {note.user?.name || 'Anonymous'}</p>
            </div>
          </div>
          <Badge variant={isFree ? 'secondary' : 'default'} className={isFree ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
            {isFree ? 'Free' : `₹${note.price}`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {note.description || 'No description provided'}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs">{note.subject}</Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Download className="h-3 w-3" />
            {note.downloads}
          </span>
        </div>
      </CardContent>
      <CardFooter className="pt-3 border-t gap-2">
        <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => setSelectedNote(note)}>
          <Eye className="h-3 w-3" />
          View
        </Button>
        {!isOwner && (
          <Button
            size="sm"
            className="gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 ml-auto"
            onClick={handleGetNote}
            disabled={purchasing}
          >
            {purchasing ? <Loader2 className="h-3 w-3 animate-spin" /> : isFree ? <Gift className="h-3 w-3" /> : <DollarSign className="h-3 w-3" />}
            {isFree ? 'Get Free' : `Buy ₹${note.price}`}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default function NotesSection() {
  const { notes, setNotes, setShowUploadDialog, currentUser, setShowAuthDialog, searchQuery, setSearchQuery } = useAppStore()
  const [subjectFilter, setSubjectFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotes()
  }, [])

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
          <h2 className="text-2xl md:text-3xl font-bold">Study Notes</h2>
          <p className="text-muted-foreground mt-1">Browse, buy, or download free study materials</p>
        </div>
        <Button
          onClick={() => {
            if (!currentUser) {
              setShowAuthDialog(true)
              return
            }
            setShowUploadDialog(true)
          }}
          className="bg-emerald-600 hover:bg-emerald-700 gap-2 shrink-0"
        >
          <Plus className="h-4 w-4" />
          Upload Notes
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes by title, subject..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {SUBJECTS.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="sell">Paid</SelectItem>
            <SelectItem value="donate">Free / Donate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="font-semibold text-lg">No notes found</h3>
          <p className="text-muted-foreground mt-1">
            {notes.length === 0
              ? 'Be the first to upload notes!'
              : 'Try adjusting your search or filters'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <NoteDetailDialog />
      <UploadNoteDialog onUploaded={fetchNotes} />
      <PaymentDialog />
    </section>
  )
}
