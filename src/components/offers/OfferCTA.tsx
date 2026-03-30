'use client'

import { useState } from 'react'
import { Deal } from '@/types'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { DollarSign, Lock, CheckCircle2, ArrowRight, FileText } from 'lucide-react'
import { trackEvent } from '@/components/Analytics'

interface OfferCTAProps {
  deal: Deal
  user: User | null
  isPremium: boolean
  isUnlocked: boolean
}

export function OfferCTA({ deal, user, isPremium, isUnlocked: initialUnlocked }: OfferCTAProps) {
  const [isUnlocked, setIsUnlocked] = useState(initialUnlocked)
  const [loading, setLoading] = useState(false)
  const [applied, setApplied] = useState(false)
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

  const handleApply = () => {
    setApplied(true)
    trackEvent('apply_offer', 'offers', deal.slug)
  }

  return (
    <div className="sticky top-24 bg-surface-50 border border-white/5 rounded-2xl p-6 space-y-5">
      {/* Value */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-400">Deal value</span>
        <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xl">
          <DollarSign className="w-5 h-5" />
          {deal.value_label}
        </div>
      </div>

      <div className="h-px bg-white/5" />

      {/* Unlocked state */}
      {isUnlocked && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <p className="text-white font-semibold text-sm">Offer Unlocked!</p>
          <p className="text-zinc-400 text-xs mt-1">Check your dashboard to access your deal details.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 mt-3 text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
          >
            Go to Dashboard <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* Applied state */}
      {applied && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-center">
          <FileText className="w-8 h-8 text-amber-400 mx-auto mb-2" />
          <p className="text-white font-semibold text-sm">Application Submitted</p>
          <p className="text-zinc-400 text-xs mt-1">We'll review your request and get back to you within 48 hours.</p>
        </div>
      )}

      {/* CTA logic */}
      {!isUnlocked && !applied && (
        <>
          {/* Not logged in */}
          {!user && (
            <div className="space-y-3">
              <Link
                href={`/signup?redirect=/offers/${deal.slug}`}
                className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-accent-600 text-white font-semibold py-3 rounded-xl transition-all text-sm shadow-lg shadow-accent/20"
              >
                Sign up to unlock
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-center text-xs text-zinc-500">
                Already have an account?{' '}
                <Link href={`/login?redirect=/offers/${deal.slug}`} className="text-accent-300 hover:underline">Log in</Link>
              </p>
            </div>
          )}

          {/* Free deal — any logged-in user */}
          {user && deal.type === 'free' && (
            <Button
              onClick={handleUnlock}
              loading={loading}
              className="w-full justify-center"
              size="lg"
            >
              Unlock Offer
            </Button>
          )}

          {/* Premium deal — not subscribed */}
          {user && deal.type === 'premium' && !isPremium && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-zinc-400 bg-surface-200 rounded-lg px-3 py-2">
                <Lock className="w-3.5 h-3.5 text-accent-300 flex-shrink-0" />
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
              <p className="text-center text-xs text-zinc-500">$79/year — unlimited deals</p>
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
              <div className="flex items-center gap-2 text-xs text-zinc-400 bg-surface-200 rounded-lg px-3 py-2">
                <FileText className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                This deal requires manual review before approval.
              </div>
              <Button
                onClick={handleApply}
                loading={loading}
                className="w-full justify-center bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/20 shadow-none"
                size="lg"
              >
                Apply for Access
              </Button>
            </div>
          )}
        </>
      )}

      {error && (
        <p className="text-xs text-red-400 text-center">{error}</p>
      )}

      {/* Trust signals */}
      <div className="pt-2 border-t border-white/5 space-y-2">
        {['Verified deal', 'No spam, ever', 'Instant unlock'].map(item => (
          <div key={item} className="flex items-center gap-2 text-xs text-zinc-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/70" />
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
