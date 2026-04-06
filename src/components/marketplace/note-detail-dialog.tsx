'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'
import {
  FileText,
  Download,
  User,
  GraduationCap,
  Calendar,
  DollarSign,
  Gift,
  Loader2,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function NoteDetailDialog() {
  const { selectedNote, setSelectedNote, currentUser, setPaymentNote, setShowPaymentDialog, setShowAuthDialog } = useAppStore()
  const [downloading, setDownloading] = useState(false)

  if (!selectedNote) return null

  const isOwner = currentUser?.id === selectedNote.userId
  const isFree = selectedNote.price === 0 || selectedNote.type === 'donate'

  const handleDownload = async () => {
    if (!currentUser) {
      setShowAuthDialog(true)
      return
    }

    if (isFree) {
      setDownloading(true)
      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ noteId: selectedNote.id, amount: 0 }),
        })
        if (res.ok) {
          toast.success('Download started!')
          window.open(`/api/upload/download/${selectedNote.id}`, '_blank')
        }
      } catch {
        toast.error('Failed to download')
      } finally {
        setDownloading(false)
      }
    } else {
      setPaymentNote(selectedNote)
      setShowPaymentDialog(true)
    }
  }

  const handleOwnerDownload = () => {
    window.open(`/api/upload/download/${selectedNote.id}`, '_blank')
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <Dialog open={!!selectedNote} onOpenChange={(open) => !open && setSelectedNote(null)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-600" />
            {selectedNote.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Meta */}
          <div className="flex flex-wrap gap-2">
            <Badge variant={isFree ? 'secondary' : 'default'} className={isFree ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
              {isFree ? 'Free' : `₹${selectedNote.price}`}
            </Badge>
            <Badge variant="outline">{selectedNote.subject}</Badge>
            <Badge variant="outline" className="gap-1">
              <Download className="h-3 w-3" />
              {selectedNote.downloads} downloads
            </Badge>
          </div>

          {/* Description */}
          {selectedNote.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {selectedNote.description}
            </p>
          )}

          {/* File Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{selectedNote.fileName}</span>
              <span className="text-muted-foreground">({formatFileSize(selectedNote.fileSize)})</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Uploaded on {formatDate(selectedNote.createdAt)}
            </div>
          </div>

          {/* Author */}
          {selectedNote.user && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              <div className="p-2 rounded-full bg-emerald-100">
                <User className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium">{selectedNote.user.name}</p>
                {selectedNote.user.college && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <GraduationCap className="h-3 w-3" />
                    {selectedNote.user.college}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action */}
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2"
            onClick={isOwner ? handleOwnerDownload : handleDownload}
            disabled={downloading}
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isOwner ? (
              <Download className="h-4 w-4" />
            ) : isFree ? (
              <Gift className="h-4 w-4" />
            ) : (
              <DollarSign className="h-4 w-4" />
            )}
            {isOwner
              ? 'Download My File'
              : isFree
              ? 'Download for Free'
              : `Buy for ₹${selectedNote.price}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
