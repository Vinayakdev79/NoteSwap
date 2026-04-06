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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppStore } from '@/lib/store'
import { Upload, Loader2, FileText, X, Gift, DollarSign } from 'lucide-react'
import { toast } from 'sonner'

const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
  'English', 'History', 'Economics', 'Engineering', 'Medicine',
  'Law', 'Business', 'Accounting', 'Philosophy', 'Other',
]

interface UploadNoteDialogProps {
  onUploaded?: () => void
}

export default function UploadNoteDialog({ onUploaded }: UploadNoteDialogProps) {
  const { showUploadDialog, setShowUploadDialog, addNote, currentUser } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    subject: '',
    type: 'sell' as 'sell' | 'donate',
    price: '0',
  })

  const resetForm = () => {
    setForm({ title: '', description: '', subject: '', type: 'sell', price: '0' })
    setFile(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      toast.error('Please upload a file')
      return
    }
    if (!form.title.trim()) {
      toast.error('Please enter a title')
      return
    }
    if (!form.subject) {
      toast.error('Please select a subject')
      return
    }
    if (form.type === 'sell' && (!form.price || Number(form.price) <= 0)) {
      toast.error('Please set a valid price')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', form.title)
      formData.append('description', form.description)
      formData.append('subject', form.subject)
      formData.append('type', form.type)
      formData.append('price', form.type === 'donate' ? '0' : form.price)

      const res = await fetch('/api/notes', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')

      addNote(data.note)
      toast.success('Notes uploaded successfully!')
      setShowUploadDialog(false)
      resetForm()
      onUploaded?.()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to upload notes')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.size > 50 * 1024 * 1024) {
        toast.error('File size must be less than 50MB')
        return
      }
      setFile(selectedFile)
    }
  }

  return (
    <Dialog open={showUploadDialog} onOpenChange={(open) => {
      if (!open) resetForm()
      setShowUploadDialog(open)
    }}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-emerald-600" />
            Upload Study Notes
          </DialogTitle>
          <DialogDescription>
            Share your study materials with fellow students. Sell them or donate for free.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload */}
          <div className="space-y-2">
            <Label>Upload File (PDF, DOC, DOCX, PPT, PPTX)</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-emerald-300 transition-colors">
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="h-8 w-8 text-emerald-600" />
                  <div className="text-left min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => setFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Max file size: 50MB
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="note-title">Title</Label>
            <Input
              id="note-title"
              placeholder="e.g., Data Structures Complete Notes"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="note-desc">Description</Label>
            <Textarea
              id="note-desc"
              placeholder="Brief description of the notes content..."
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label>Subject</Label>
            <Select value={form.subject} onValueChange={(v) => setForm({ ...form, subject: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label>Listing Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, type: 'sell' })}
                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  form.type === 'sell'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-muted hover:border-muted-foreground/30'
                }`}
              >
                <DollarSign className="h-5 w-5" />
                <div className="text-left">
                  <p className="text-sm font-medium">Sell</p>
                  <p className="text-xs opacity-70">Set a price</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, type: 'donate', price: '0' })}
                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  form.type === 'donate'
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-muted hover:border-muted-foreground/30'
                }`}
              >
                <Gift className="h-5 w-5" />
                <div className="text-left">
                  <p className="text-sm font-medium">Donate</p>
                  <p className="text-xs opacity-70">Free for all</p>
                </div>
              </button>
            </div>
          </div>

          {/* Price */}
          {form.type === 'sell' && (
            <div className="space-y-2">
              <Label htmlFor="note-price">Price (₹)</Label>
              <Input
                id="note-price"
                type="number"
                min="1"
                placeholder="e.g., 99"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
          )}

          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Upload Notes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
