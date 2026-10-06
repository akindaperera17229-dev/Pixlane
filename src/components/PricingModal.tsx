'use client'

import React, { useState } from 'react'
import { Check, Sparkles, X, Crown, Flame, Shield, ArrowRight, Video, Camera } from 'lucide-react'
import PaymentCheckoutModal from './PaymentCheckoutModal'

interface PricingModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectPlan?: (planId: 'free' | 'pro' | 'wedding') => void
  currentPlan?: string
  eventId?: string
  eventName?: string
}

export const PIXLANE_PLANS = [
  {
    id: 'free',
    name: 'Outing Free',
    tagline: 'Perfect for small hangouts & trips',
    price: 'Rs. 0',
    period: 'forever free',
    badge: null,
    features: [
      'Up to 60 high-res photos',
      'Up to 10 short videos (max 50MB each)',
      '30 days active gallery storage',
      'Instant QR code & upload link',
      'No app download for guests',
      '1-Click ZIP download',
    ],
    buttonText: 'Current Plan',
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Party Pro',
    tagline: 'For birthdays, batches & road trips',
    price: 'Rs. 1,900',
    period: 'one-time per event',
    badge: 'Popular',
    features: [
      'Up to 300 high-res photos',
      'Up to 30 HD videos (max 100MB)',
      '90 days active gallery storage',
      'Animated event theme backgrounds',
      'Full ZIP archive download',
      'Instant live photo stream',
    ],
    buttonText: 'Upgrade to Pro',
    highlight: true,
  },
  {
    id: 'wedding',
    name: 'Wedding & Grand',
    tagline: 'For weddings, gala nights & festivals',
    price: 'Rs. 4,900',
    period: 'one-time per event',
    badge: 'Best Value',
    features: [
      'UNLIMITED Photos',
      'UNLIMITED HD Videos',
      '1 Full Year cloud preservation',
      'All animated event themes unlocked',
      'Printable Table QR designs',
      'Host moderation & pin top moments',
      'Priority high-speed bulk download',
    ],
    buttonText: 'Get Wedding Pass',
    highlight: false,
  },
]

export default function PricingModal({
  isOpen,
  onClose,
  onSelectPlan,
  currentPlan = 'free',
  eventId,
  eventName,
}: PricingModalProps) {
  const [checkoutPlan, setCheckoutPlan] = useState<'pro' | 'wedding' | null>(null)

  if (!isOpen) return null

  function handleChoose(planId: 'free' | 'pro' | 'wedding') {
    if (planId === 'free') {
      if (onSelectPlan) onSelectPlan('free')
      onClose()
      return
    }

    // Open integrated Sri Lankan checkout modal
    setCheckoutPlan(planId)
  }

  if (checkoutPlan) {
    return (
      <PaymentCheckoutModal
        isOpen={true}
        onClose={() => {
          setCheckoutPlan(null)
          onClose()
        }}
        eventId={eventId}
        eventName={eventName}
        initialPlan={checkoutPlan}
        onSuccess={(upgradedPlan) => {
          if (onSelectPlan) onSelectPlan(upgradedPlan)
          setCheckoutPlan(null)
          onClose()
        }}
      />
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#FFFDFB] border border-[#FFEAE4] rounded-[2rem] p-6 sm:p-10 shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#FFF6F3] border border-[#FFEAE4] text-[#6E554F] hover:text-[#221513] hover:bg-[#FFEAE4] flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D43E19] bg-[#FFEAE4] px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
            <Crown className="w-3.5 h-3.5 text-[#FF7654]" />
            <span>Event Passes & Storage</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#221513] tracking-tight">
            Simple, honest pricing. Pay only when you host big.
          </h2>
          <p className="text-xs sm:text-sm text-[#6E554F] mt-1.5">
            Free forever for casual outings. Upgrade only when you need massive storage for wedding & party memories.
          </p>
        </div>

        {/* 3 Tier Grid */}
        <div className="grid md:grid-cols-3 gap-5">
          {PIXLANE_PLANS.map((plan) => {
            const isSelected = currentPlan === plan.id
            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 flex flex-col justify-between transition-all ${
                  plan.highlight
                    ? 'bg-white border-2 border-[#FF7654] shadow-xl shadow-[#FF7654]/15'
                    : 'bg-[#FFF6F3]/70 border border-[#FFEAE4]'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FF7654] to-[#FFA387] text-white text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full shadow-xs">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <h3 className="font-extrabold text-lg text-[#221513]">{plan.name}</h3>
                  <p className="text-[11px] text-[#6E554F] mb-4 min-h-[32px]">
                    {plan.tagline}
                  </p>

                  <div className="mb-5 pb-5 border-b border-[#FFEAE4]">
                    <span className="text-3xl font-black text-[#221513]">{plan.price}</span>
                    <span className="text-xs text-[#6E554F] block mt-0.5">{plan.period}</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-[#6E554F] mb-6">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#FF7654] shrink-0 mt-0.5 stroke-[3]" />
                        <span className={feat.includes('UNLIMITED') ? 'font-bold text-[#221513]' : ''}>
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleChoose(plan.id as 'free' | 'pro' | 'wedding')}
                  disabled={isSelected && plan.id === 'free'}
                  className={`w-full py-3 rounded-2xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-[#FF7654] to-[#FFA387] hover:from-[#F45732] hover:to-[#FF8E72] text-white shadow-md shadow-[#FF7654]/25'
                      : isSelected && plan.id === 'free'
                      ? 'bg-white border border-[#FFEAE4] text-gray-400 cursor-default'
                      : 'bg-white hover:bg-[#FFEAE4] border border-[#FFD5C8] text-[#D43E19]'
                  }`}
                >
                  <span>{isSelected && plan.id === 'free' ? 'Active' : plan.buttonText}</span>
                  {!isSelected && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            )
          })}
        </div>

        {/* Sri Lanka Local Payment Notice */}
        <div className="mt-8 pt-6 border-t border-[#FFEAE4] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 text-xs text-[#6E554F]">
            <Shield className="w-4 h-4 text-[#FF7654]" />
            <span>Pay securely via PayHere (Visa, Mastercard, Genie, FriMi, Koko) or Sri Lankan Bank Transfer 🇱🇰</span>
          </div>

          <button
            onClick={onClose}
            className="text-xs font-bold text-[#6E554F] hover:text-[#221513] underline"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
