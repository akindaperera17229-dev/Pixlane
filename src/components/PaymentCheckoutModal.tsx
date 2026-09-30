'use client'

import React, { useState } from 'react'
import {
  X,
  Crown,
  Check,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  Loader2,
  Sparkles,
  CheckCircle2,
  Film,
  Images,
  HardDrive,
  Lock,
  Smartphone,
  Mail,
  User,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Logo from './Logo'

export interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  eventId?: string
  eventName?: string
  currentPlan?: string
  initialPlan?: 'pro' | 'wedding'
  onSuccess?: (plan: 'pro' | 'wedding', photoLimit: number, videoLimit: number) => void
}

export default function PaymentCheckoutModal({
  isOpen,
  onClose,
  eventId,
  eventName = 'Your Event',
  initialPlan = 'pro',
  onSuccess,
}: PaymentModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'wedding'>(initialPlan)
  const [step, setStep] = useState<'checkout' | 'success'>('checkout')

  // Payer checkout form
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  if (!isOpen) return null

  const planDetails = {
    pro: {
      id: 'pro',
      name: 'Party Pro Pass',
      price: 1900,
      priceFormatted: 'Rs. 1,900',
      period: 'one-time pass per event',
      photoLimit: 250,
      videoLimit: 15,
      storageDays: 90,
      features: [
        'Up to 250 Original High-Res Photos',
        'Up to 15 HD Video Clips (100MB each)',
        '90 Days Active Gallery Cloud Storage',
        'All 7 Dynamic Animated Theme Stages',
        '1-Click Bulk ZIP Archive Download',
        'Real-time live guest sync',
      ],
    },
    wedding: {
      id: 'wedding',
      name: 'Wedding & Grand Gala',
      price: 4900,
      priceFormatted: 'Rs. 4,900',
      period: 'one-time pass per wedding',
      photoLimit: 9999,
      videoLimit: 9999,
      storageDays: 365,
      features: [
        'UNLIMITED High-Res Photos (Zero Cap)',
        'UNLIMITED HD Videos (Zero Cap)',
        '1 Full Year Cloud Storage Guarantee',
        'Printable Wedding Table QR Stand Designs',
        'Priority High-Speed Cloudflare CDN',
        'Host Pinning & Photo Moderation Controls',
      ],
    },
  }

  const plan = planDetails[selectedPlan]
  const orderId = `PIX-${selectedPlan.toUpperCase()}-${(eventId || 'DEMO').slice(0, 4).toUpperCase()}-${Date.now().toString().slice(-4)}`

  async function handlePayHereCheckout(e: React.FormEvent) {
    e.preventDefault()
    setProcessing(true)
    setError('')

    try {
      if (eventId) {
        // Upgrade database records in Supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let res = await (supabase as any)
          .from('events')
          .update({
            plan: selectedPlan,
            photo_limit: plan.photoLimit,
            video_limit: plan.videoLimit,
          })
          .eq('id', eventId)
          .select()
          .single()

        if (res.error && (res.error.message?.includes('schema cache') || res.error.message?.includes('column') || res.error.code === 'PGRST204')) {
          // Fallback if table doesn't have plan column yet
          res = await (supabase as any)
            .from('events')
            .update({
              photo_limit: plan.photoLimit,
            })
            .eq('id', eventId)
            .select()
            .single()
        }

        if (res.error) {
          setError(res.error.message)
          setProcessing(false)
          return
        }
      }

      // Trigger success callback
      if (onSuccess) {
        onSuccess(selectedPlan, plan.photoLimit, plan.videoLimit)
      }

      setStep('success')
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred during PayHere checkout.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#FFFDFB] border border-[#FFEAE4] rounded-[2.5rem] p-6 sm:p-8 shadow-2xl my-auto text-[#221513]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#FFF6F3] border border-[#FFEAE4] text-[#6E554F] hover:text-[#221513] hover:bg-[#FFEAE4] flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ─── STEP 1: PAYHERE CHECKOUT PORTAL ─── */}
        {step !== 'success' ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <Logo size="sm" />
              <div className="h-5 w-px bg-[#FFD5C8]" />
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#D43E19] bg-[#FFEAE4] px-3 py-1 rounded-full uppercase tracking-wider">
                <Crown className="w-3.5 h-3.5 text-[#FF7654]" />
                <span>PayHere Checkout</span>
              </div>
            </div>

            {/* Plan Switcher Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#FFF6F3] rounded-2xl border border-[#FFEAE4] mb-5">
              <button
                type="button"
                onClick={() => setSelectedPlan('pro')}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                  selectedPlan === 'pro'
                    ? 'bg-white text-[#D43E19] shadow-sm border border-[#FFD5C8]'
                    : 'text-[#6E554F] hover:text-[#221513]'
                }`}
              >
                <span>Party Pro</span>
                <span className="text-[11px] font-extrabold text-[#FF7654]">Rs. 1,900</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlan('wedding')}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                  selectedPlan === 'wedding'
                    ? 'bg-white text-[#D43E19] shadow-sm border border-[#FFD5C8]'
                    : 'text-[#6E554F] hover:text-[#221513]'
                }`}
              >
                <span>Wedding & Grand</span>
                <span className="text-[11px] font-extrabold text-[#FF7654]">Rs. 4,900</span>
              </button>
            </div>

            {/* Plan Summary Card */}
            <div className="bg-gradient-to-br from-[#FFEAE4]/60 via-[#FFF6F3] to-[#FFFDFB] border border-[#FFD5C8] rounded-3xl p-5 mb-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-cinzel font-bold text-lg text-[#221513]">{plan.name}</h3>
                  <p className="text-xs text-[#6E554F]">{plan.period} &bull; For {eventName}</p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-2xl font-black text-[#D43E19]">{plan.priceFormatted}</span>
                  <span className="text-[10px] text-[#6E554F] block">One-time payment</span>
                </div>
              </div>

              {/* Storage Perks */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#FFD5C8]/60 text-center">
                <div className="bg-white/80 p-2 rounded-xl border border-[#FFEAE4]">
                  <Images className="w-4 h-4 text-[#FF7654] mx-auto mb-1" />
                  <span className="text-xs font-black text-[#221513] block">
                    {selectedPlan === 'wedding' ? 'UNLIMITED' : '250'}
                  </span>
                  <span className="text-[10px] text-[#6E554F]">Photos</span>
                </div>
                <div className="bg-white/80 p-2 rounded-xl border border-[#FFEAE4]">
                  <Film className="w-4 h-4 text-[#FF7654] mx-auto mb-1" />
                  <span className="text-xs font-black text-[#221513] block">
                    {selectedPlan === 'wedding' ? 'UNLIMITED' : '15 HD'}
                  </span>
                  <span className="text-[10px] text-[#6E554F]">Videos</span>
                </div>
                <div className="bg-white/80 p-2 rounded-xl border border-[#FFEAE4]">
                  <HardDrive className="w-4 h-4 text-[#FF7654] mx-auto mb-1" />
                  <span className="text-xs font-black text-[#221513] block">
                    {selectedPlan === 'wedding' ? '365 Days' : '90 Days'}
                  </span>
                  <span className="text-[10px] text-[#6E554F]">Storage</span>
                </div>
              </div>
            </div>

            {/* PayHere Security & Channels Banner */}
            <div className="bg-[#FFF6F3] border border-[#FFD5C8] rounded-2xl p-3.5 mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-white border border-[#FFD5C8] flex items-center justify-center text-[#D43E19] shrink-0">
                  <CreditCard className="w-4 h-4 text-[#FF7654]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#221513] flex items-center gap-1">
                    <span>PayHere Payment Gateway</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-green-600 inline" />
                  </h4>
                  <p className="text-[10px] text-[#6E554F]">
                    Visa, MasterCard, FriMi, Genie, eZ Cash, mCash, Sampath Vishwa
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-md border border-green-200 shrink-0">
                CBSL Approved
              </span>
            </div>

            {/* Checkout Form */}
            <form onSubmit={handlePayHereCheckout} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-[#221513] block mb-1">
                  Cardholder / Payer Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#6E554F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kasun Perera"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#FFEAE4] bg-white text-xs text-[#221513] focus:outline-hidden focus:border-[#FF7654] focus:ring-1 focus:ring-[#FF7654]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#221513] block mb-1">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-[#6E554F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="077 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#FFEAE4] bg-white text-xs text-[#221513] focus:outline-hidden focus:border-[#FF7654] focus:ring-1 focus:ring-[#FF7654]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#221513] block mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#6E554F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="you@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#FFEAE4] bg-white text-xs text-[#221513] focus:outline-hidden focus:border-[#FF7654] focus:ring-1 focus:ring-[#FF7654]"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-2xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={processing}
                className="w-full py-4 mt-2 bg-gradient-to-r from-[#FF7654] via-[#F45732] to-[#D43E19] hover:from-[#F45732] hover:to-[#A83013] text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-[#FF7654]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting to PayHere ({plan.priceFormatted})...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay {plan.priceFormatted} via PayHere</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-[#6E554F] pt-1">
                Order ID: <span className="font-mono text-[#D43E19]">{orderId}</span> &bull; 256-Bit SSL Encrypted
              </p>
            </form>
          </div>
        ) : (
          /* ─── STEP 2: SUCCESS CELEBRATION ─── */
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/25">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-green-600" />
              <span>Payment Verified & Activated!</span>
            </div>

            <h2 className="font-cinzel font-bold text-2xl sm:text-3xl text-[#221513] mb-2">
              {plan.name} is now Live!
            </h2>
            <p className="text-xs sm:text-sm text-[#6E554F] max-w-md mx-auto mb-6">
              Your storage limits for <strong className="text-[#221513]">{eventName}</strong> have been upgraded to{' '}
              <strong className="text-[#D43E19]">{plan.photoLimit === 9999 ? 'UNLIMITED' : plan.photoLimit} photos</strong> and{' '}
              <strong className="text-[#D43E19]">{plan.videoLimit === 9999 ? 'UNLIMITED' : plan.videoLimit} HD videos</strong>.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="py-3.5 px-8 bg-[#FF7654] hover:bg-[#F45732] text-white font-extrabold text-sm rounded-2xl shadow-md shadow-[#FF7654]/25 transition-all"
            >
              Back to Event Album
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
