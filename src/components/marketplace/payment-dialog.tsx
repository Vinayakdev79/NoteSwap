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
import { useAppStore } from '@/lib/store'
import { CreditCard, Loader2, ShieldCheck, CheckCircle2, Lock } from 'lucide-react'
import { toast } from 'sonner'

const MOCK_CARDS = [
  { last4: '4242', brand: 'Visa' },
  { last4: '8888', brand: 'Mastercard' },
]

export default function PaymentDialog() {
  const { showPaymentDialog, setShowPaymentDialog, paymentNote, setPaymentNote } = useAppStore()
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardName, setCardName] = useState('')

  if (!paymentNote) return null

  const resetDialog = () => {
    setStep('form')
    setCardNumber('')
    setExpiry('')
    setCvv('')
    setCardName('')
    setPaymentNote(null)
    setShowPaymentDialog(false)
  }

  const formatCardNumber = (value: string) => {
    const clean = value.replace(/\D/g, '').slice(0, 16)
    return clean.replace(/(.{4})/g, '$1 ').trim()
  }

  const formatExpiry = (value: string) => {
    const clean = value.replace(/\D/g, '').slice(0, 4)
    if (clean.length > 2) return clean.slice(0, 2) + '/' + clean.slice(2)
    return clean
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (cardNumber.replace(/\s/g, '').length < 16) {
      toast.error('Please enter a valid card number')
      return
    }
    if (expiry.length < 5) {
      toast.error('Please enter a valid expiry date')
      return
    }
    if (cvv.length < 3) {
      toast.error('Please enter a valid CVV')
      return
    }

    setStep('processing')

    // Simulate payment processing
    setTimeout(async () => {
      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ noteId: paymentNote.id, amount: paymentNote.price }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Payment failed')

        setStep('success')
        toast.success('Payment successful! Downloading your notes...')

        // Auto-download after a delay
        setTimeout(() => {
          window.open(`/api/upload/download/${paymentNote.id}`, '_blank')
        }, 1000)
      } catch {
        toast.error('Payment failed. Please try again.')
        setStep('form')
      }
    }, 2000)
  }

  const handleSelectCard = (last4: string) => {
    setCardNumber(`•••• •••• •••• ${last4}`)
    setExpiry('12/28')
    setCvv('•••')
    setCardName('Cardholder Name')
  }

  return (
    <Dialog open={showPaymentDialog} onOpenChange={(open) => !open && resetDialog()}>
      <DialogContent className="sm:max-w-md">
        {step === 'form' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-emerald-600" />
                Secure Payment
              </DialogTitle>
              <DialogDescription>
                Complete your purchase to download &quot;{paymentNote.title}&quot;
              </DialogDescription>
            </DialogHeader>

            <div className="bg-emerald-50 rounded-lg p-4 flex items-center justify-between mb-4">
              <span className="text-sm text-emerald-800">Amount to pay</span>
              <span className="text-2xl font-bold text-emerald-700">₹{paymentNote.price}</span>
            </div>

            {/* Quick Card Selection */}
            <div className="space-y-2 mb-4">
              <Label className="text-xs text-muted-foreground">Quick select saved card</Label>
              <div className="flex gap-2">
                {MOCK_CARDS.map((card) => (
                  <button
                    key={card.last4}
                    type="button"
                    onClick={() => handleSelectCard(card.last4)}
                    className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    {card.brand} •••• {card.last4}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handlePayment} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-name">Cardholder Name</Label>
                <Input
                  id="card-name"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input
                  id="card-number"
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    type="password"
                    placeholder="•••"
                    maxLength={4}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Your payment is secured with 256-bit SSL encryption</span>
              </div>

              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2">
                <Lock className="h-4 w-4" />
                Pay ₹{paymentNote.price}
              </Button>
            </form>
          </>
        )}

        {step === 'processing' && (
          <div className="py-12 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold">Processing Payment</h3>
            <p className="text-sm text-muted-foreground">
              Please wait while we process your payment securely...
            </p>
          </div>
        )}

        {step === 'success' && (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold">Payment Successful!</h3>
            <p className="text-sm text-muted-foreground">
              Your download will start automatically. You can also download from your dashboard.
            </p>
            <Button onClick={resetDialog} className="bg-emerald-600 hover:bg-emerald-700">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
