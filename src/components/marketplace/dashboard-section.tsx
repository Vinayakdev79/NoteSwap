'use client'

import { useState, useEffect } from 'react'
import { useAppStore, type Note, type Book, type Order } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  FileText,
  BookOpen,
  ShoppingBag,
  Download,
  Trash2,
  Eye,
  Loader2,
  BarChart3,
  DollarSign,
  Gift,
} from 'lucide-react'
import NoteDetailDialog from './note-detail-dialog'
import BookDetailDialog from './book-detail-dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function DashboardSection() {
  const {
    currentUser,
    setShowAuthDialog,
    notes,
    books,
    orders,
    setOrders,
    setSelectedNote,
    setSelectedBook,
  } = useAppStore()
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'note' | 'book'; id: string } | null>(null)

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/orders?userId=${currentUser?.id}`)
      const data = await res.json()
      if (res.ok) setOrders(data.orders)
    } catch {
      // silently fail
    }
  }

  useEffect(() => {
    if (currentUser) {
      fetchOrders()
    }
  }, [currentUser])

  const myNotes = notes.filter((n) => n.userId === currentUser?.id)
  const myBooks = books.filter((b) => b.userId === currentUser?.id)

  const totalEarnings = orders.reduce((sum, o) => sum + o.amount, 0)
  const totalDownloads = myNotes.reduce((sum, n) => sum + n.downloads, 0)

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      const endpoint = deleteTarget.type === 'note' ? '/api/notes' : '/api/books'
      await fetch(`${endpoint}?id=${deleteTarget.id}`, { method: 'DELETE' })
      toast.success(`${deleteTarget.type === 'note' ? 'Note' : 'Book'} deleted`)
      setDeleteTarget(null)
      // Refresh data
      window.location.reload()
    } catch {
      toast.error('Failed to delete')
    }
  }

  if (!currentUser) {
    return (
      <section className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Dashboard</h2>
        <p className="text-muted-foreground mb-4">Sign in to view your dashboard</p>
        <Button onClick={() => setShowAuthDialog(true)} className="bg-emerald-600 hover:bg-emerald-700">
          Sign In
        </Button>
      </section>
    )
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground mt-1">
          Welcome back, {currentUser.name}!
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100">
              <FileText className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{myNotes.length}</p>
              <p className="text-xs text-muted-foreground">My Notes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-100">
              <BookOpen className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{myBooks.length}</p>
              <p className="text-xs text-muted-foreground">My Books</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100">
              <Download className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalDownloads}</p>
              <p className="text-xs text-muted-foreground">Downloads</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <DollarSign className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">₹{totalEarnings}</p>
              <p className="text-xs text-muted-foreground">Earnings</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="notes" className="w-full">
        <TabsList className="w-full max-w-md mx-auto grid grid-cols-3">
          <TabsTrigger value="notes" className="gap-1">
            <FileText className="h-4 w-4" />
            My Notes
          </TabsTrigger>
          <TabsTrigger value="books" className="gap-1">
            <BookOpen className="h-4 w-4" />
            My Books
          </TabsTrigger>
          <TabsTrigger value="purchases" className="gap-1">
            <ShoppingBag className="h-4 w-4" />
            Purchases
          </TabsTrigger>
        </TabsList>

        {/* My Notes Tab */}
        <TabsContent value="notes" className="mt-6">
          {myNotes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">You haven&apos;t uploaded any notes yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myNotes.map((note) => (
                <Card key={note.id} className="border-0 shadow-sm">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-emerald-100 shrink-0">
                      <FileText className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{note.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{note.subject}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {note.downloads}
                        </span>
                        <Badge
                          variant={note.type === 'donate' ? 'secondary' : 'default'}
                          className={`text-xs ${note.type === 'donate' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}
                        >
                          {note.type === 'donate' ? 'Free' : `₹${note.price}`}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedNote(note)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget({ type: 'note', id: note.id })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* My Books Tab */}
        <TabsContent value="books" className="mt-6">
          {myBooks.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">You haven&apos;t listed any books yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myBooks.map((book) => (
                <Card key={book.id} className="border-0 shadow-sm">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-teal-100 shrink-0">
                      <BookOpen className="h-5 w-5 text-teal-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{book.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">by {book.author}</span>
                        <Badge variant="outline" className="text-xs">{book.condition}</Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            book.status === 'available'
                              ? 'border-emerald-200 text-emerald-700'
                              : 'border-red-200 text-red-700'
                          }`}
                        >
                          {book.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedBook(book)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget({ type: 'book', id: book.id })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Purchases Tab */}
        <TabsContent value="purchases" className="mt-6">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">You haven&apos;t purchased any notes yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <Card key={order.id} className="border-0 shadow-sm">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-amber-100 shrink-0">
                      <ShoppingBag className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">
                        {order.note?.title || 'Note'}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="text-xs bg-emerald-100 text-emerald-700">
                          ₹{order.amount}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 shrink-0"
                      onClick={() => window.open(`/api/upload/download/${order.noteId}`, '_blank')}
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <NoteDetailDialog />
      <BookDetailDialog />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {deleteTarget?.type === 'note' ? 'Note' : 'Book'}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the{' '}
              {deleteTarget?.type === 'note' ? 'note and its file' : 'book listing'}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
