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
import { BookOpen, Loader2, Upload, X, Image as ImageIcon, Tag, HandHelping, Repeat } from 'lucide-react'
import { toast } from 'sonner'

interface ListBookDialogProps {
  onListed?: () => void
}

export default function ListBookDialog({ onListed }: ListBookDialogProps) {
  const { showListBookDialog, setShowListBookDialog, addBook, currentUser } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    author: '',
    edition: '',
    condition: 'Good',
    type: 'sell' as 'sell' | 'lend' | 'donate',
    price: '0',
    description: '',
  })

  const resetForm = () => {
    setForm({
      title: '',
      author: '',
      edition: '',
      condition: 'Good',
      type: 'sell',
      price: '0',
      description: '',
    })
    setImageFile(null)
    setImagePreview(null)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image must be less than 10MB')
        return
      }
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) {
      toast.error('Please enter the book title')
      return
    }
    if (!form.author.trim()) {
      toast.error('Please enter the author name')
      return
    }
    if ((form.type === 'sell' || form.type === 'lend') && (!form.price || Number(form.price) <= 0)) {
      toast.error('Please set a valid price')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('author', form.author)
      formData.append('edition', form.edition)
      formData.append('condition', form.condition)
      formData.append('type', form.type)
      formData.append('price', form.type === 'donate' ? '0' : form.price)
      formData.append('description', form.description)
      if (imageFile) formData.append('image', imageFile)
      if (currentUser?.id) formData.append('userId', currentUser.id)

      const res = await fetch('/api/books', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to list book')

      addBook(data.book)
      toast.success('Book listed successfully!')
      setShowListBookDialog(false)
      resetForm()
      onListed?.()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to list book')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={showListBookDialog} onOpenChange={(open) => {
      if (!open) resetForm()
      setShowListBookDialog(open)
    }}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-[#111827] border-white/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <BookOpen className="h-5 w-5 text-teal-400" />
            List a Book
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Sell, lend, or donate your old books to fellow students.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-slate-300">Book Photo (optional)</Label>
            <div className="border-2 border-dashed border-white/10 rounded-lg p-4 hover:border-teal-500/40 transition-colors">
              {imagePreview ? (
                <div className="flex items-center gap-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-20 w-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-white">{imageFile?.name}</p>
                    <p className="text-xs text-slate-500">
                      {(imageFile!.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setImageFile(null)
                      setImagePreview(null)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="cursor-pointer block text-center py-3">
                  <ImageIcon className="h-6 w-6 mx-auto text-slate-500 mb-1" />
                  <p className="text-xs text-slate-400">Click to add photo</p>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="book-title" className="text-slate-300">Book Title</Label>
            <Input
              id="book-title"
              placeholder="e.g., Introduction to Algorithms"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="bg-white/5 border-white/8 text-white placeholder:text-slate-500 focus:border-emerald-500/40"
            />
          </div>

          {/* Author */}
          <div className="space-y-2">
            <Label htmlFor="book-author" className="text-slate-300">Author</Label>
            <Input
              id="book-author"
              placeholder="e.g., Thomas H. Cormen"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="bg-white/5 border-white/8 text-white placeholder:text-slate-500 focus:border-emerald-500/40"
            />
          </div>

          {/* Edition & Condition */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="book-edition" className="text-slate-300">Edition (optional)</Label>
              <Input
                id="book-edition"
                placeholder="e.g., 4th Edition"
                value={form.edition}
                onChange={(e) => setForm({ ...form, edition: e.target.value })}
                className="bg-white/5 border-white/8 text-white placeholder:text-slate-500 focus:border-emerald-500/40"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Condition</Label>
              <Select value={form.condition} onValueChange={(v) => setForm({ ...form, condition: v })}>
                <SelectTrigger className="bg-white/5 border-white/8 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Like New">Like New</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Worn">Worn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label className="text-slate-300">Listing Type</Label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, type: 'sell' })}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all text-xs ${
                  form.type === 'sell'
                    ? 'border-teal-500 bg-teal-500/10 text-teal-400'
                    : 'border-white/10 text-slate-300 hover:border-white/20'
                }`}
              >
                <Tag className="h-5 w-5" />
                <span className="font-medium">Sell</span>
                <span className="opacity-70">One-time</span>
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, type: 'lend' })}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all text-xs ${
                  form.type === 'lend'
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                    : 'border-white/10 text-slate-300 hover:border-white/20'
                }`}
              >
                <Repeat className="h-5 w-5" />
                <span className="font-medium">Lend</span>
                <span className="opacity-70">Temporary</span>
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, type: 'donate', price: '0' })}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all text-xs ${
                  form.type === 'donate'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                    : 'border-white/10 text-slate-300 hover:border-white/20'
                }`}
              >
                <HandHelping className="h-5 w-5" />
                <span className="font-medium">Donate</span>
                <span className="opacity-70">Free</span>
              </button>
            </div>
          </div>

          {/* Price */}
          {form.type !== 'donate' && (
            <div className="space-y-2">
              <Label htmlFor="book-price" className="text-slate-300">
                Price (₹) {form.type === 'lend' ? '- per month' : ''}
              </Label>
              <Input
                id="book-price"
                type="number"
                min="1"
                placeholder={form.type === 'lend' ? 'e.g., 50/month' : 'e.g., 250'}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="bg-white/5 border-white/8 text-white placeholder:text-slate-500 focus:border-emerald-500/40"
              />
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="book-desc" className="text-slate-300">Description (optional)</Label>
            <Textarea
              id="book-desc"
              placeholder="Any highlights, notes, or details about the book..."
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="bg-white/5 border-white/8 text-white placeholder:text-slate-500 focus:border-emerald-500/40"
            />
          </div>

          <Button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            List Book
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
