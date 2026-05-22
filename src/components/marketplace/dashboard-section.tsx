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

  const [upiForm, setUpiForm] = useState({
    upiId: '',
    accountName: '',
    accountNumber: '',
    ifscCode: '',
  })
  const [savingPayment, setSavingPayment] = useState(false)
  const [copied, setCopied] = useState(false)

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
    } catch { /* silently fail */ }
  }

  useEffect(() => {
    if (currentUser) fetchOrders()
  }, [currentUser])

  const myNotes = notes.filter((n) => n.userId === currentUser?.id)
  const myBooks = books.filter((b) => b.userId === currentUser?.id)

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
        body: JSON.stringify({ userId: currentUser?.id, ...upiForm }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')

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
        <ShoppingBag className="h-12 w-12 mx-auto text-slate-600 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Dashboard</h2>
        <p className="text-slate-400 mb-4">Sign in to view your dashboard</p>
        <Button onClick={() => setShowAuthDialog(true)} className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white">
          Sign In
        </Button>
      </section>
    )
  }

  return (
    <section className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">Dashboard</h2>
          <p className="text-slate-400 mt-1">Welcome back, {currentUser.name}!</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2 border-white/10 text-slate-300 hover:bg-white/8 hover:text-white"
            onClick={() => { setShowUploadDialog(true); setCurrentView('notes') }}
          >
            <FileText className="h-4 w-4" />
            Upload Note
          </Button>
          <Button
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 gap-2 text-white"
            onClick={() => setCurrentView('notes')}
          >
            Browse Notes
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { icon: FileText, label: 'My Notes', value: myNotes.length, color: 'emerald' },
          { icon: BookOpen, label: 'My Books', value: myBooks.length, color: 'teal' },
          { icon: Download, label: 'Downloads', value: totalDownloads, color: 'amber' },
          { icon: IndianRupee, label: 'Your Earnings', value: `₹${totalSellerPayout}`, color: 'purple' },
          { icon: TrendingUp, label: 'Total Sales', value: sellerOrders.length, color: 'rose' },
        ].map((stat) => (
          <Card key={stat.label} className="border border-white/6 bg-white/[0.03]">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-${stat.color}-500/10`}>
                <stat.icon className={`h-5 w-5 text-${stat.color}-400`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="payment" className="w-full">
        <TabsList className="w-full max-w-lg mx-auto grid grid-cols-4 bg-white/[0.03] border border-white/6">
          <TabsTrigger value="payment" className="gap-1 text-xs sm:text-sm text-slate-400 data-[state=active]:bg-white/10 data-[state=active]:text-emerald-300">
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">Payment</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-1 text-xs sm:text-sm text-slate-400 data-[state=active]:bg-white/10 data-[state=active]:text-emerald-300">
            <FileText className="h-4 w-4" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="books" className="gap-1 text-xs sm:text-sm text-slate-400 data-[state=active]:bg-white/10 data-[state=active]:text-emerald-300">
            <BookOpen className="h-4 w-4" />
            Books
          </TabsTrigger>
          <TabsTrigger value="purchases" className="gap-1 text-xs sm:text-sm text-slate-400 data-[state=active]:bg-white/10 data-[state=active]:text-emerald-300">
            <ShoppingBag className="h-4 w-4" />
            Purchases
          </TabsTrigger>
        </TabsList>

        {/* Payment Tab */}
        <TabsContent value="payment" className="mt-6 space-y-6">
          {/* Earnings Summary */}
          <Card className="border border-white/6 bg-white/[0.03]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                Earnings Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Total Sales Revenue</span>
                <span className="font-medium text-white">₹{totalSalesRevenue}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Platform Fee (₹{COMMISSION}/sale)</span>
                <span className="font-medium text-red-400">- ₹{totalCommissionPaid}</span>
              </div>
              <Separator className="bg-white/6" />
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-emerald-300">Your Payout</span>
                <span className="text-lg font-bold text-emerald-300">₹{totalSellerPayout}</span>
              </div>
              {sellerOrders.length > 0 && (
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                  {sellerOrders.length} sale{sellerOrders.length > 1 ? 's' : ''} · ₹{COMMISSION} commission per sale
                </p>
              )}
            </CardContent>
          </Card>

          {/* Active Payment Details */}
          {hasPaymentDetails && (
            <Card className="border border-white/6 bg-white/[0.03] border-l-4 border-l-emerald-500">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <h3 className="font-semibold text-sm text-white">Active Payment Details</h3>
                </div>
                {currentUser.upiId && (
                  <div className="flex items-center justify-between bg-emerald-500/10 rounded-lg p-3">
                    <div>
                      <p className="text-xs text-slate-500">UPI ID</p>
                      <p className="font-medium text-sm text-white">{currentUser.upiId}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0 text-slate-400 hover:text-white" onClick={handleCopyUpi}>
                      {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                )}
                {currentUser.accountName && (
                  <div className="bg-white/[0.03] rounded-lg p-3 space-y-1">
                    <p className="text-xs text-slate-500">Bank Account</p>
                    <p className="font-medium text-sm text-white">{currentUser.accountName}</p>
                    <p className="text-xs text-slate-500">
                      A/C: {currentUser.accountNumber?.replace(/(.{4})/g, '$1 ').trim()} · IFSC: {currentUser.ifscCode}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Payment Settings Form */}
          <Card className="border border-white/6 bg-white/[0.03]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-white flex items-center gap-2">
                <Wallet className="h-4 w-4 text-emerald-400" />
                Payment Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-slate-400">
                Add your UPI ID or bank details to receive payouts when students purchase your notes.
                A platform fee of ₹{COMMISSION} is deducted per sale.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <Smartphone className="h-4 w-4 text-blue-400" />
                  UPI (Recommended — Instant Transfer)
                </div>
                <div className="space-y-2">
                  <Label htmlFor="upiId" className="text-slate-300">UPI ID</Label>
                  <Input
                    id="upiId"
                    placeholder="yourname@upi or yourname@paytm"
                    className="bg-white/5 border-white/8 text-white placeholder:text-slate-500 focus:border-emerald-500/40"
                    value={upiForm.upiId}
                    onChange={(e) => setUpiForm({ ...upiForm, upiId: e.target.value })}
                  />
                  <p className="text-xs text-slate-500">Find your UPI ID in Google Pay, PhonePe, or Paytm</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 border-t border-white/6" />
                <span className="text-xs text-slate-500">OR</span>
                <div className="flex-1 border-t border-white/6" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <Building2 className="h-4 w-4 text-purple-400" />
                  Bank Account (Direct Transfer)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="accountName" className="text-slate-300">Account Holder Name</Label>
                    <Input
                      id="accountName"
                      placeholder="Full name as on bank account"
                      className="bg-white/5 border-white/8 text-white placeholder:text-slate-500 focus:border-emerald-500/40"
                      value={upiForm.accountName}
                      onChange={(e) => setUpiForm({ ...upiForm, accountName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber" className="text-slate-300">Account Number</Label>
                    <Input
                      id="accountNumber"
                      placeholder="XXXXXXXXXXXX"
                      className="bg-white/5 border-white/8 text-white placeholder:text-slate-500 focus:border-emerald-500/40"
                      value={upiForm.accountNumber}
                      onChange={(e) => setUpiForm({ ...upiForm, accountNumber: e.target.value.replace(/\D/g, '') })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ifscCode" className="text-slate-300">IFSC Code</Label>
                    <Input
                      id="ifscCode"
                      placeholder="XXXX0000000"
                      className="bg-white/5 border-white/8 text-white placeholder:text-slate-500 focus:border-emerald-500/40 uppercase"
                      value={upiForm.ifscCode}
                      onChange={(e) => setUpiForm({ ...upiForm, ifscCode: e.target.value.toUpperCase() })}
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSavePaymentDetails}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 gap-2 text-white"
                disabled={savingPayment}
              >
                {savingPayment ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Payment Details
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Notes Tab */}
        <TabsContent value="notes" className="mt-6">
          {myNotes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-10 w-10 mx-auto text-slate-600 mb-3" />
              <p className="text-slate-400 mb-4">You haven&apos;t uploaded any notes yet</p>
              <Button onClick={() => { setShowUploadDialog(true); setCurrentView('notes') }} className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 gap-2 text-white">
                <FileText className="h-4 w-4" />
                Upload Your First Note
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {myNotes.map((note) => (
                <Card key={note.id} className="border border-white/6 bg-white/[0.03]">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-emerald-500/10 shrink-0">
                      <FileText className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-white truncate">{note.title}</h4>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge variant="outline" className="text-xs border-white/10 text-slate-400">{note.subject}</Badge>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Download className="h-3 w-3" />{note.downloads}
                        </span>
                        <Badge className={`text-xs border-0 ${note.type === 'donate' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>
                          {note.type === 'donate' ? 'Free' : `₹${note.price}`}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" onClick={() => setSelectedNote(note)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-400/60 hover:text-red-400" onClick={() => setDeleteTarget({ type: 'note', id: note.id })}>
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
              <BookOpen className="h-10 w-10 mx-auto text-slate-600 mb-3" />
              <p className="text-slate-400 mb-4">You haven&apos;t listed any books yet</p>
              <Button onClick={() => setCurrentView('books')} className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 gap-2 text-white">
                <BookOpen className="h-4 w-4" />
                List Your First Book
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {myBooks.map((book) => (
                <Card key={book.id} className="border border-white/6 bg-white/[0.03]">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-teal-500/10 shrink-0">
                      <BookOpen className="h-5 w-5 text-teal-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-white truncate">{book.title}</h4>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs text-slate-500">by {book.author}</span>
                        <Badge variant="outline" className="text-xs border-white/10 text-slate-400">{book.condition}</Badge>
                        <Badge variant="outline" className={`text-xs ${book.status === 'available' ? 'border-emerald-500/20 text-emerald-300' : 'border-red-500/20 text-red-300'}`}>
                          {book.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" onClick={() => setSelectedBook(book)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-400/60 hover:text-red-400" onClick={() => setDeleteTarget({ type: 'book', id: book.id })}>
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
              <ShoppingBag className="h-10 w-10 mx-auto text-slate-600 mb-3" />
              <p className="text-slate-400 mb-4">You haven&apos;t purchased any notes yet</p>
              <Button onClick={() => setCurrentView('notes')} className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 gap-2 text-white">
                <FileText className="h-4 w-4" />
                Browse Notes
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <Card key={order.id} className="border border-white/6 bg-white/[0.03]">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-amber-500/10 shrink-0">
                      <ShoppingBag className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-white truncate">{order.note?.title || 'Note'}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="text-xs bg-emerald-500/15 text-emerald-300 border-0">₹{order.amount}</Badge>
                        <span className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                        {order.razorpayPaymentId && (
                          <Badge variant="outline" className="text-xs gap-1 border-white/10">
                            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                            Paid
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 shrink-0 border-white/10 text-slate-300 hover:bg-white/8 hover:text-white"
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

      <NoteDetailDialog />
      <BookDetailDialog />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-[#111827] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete {deleteTarget?.type === 'note' ? 'Note' : 'Book'}?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This action cannot be undone. This will permanently delete the{' '}
              {deleteTarget?.type === 'note' ? 'note and its file' : 'book listing'}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 text-slate-300 hover:bg-white/8">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-500 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
