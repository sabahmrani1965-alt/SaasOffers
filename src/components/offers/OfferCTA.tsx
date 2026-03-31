'use client'

import { useState } from 'react'
import { Deal } from '@/types'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { DollarSign, Lock, CheckCircle2, ArrowRight, FileText, Shield, Zap } from 'lucide-react'
import { trackEvent } from '@/components/Analytics'
import { ApplyForm } from '@/components/offers/ApplyForm'

interface OfferCTAProps {
  deal: Deal
  user: User | null
  isPremium: boolean
  isUnlocked: boolean
}

export function OfferCTA({ deal, user, isPremium, isUnlocked: initialUnlocked }: OfferCTAProps) {
  const [isUnlocked, setIsUnlocked] = useState(initialUnlocked)
  const [loading, setLoading] = useState(false)
  const [showApplyForm, setShowApplyForm] = useState(false)
  const [error, setError] = useState('')

  const handleUnlock = async () => {
    if (!user) return
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const { error: err } = await supabase
        .from('unlocked_deals')
        .insert({ user_id: user.id, deal_id: deal.id })
      if (err) throw err
      setIsUnlocked(true)
      trackEvent('unlock_offer', 'offers', deal.slug, deal.value)
    } catch (e: any) {
      setError(e.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const { url, error: err } = await res.json()
      if (err) throw new Error(err)
      trackEvent('begin_checkout', 'payments', 'premium_yearly')
      window.location.href = url
    } catch (e: any) {
      setError(e.message || 'Failed to start checkout.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div id="offer-cta" className="sticky top-24 bg-white border border-gray-100 rounded-2xl p-6 space-y-5 shadow-card">
      {/* Value */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500 font-medium">Deal value</span>
        <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xl">
          <DollarSign className="w-5 h-5" />
          {deal.value_label}
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Unlocked state */}
      {isUnlocked && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <p className="text-gray-900 font-semibold text-sm">Offer Unlocked!</p>
          <p className="text-gray-500 text-xs mt-1">Check your dashboard to access your deal details.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 mt-3 text-xs text-emerald-600 hover:text-emerald-700 transition-colors font-semibold"
          >
            Go to Dashboard <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* Apply form (inline) */}
      {showApplyForm && user && !isUnlocked && (
        <ApplyForm deal={deal} user={user} />
      )}

      {/* CTA logic */}
      {!isUnlocked && !showApplyForm && (
        <>
          {/* Not logged in */}
          {!user && (
            <div className="space-y-3">
              <Link
                href={`/signup?redirect=/offers/${deal.slug}`}
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 text-white font-semibold py-3 rounded-xl transition-all text-sm shadow-md shadow-violet-200"
                onClick={() => trackEvent('offer_cta_click', 'offers', deal.slug)}
              >
                Sign up to unlock
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-center text-xs text-gray-500">
                Already have an account?{' '}
                <Link href={`/login?redirect=/offers/${deal.slug}`} className="text-violet-600 font-semibold hover:underline">Log in</Link>
              </p>
            </div>
          )}

          {/* Free deal */}
          {user && deal.type === 'free' && (
            <Button
              onClick={handleUnlock}
              loading={loading}
              className="w-full justify-center"
              size="lg"
            >
              <Zap className="w-4 h-4 mr-1" fill="white" /> Unlock Free Deal
            </Button>
          )}

          {/* Premium deal — not subscribed */}
          {user && deal.type === 'premium' && !isPremium && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-gray-600 font-medium bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
                <Lock className="w-3.5 h-3.5 text-violet-500 flex-shrink-0" />
                This is a Premium deal. Upgrade to unlock.
              </div>
              <Button
                onClick={handleCheckout}
                loading={loading}
                className="w-full justify-center"
                size="lg"
              >
                Upgrade to Premium
              </Button>
              <p className="text-center text-xs text-gray-500 font-medium">$79/year — unlimited deals</p>
            </div>
          )}

          {/* Premium deal — subscribed */}
          {user && deal.type === 'premium' && isPremium && (
            <Button
              onClick={handleUnlock}
              loading={loading}
              className="w-full justify-center"
              size="lg"
            >
              Unlock Offer
            </Button>
          )}

          {/* Apply deal */}
          {user && deal.type === 'apply' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-gray-600 font-medium bg-amber-50 border border-amber-100 rounded-lg px-3 py-2.5">
                <FileText className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                This deal requires a short application — reviewed within 48h.
              </div>
              <button
                onClick={() => {
                  setShowApplyForm(true)
                  trackEvent('offer_cta_click', 'offers', deal.slug)
                }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 text-white font-semibold py-3 rounded-xl transition-all text-sm shadow-md shadow-violet-200"
              >
                Apply for {deal.name} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {error && (
        <p className="text-xs text-red-500 font-medium text-center">{error}</p>
      )}

      {/* Trust signals */}
      <div className="pt-2 border-t border-gray-100 space-y-2">
        {[
          { icon: CheckCircle2, text: 'Verified deal' },
          { icon: Shield, text: 'No spam, ever' },
          { icon: Zap, text: 'Fast approval' },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <Icon className="w-3.5 h-3.5 text-emerald-500" />
            {text}
          </div>
        ))}
      </div>
    </div>
  )
}
