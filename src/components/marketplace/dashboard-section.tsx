'use client'

import { useState, useEffect } from 'react'
import { useAppStore, type Note, type Book, type Order } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  FileText,
  BookOpen,
  ShoppingBag,
  Download,
  Trash2,
  Eye,
  DollarSign,
  Wallet,
  Building2,
  Smartphone,
  Save,
  Loader2,
  IndianRupee,
  TrendingUp,
  Copy,
  CheckCircle2,
} from 'lucide-react'
import { toast } from 'sonner'
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

const COMMISSION = 5

export default function DashboardSection() {
  const {
    currentUser,
    setCurrentUser,
    setShowAuthDialog,
    notes,
    books,
    orders,
    setOrders,
    setSelectedNote,
    setSelectedBook,
    setShowUploadDialog,
    setCurrentView,
  } = useAppStore()
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'note' | 'book'; id: string } | null>(null)

  // Payment details form
  const [upiForm, setUpiForm] = useState({
    upiId: '',
    accountName: '',
    accountNumber: '',
    ifscCode: '',
  })
  const [savingPayment, setSavingPayment] = useState(false)
  const [copied, setCopied] = useState(false)

  // Load user's payment details when available
  useEffect(() => {
    if (currentUser) {
      setUpiForm({
        upiId: currentUser.upiId || '',
        accountName: currentUser.accountName || '',
        accountNumber: currentUser.accountNumber || '',
        ifscCode: currentUser.ifscCode || '',
      })
    }
  }, [currentUser])

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

  // Calculate earnings from orders where this user is the SELLER
  const sellerOrders = orders.filter((o) => {
    const note = notes.find((n) => n.id === o.noteId)
    return note && note.userId === currentUser?.id
  })
  const totalSalesRevenue = sellerOrders.reduce((sum, o) => sum + o.amount, 0)
  const totalCommissionPaid = sellerOrders.reduce((sum, o) => sum + o.commission, 0)
  const totalSellerPayout = sellerOrders.reduce((sum, o) => sum + o.sellerPayout, 0)
  const totalDownloads = myNotes.reduce((sum, n) => sum + n.downloads, 0)
  const hasPaymentDetails = !!(currentUser?.upiId || currentUser?.accountNumber)

  const handleSavePaymentDetails = async () => {
    if (!upiForm.upiId && !upiForm.accountNumber) {
      toast.error('Please provide UPI ID or bank account details')
      return
    }
    if (upiForm.upiId && !upiForm.upiId.includes('@')) {
      toast.error('Invalid UPI ID. It must contain @ (e.g., name@upi)')
      return
    }
    if (upiForm.accountNumber && (!upiForm.accountName || !upiForm.ifscCode)) {
      toast.error('Please fill all bank account fields')
      return
    }

    setSavingPayment(true)
    try {
      const res = await fetch('/api/users/payment-details', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.id,
          ...upiForm,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')

      // Update currentUser in store
      if (currentUser && data.user) {
        setCurrentUser({
          ...currentUser,
          upiId: data.user.upiId,
          accountName: data.user.accountName,
          accountNumber: data.user.accountNumber,
          ifscCode: data.user.ifscCode,
        })
      }
      toast.success('Payment details saved successfully!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save payment details')
    } finally {
      setSavingPayment(false)
    }
  }

  const handleCopyUpi = () => {
    if (currentUser?.upiId) {
      navigator.clipboard.writeText(currentUser.upiId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      const endpoint = deleteTarget.type === 'note' ? '/api/notes' : '/api/books'
      await fetch(`${endpoint}?id=${deleteTarget.id}`, { method: 'DELETE' })
      toast.success(`${deleteTarget.type === 'note' ? 'Note' : 'Book'} deleted`)
      setDeleteTarget(null)
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground mt-1">Welcome back, {currentUser.name}!</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => { setShowUploadDialog(true); setCurrentView('notes') }}
          >
            <FileText className="h-4 w-4" />
            Upload Note
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 gap-2"
            onClick={() => setCurrentView('notes')}
          >
            Browse Notes
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
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
              <IndianRupee className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">₹{totalSellerPayout}</p>
              <p className="text-xs text-muted-foreground">Your Earnings</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-100">
              <TrendingUp className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{sellerOrders.length}</p>
              <p className="text-xs text-muted-foreground">Total Sales</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="payment" className="w-full">
        <TabsList className="w-full max-w-lg mx-auto grid grid-cols-4">
          <TabsTrigger value="payment" className="gap-1 text-xs sm:text-sm">
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">Payment</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-1 text-xs sm:text-sm">
            <FileText className="h-4 w-4" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="books" className="gap-1 text-xs sm:text-sm">
            <BookOpen className="h-4 w-4" />
            Books
          </TabsTrigger>
          <TabsTrigger value="purchases" className="gap-1 text-xs sm:text-sm">
            <ShoppingBag className="h-4 w-4" />
            Purchases
          </TabsTrigger>
        </TabsList>

        {/* Payment Settings Tab */}
        <TabsContent value="payment" className="mt-6 space-y-6">
          {/* Earnings Summary */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                Earnings Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Sales Revenue</span>
                <span className="font-medium">₹{totalSalesRevenue}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Platform Fee (₹{COMMISSION}/sale)</span>
                <span className="font-medium text-red-600">- ₹{totalCommissionPaid}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-emerald-700">Your Payout</span>
                <span className="text-lg font-bold text-emerald-700">₹{totalSellerPayout}</span>
              </div>
              {sellerOrders.length > 0 && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  {sellerOrders.length} sale{sellerOrders.length > 1 ? 's' : ''} · ₹{COMMISSION} commission per sale
                </p>
              )}
            </CardContent>
          </Card>

          {/* Current Payment Details */}
          {hasPaymentDetails && (
            <Card className="border-0 shadow-sm border-l-4 border-l-emerald-500">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <h3 className="font-semibold text-sm">Active Payment Details</h3>
                </div>
                {currentUser.upiId && (
                  <div className="flex items-center justify-between bg-emerald-50 rounded-lg p-3">
                    <div>
                      <p className="text-xs text-muted-foreground">UPI ID</p>
                      <p className="font-medium text-sm">{currentUser.upiId}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0" onClick={handleCopyUpi}>
                      {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                )}
                {currentUser.accountName && (
                  <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                    <p className="text-xs text-muted-foreground">Bank Account</p>
                    <p className="font-medium text-sm">{currentUser.accountName}</p>
                    <p className="text-xs text-muted-foreground">
                      A/C: {currentUser.accountNumber?.replace(/(.{4})/g, '$1 ').trim()} · IFSC: {currentUser.ifscCode}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* UPI Setup Form */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Wallet className="h-4 w-4 text-emerald-600" />
                Payment Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Add your UPI ID or bank details to receive payouts when students purchase your notes.
                A platform fee of ₹{COMMISSION} is deducted per sale.
              </p>

              {/* UPI Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Smartphone className="h-4 w-4 text-blue-600" />
                  UPI (Recommended — Instant Transfer)
                </div>
                <div className="space-y-2">
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    placeholder="yourname@upi or yourname@paytm"
                    value={upiForm.upiId}
                    onChange={(e) => setUpiForm({ ...upiForm, upiId: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    You can find your UPI ID in Google Pay, PhonePe, or Paytm
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 border-t" />
                <span className="text-xs text-muted-foreground">OR</span>
                <div className="flex-1 border-t" />
              </div>

              {/* Bank Account Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Building2 className="h-4 w-4 text-purple-600" />
                  Bank Account (Direct Transfer)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="accountName">Account Holder Name</Label>
                    <Input
                      id="accountName"
                      placeholder="Full name as on bank account"
                      value={upiForm.accountName}
                      onChange={(e) => setUpiForm({ ...upiForm, accountName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      placeholder="XXXXXXXXXXXX"
                      value={upiForm.accountNumber}
                      onChange={(e) => setUpiForm({ ...upiForm, accountNumber: e.target.value.replace(/\D/g, '') })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ifscCode">IFSC Code</Label>
                    <Input
                      id="ifscCode"
                      placeholder="XXXX0000000"
                      className="uppercase"
                      value={upiForm.ifscCode}
                      onChange={(e) => setUpiForm({ ...upiForm, ifscCode: e.target.value.toUpperCase() })}
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSavePaymentDetails}
                className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2"
                disabled={savingPayment}
              >
                {savingPayment ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Payment Details
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Notes Tab */}
        <TabsContent value="notes" className="mt-6">
          {myNotes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground mb-4">You haven&apos;t uploaded any notes yet</p>
              <Button onClick={() => { setShowUploadDialog(true); setCurrentView('notes') }} className="bg-emerald-600 hover:bg-emerald-700 gap-2">
                <FileText className="h-4 w-4" />
                Upload Your First Note
              </Button>
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
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
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
              <p className="text-muted-foreground mb-4">You haven&apos;t listed any books yet</p>
              <Button onClick={() => setCurrentView('books')} className="bg-teal-600 hover:bg-teal-700 gap-2">
                <BookOpen className="h-4 w-4" />
                List Your First Book
              </Button>
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
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
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
              <p className="text-muted-foreground mb-4">You haven&apos;t purchased any notes yet</p>
              <Button onClick={() => setCurrentView('notes')} className="bg-emerald-600 hover:bg-emerald-700 gap-2">
                <FileText className="h-4 w-4" />
                Browse Notes
              </Button>
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
                        {order.razorpayPaymentId && (
                          <Badge variant="outline" className="text-xs gap-1">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                            Paid
                          </Badge>
                        )}
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

function Info({ className }: { className?: string }) {
  return (
    <svg className={className || ''} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
    </svg>
  )
}
