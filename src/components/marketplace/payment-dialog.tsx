'use client'

import { useState } from 'react'
import Script from 'next/script'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'
import { Loader2, ShieldCheck, CheckCircle2, Smartphone, Building2, Wallet, Info } from 'lucide-react'
import { toast } from 'sonner'

const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_1234567890'

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance
  }
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: RazorpayResponse) => void
  prefill: { name: string; email: string; contact?: string }
  theme: { color: string }
  modal?: { ondismiss?: () => void }
}

interface RazorpayInstance {
  open: () => void
  close: () => void
}

interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

export default function PaymentDialog() {
  const { showPaymentDialog, setShowPaymentDialog, paymentNote, setPaymentNote, currentUser } = useAppStore()
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form')

  if (!paymentNote) return null

  const COMMISSION = 5
  const sellerGets = Math.max(0, paymentNote.price - COMMISSION)

  const resetDialog = () => {
    setStep('form')
    setPaymentNote(null)
    setShowPaymentDialog(false)
  }

  const openRazorpayCheckout = async (orderData: { orderId: string; amount: number; key: string }) => {
    if (typeof window === 'undefined' || !window.Razorpay) {
      // Fallback if Razorpay SDK is not loaded (demo mode)
      handleDemoPayment(orderData.orderId)
      return
    }

    const options: RazorpayOptions = {
      key: orderData.key,
      amount: orderData.amount,
      currency: 'INR',
      name: 'NoteSwap',
      description: `Purchase: ${paymentNote.title}`,
      order_id: orderData.orderId,
      handler: async (response: RazorpayResponse) => {
        await verifyAndCompletePayment(
          response.razorpay_order_id,
          response.razorpay_payment_id,
          response.razorpay_signature,
        )
      },
      prefill: {
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        contact: currentUser?.phone || undefined,
      },
      theme: {
        color: '#059669', // emerald-600
      },
      modal: {
        ondismiss: () => {
          setStep('form')
          toast.info('Payment cancelled')
        },
      },
    }

    try {
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch {
      // Fallback to demo mode
      handleDemoPayment(orderData.orderId)
    }
  }

  const handleDemoPayment = async (orderId: string) => {
    setStep('processing')
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    await verifyAndCompletePayment(orderId, `pay_demo_${Date.now()}`, `sig_demo_${Date.now()}`)
  }

  const verifyAndCompletePayment = async (
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
  ) => {
    setStep('processing')
    try {
      // 1. Verify payment
      await fetch('/api/razorpay', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: razorpaySignature,
          noteId: paymentNote.id,
          userId: currentUser?.id,
          amount: paymentNote.price,
        }),
      })

      // 2. Create order record with commission
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteId: paymentNote.id,
          amount: paymentNote.price,
          userId: currentUser?.id,
          razorpayPaymentId,
          razorpayOrderId,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to record order')

      setStep('success')
      toast.success('Payment successful! Downloading your notes...')

      // Auto-download after a delay
      setTimeout(() => {
        window.open(`/api/upload/download/${paymentNote.id}`, '_blank')
      }, 1500)
    } catch {
      toast.error('Payment failed. Please try again.')
      setStep('form')
    }
  }

  const handlePayNow = async () => {
    if (!currentUser) {
      toast.error('Please sign in to purchase notes')
      return
    }

    try {
      // Create Razorpay order
      const res = await fetch('/api/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: paymentNote.price,
          noteId: paymentNote.id,
          userId: currentUser.id,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create payment order')

      // Open Razorpay checkout
      openRazorpayCheckout(data)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to initiate payment')
    }
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <Dialog open={showPaymentDialog} onOpenChange={(open) => !open && resetDialog()}>
        <DialogContent className="sm:max-w-md bg-[#111827] border-white/10">
          {step === 'form' && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-white">
                  <Wallet className="h-5 w-5 text-emerald-400" />
                  Secure Payment
                </DialogTitle>
                <DialogDescription className="text-slate-400">
                  Purchase &quot;{paymentNote.title}&quot; via Razorpay
                </DialogDescription>
              </DialogHeader>

              {/* Price Breakdown */}
              <div className="border border-white/6 bg-white/[0.03] rounded-lg p-4 space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Note Price</span>
                  <span className="font-semibold text-emerald-400">₹{paymentNote.price}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Platform Fee</span>
                  <span className="font-semibold text-emerald-400">₹{COMMISSION}</span>
                </div>
                <div className="border-t border-white/6 pt-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-white">You Pay</span>
                  <span className="text-xl font-bold text-emerald-400">₹{paymentNote.price}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Info className="h-3 w-3 shrink-0" />
                  <span>Seller receives ₹{sellerGets} after platform fee</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3 mb-4">
                <p className="text-xs font-medium text-slate-400">Pay securely via Razorpay</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-white/6 bg-white/[0.03]">
                    <Smartphone className="h-5 w-5 text-blue-400" />
                    <span className="text-xs font-medium text-slate-300">UPI</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-white/6 bg-white/[0.03]">
                    <Building2 className="h-5 w-5 text-purple-400" />
                    <span className="text-xs font-medium text-slate-300">Net Banking</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-white/6 bg-white/[0.03]">
                    <Wallet className="h-5 w-5 text-amber-400" />
                    <span className="text-xs font-medium text-slate-300">Wallet</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Payments are secured by Razorpay with 256-bit encryption</span>
              </div>

              <Button
                onClick={handlePayNow}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white gap-2 h-12 text-base font-semibold"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="none"/>
                </svg>
                Pay ₹{paymentNote.price} with Razorpay
              </Button>
            </>
          )}

          {step === 'processing' && (
            <div className="py-12 text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Processing Payment</h3>
              <p className="text-sm text-slate-400">
                Please wait while we verify your payment...
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="py-8 text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Payment Successful!</h3>
              <p className="text-sm text-slate-400">
                Your download will start automatically. You can also download from your dashboard.
              </p>
              <Button onClick={resetDialog} className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white">
                Done
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
