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
    <div id="offer-cta" className="sticky top-24 bg-white border border-gray-100 rounded-2xl p-7 space-y-6 shadow-md">
      {/* Value */}
      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Deal value</span>
        <div className="flex items-start gap-1.5 text-emerald-600 font-bold text-lg leading-tight">
          <DollarSign className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{deal.value_label}</span>
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Unlocked state */}
      {isUnlocked && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <p className="text-gray-900 font-semibold text-sm">Offer Unlocked!</p>
          <p className="text-gray-700 text-xs mt-1">Check your dashboard to access your deal details.</p>
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
          {/* ── FREE: direct access, no auth required ── */}
          {deal.type === 'free' && (
            user ? (
              <Button
                onClick={handleUnlock}
                loading={loading}
                className="w-full justify-center"
                size="lg"
              >
                <Zap className="w-4 h-4 mr-1" fill="white" /> Unlock Free Deal
              </Button>
            ) : (
              <div className="space-y-3">
                <Link
                  href={deal.affiliate_link || `/signup?redirect=/offers/${deal.slug}`}
                  target={deal.affiliate_link ? '_blank' : undefined}
                  rel={deal.affiliate_link ? 'noopener noreferrer' : undefined}
                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 text-white font-semibold py-3 rounded-xl transition-all text-sm shadow-md shadow-violet-200"
                  onClick={() => trackEvent('offer_cta_click', 'offers', deal.slug)}
                >
                  <Zap className="w-4 h-4" fill="white" /> Get Free Deal
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-center text-xs text-gray-700">
                  Free · No account required.{' '}
                  <Link href={`/signup?redirect=/offers/${deal.slug}`} className="text-violet-600 font-semibold hover:underline">Sign up</Link> to track your deals.
                </p>
              </div>
            )
          )}

          {/* ── APPLY: requires auth ── */}
          {deal.type === 'apply' && (
            !user ? (
              <div className="space-y-3">
                <Link
                  href={`/signup?redirect=/offers/${deal.slug}`}
                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 text-white font-semibold py-3 rounded-xl transition-all text-sm shadow-md shadow-violet-200"
                  onClick={() => trackEvent('offer_cta_click', 'offers', deal.slug)}
                >
                  Sign up to apply
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-center text-xs text-gray-700">
                  Already have an account?{' '}
                  <Link href={`/login?redirect=/offers/${deal.slug}`} className="text-violet-600 font-semibold hover:underline">Log in</Link>
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-700 font-medium bg-amber-50 border border-amber-100 rounded-lg px-3 py-2.5">
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
            )
          )}

          {/* ── PREMIUM: requires auth + paid status ── */}
          {deal.type === 'premium' && (
            !user ? (
              <div className="space-y-3">
                <Link
                  href={`/signup?redirect=/offers/${deal.slug}`}
                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 text-white font-semibold py-3 rounded-xl transition-all text-sm shadow-md shadow-violet-200"
                  onClick={() => trackEvent('offer_cta_click', 'offers', deal.slug)}
                >
                  Sign up to unlock
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-center text-xs text-gray-700">
                  Already have an account?{' '}
                  <Link href={`/login?redirect=/offers/${deal.slug}`} className="text-violet-600 font-semibold hover:underline">Log in</Link>
                </p>
              </div>
            ) : !isPremium ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-700 font-medium bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
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
                <p className="text-center text-xs text-gray-700 font-medium">$79/year — unlimited deals</p>
              </div>
            ) : (
              <Button
                onClick={handleUnlock}
                loading={loading}
                className="w-full justify-center"
                size="lg"
              >
                Unlock Offer
              </Button>
            )
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
          <div key={text} className="flex items-center gap-2 text-xs text-gray-700 font-medium">
            <Icon className="w-3.5 h-3.5 text-emerald-500" />
            {text}
          </div>
        ))}
      </div>
    </div>
  )
}
