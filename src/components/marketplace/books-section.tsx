'use client'

import { useState, useEffect } from 'react'
import { useAppStore, type Book } from '@/lib/store'
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
  BookOpen,
  Search,
  Filter,
  Plus,
  Eye,
  MessageCircle,
  Tag,
  HandHeart,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import BookDetailDialog from './book-detail-dialog'
import ListBookDialog from './list-book-dialog'

function BookCard({ book }: { book: Book }) {
  const { setSelectedBook, currentUser } = useAppStore()

  const isOwner = currentUser?.id === book.userId
  const isAvailable = book.status === 'available'

  const typeBadgeClass = book.type === 'sell'
    ? 'bg-amber-500/15 text-amber-300 border-amber-500/20'
    : book.type === 'lend'
    ? 'bg-teal-500/15 text-teal-300 border-teal-500/20'
    : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20'

  const imageUrl = book.imageUrl
    ? `/api/serve-upload?path=${encodeURIComponent(book.imageUrl.replace('/uploads/', ''))}`
    : null

  return (
    <div className="group rounded-xl border border-white/6 bg-white/[0.03] overflow-hidden hover:border-emerald-500/20 hover:bg-white/[0.05] transition-all duration-300">
      {/* Image Area */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-teal-900/40 to-emerald-900/40">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-teal-600/80 to-emerald-700/80">
            <BookOpen className="h-16 w-16 text-white/70" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge className={`${typeBadgeClass} text-xs font-medium border`}>
            {book.type === 'sell' ? 'Sell' : book.type === 'lend' ? 'Lend' : 'Free'}
          </Badge>
        </div>
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="secondary" className="bg-red-500 text-white text-sm border-0">{book.status}</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-white line-clamp-1 text-sm">{book.title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">by {book.author}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs border-white/10 text-slate-400">{book.condition}</Badge>
          {book.edition && (
            <Badge variant="outline" className="text-xs border-white/10 text-slate-400">{book.edition}</Badge>
          )}
        </div>
        {book.type !== 'donate' ? (
          <div className="flex items-center gap-1.5 text-sm">
            <Tag className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-semibold text-amber-300">
              {book.type === 'lend' ? `₹${book.price}/month` : `₹${book.price}`}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-sm">
            <HandHeart className="h-3.5 w-3.5 text-emerald-400" />
            <span className="font-semibold text-emerald-300">Free</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 pt-0 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-1.5 text-xs h-9 rounded-lg border-white/10 text-slate-300 hover:bg-white/8 hover:text-white hover:border-emerald-500/30"
          onClick={() => setSelectedBook(book)}
        >
          <Eye className="h-3.5 w-3.5" />
          Details
        </Button>
        {!isOwner && isAvailable && (
          <Button
            size="sm"
            className="flex-1 gap-1.5 text-xs h-9 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white"
            onClick={() => setSelectedBook(book)}
          >
            <MessageCircle className="h-3.5 w-3.5" />
            {book.type === 'sell' ? 'Buy' : book.type === 'lend' ? 'Request' : 'Claim'}
          </Button>
        )}
      </div>
    </div>
  )
}

export default function BooksSection() {
  const { books, setBooks, setShowListBookDialog, currentUser, setShowAuthDialog, searchQuery, setSearchQuery } = useAppStore()
  const [typeFilter, setTypeFilter] = useState('all')
  const [conditionFilter, setConditionFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchBooks() }, [])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/books')
      const data = await res.json()
      if (res.ok) setBooks(data.books)
    } catch {
      toast.error('Failed to load books')
    } finally {
      setLoading(false)
    }
  }

  const filteredBooks = books.filter((book) => {
    const matchesSearch = !searchQuery ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || book.type === typeFilter
    const matchesCondition = conditionFilter === 'all' || book.condition === conditionFilter
    return matchesSearch && matchesType && matchesCondition
  })

  return (
    <section className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">Old Books</h2>
          <p className="text-slate-400 mt-1">Buy, sell, lend, or donate old textbooks and novels</p>
        </div>
        <Button
          onClick={() => {
            if (!currentUser) { setShowAuthDialog(true); return }
            setShowListBookDialog(true)
          }}
          className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 gap-2 shrink-0 rounded-lg h-10 text-white"
        >
          <Plus className="h-4 w-4" />
          List a Book
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search books by title or author..."
            className="pl-10 rounded-lg bg-white/5 border-white/8 text-white placeholder:text-slate-500 focus:border-teal-500/40"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-40 rounded-lg bg-white/5 border-white/8 text-slate-300">
            <Filter className="h-4 w-4 mr-2 text-slate-500" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className="bg-[#111827] border-white/10">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="sell">Buy</SelectItem>
            <SelectItem value="lend">Lend</SelectItem>
            <SelectItem value="donate">Donate / Free</SelectItem>
          </SelectContent>
        </Select>
        <Select value={conditionFilter} onValueChange={setConditionFilter}>
          <SelectTrigger className="w-full sm:w-44 rounded-lg bg-white/5 border-white/8 text-slate-300">
            <SelectValue placeholder="Condition" />
          </SelectTrigger>
          <SelectContent className="bg-[#111827] border-white/10">
            <SelectItem value="all">All Conditions</SelectItem>
            <SelectItem value="Like New">Like New</SelectItem>
            <SelectItem value="Good">Good</SelectItem>
            <SelectItem value="Fair">Fair</SelectItem>
            <SelectItem value="Worn">Worn</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-20">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-teal-500/10 flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-teal-500" />
          </div>
          <h3 className="font-semibold text-lg text-white">No books found</h3>
          <p className="text-slate-400 mt-1">
            {books.length === 0 ? 'Be the first to list a book!' : 'Try adjusting your search or filters'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}

      <BookDetailDialog />
      <ListBookDialog onListed={fetchBooks} />
    </section>
  )
}
