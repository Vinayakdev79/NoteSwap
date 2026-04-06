'use client'

import { useState, useEffect } from 'react'
import { useAppStore, type Book } from '@/lib/store'
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
import BookDetailDialog from './book-detail-dialog'
import ListBookDialog from './list-book-dialog'

function BookCard({ book }: { book: Book }) {
  const { setSelectedBook, currentUser } = useAppStore()

  const isOwner = currentUser?.id === book.userId
  const isAvailable = book.status === 'available'
  const typeIcon = book.type === 'sell' ? Tag : book.type === 'lend' ? BookOpen : HandHeart
  const TypeIcon = typeIcon

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm hover:border-teal-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-sm line-clamp-1">{book.title}</h3>
            <p className="text-xs text-muted-foreground">{book.author}</p>
          </div>
          <Badge
            variant="outline"
            className={`shrink-0 ${
              book.type === 'sell'
                ? 'border-amber-200 text-amber-700 bg-amber-50'
                : book.type === 'lend'
                ? 'border-blue-200 text-blue-700 bg-blue-50'
                : 'border-emerald-200 text-emerald-700 bg-emerald-50'
            }`}
          >
            {book.type === 'sell' ? 'Sell' : book.type === 'lend' ? 'Lend' : 'Donate'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        {book.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {book.description}
          </p>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs">{book.condition}</Badge>
          {book.edition && (
            <Badge variant="outline" className="text-xs">{book.edition}</Badge>
          )}
          {book.type !== 'donate' && (
            <span className="text-xs font-medium text-amber-700 flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {book.type === 'lend' ? `₹${book.price}/month` : `₹${book.price}`}
            </span>
          )}
          {!isAvailable && (
            <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
              {book.status}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-3 border-t gap-2">
        <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => setSelectedBook(book)}>
          <Eye className="h-3 w-3" />
          Details
        </Button>
        {!isOwner && isAvailable && (
          <Button
            size="sm"
            className="gap-1 text-xs bg-teal-600 hover:bg-teal-700 ml-auto"
            onClick={() => setSelectedBook(book)}
          >
            <MessageCircle className="h-3 w-3" />
            {book.type === 'sell' ? 'Buy' : book.type === 'lend' ? 'Request' : 'Claim'}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default function BooksSection() {
  const { books, setBooks, setShowListBookDialog, currentUser, setShowAuthDialog, searchQuery, setSearchQuery } = useAppStore()
  const [typeFilter, setTypeFilter] = useState('all')
  const [conditionFilter, setConditionFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBooks()
  }, [])

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
          <h2 className="text-2xl md:text-3xl font-bold">Old Books</h2>
          <p className="text-muted-foreground mt-1">
            Buy, sell, lend, or donate old textbooks and novels
          </p>
        </div>
        <Button
          onClick={() => {
            if (!currentUser) {
              setShowAuthDialog(true)
              return
            }
            setShowListBookDialog(true)
          }}
          className="bg-teal-600 hover:bg-teal-700 gap-2 shrink-0"
        >
          <Plus className="h-4 w-4" />
          List a Book
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search books by title or author..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="sell">Buy</SelectItem>
            <SelectItem value="lend">Lend</SelectItem>
            <SelectItem value="donate">Donate / Free</SelectItem>
          </SelectContent>
        </Select>
        <Select value={conditionFilter} onValueChange={setConditionFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Condition" />
          </SelectTrigger>
          <SelectContent>
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
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="font-semibold text-lg">No books found</h3>
          <p className="text-muted-foreground mt-1">
            {books.length === 0
              ? 'Be the first to list a book!'
              : 'Try adjusting your search or filters'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <BookDetailDialog />
      <ListBookDialog onListed={fetchBooks} />
    </section>
  )
}
