'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, DollarSign } from 'lucide-react'
import { Deal } from '@/types'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'

interface MobileCTABarProps {
  deal: Deal
  user: User | null
  isUnlocked: boolean
  isPremium: boolean
}

export function MobileCTABar({ deal, user, isUnlocked, isPremium }: MobileCTABarProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  if (!visible) return null

  const handleCheckout = async () => {
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const { url, error } = await res.json()
      if (error) throw new Error(error)
      if (url) window.location.href = url
    } catch (e) {
      console.error('Checkout error:', e)
    }
  }

  // Free: direct access, no auth needed
  // Apply: requires auth
  // Premium: requires auth + paid status

  let label: string
  let action: (() => void) | null = null
  let href: string | null = null

  if (isUnlocked) {
    label = 'View in Dashboard'
    href = '/dashboard'
  } else if (deal.type === 'free') {
    // Free: no auth required, scroll to CTA to unlock
    if (!user) {
      label = `Get ${deal.name}`
      href = `/signup?redirect=/offers/${deal.slug}`
    } else {
      label = `Get ${deal.name}`
      action = () => document.getElementById('offer-cta')?.scrollIntoView({ behavior: 'smooth' })
    }
  } else if (deal.type === 'apply') {
    // Apply: requires auth
    if (!user) {
      label = 'Sign up to apply'
      href = `/signup?redirect=/offers/${deal.slug}`
    } else {
      label = `Apply for ${deal.name}`
      action = () => document.getElementById('offer-cta')?.scrollIntoView({ behavior: 'smooth' })
    }
  } else {
    // Premium: requires auth + paid
    if (!user) {
      label = 'Sign up to unlock'
      href = `/signup?redirect=/offers/${deal.slug}`
    } else if (!isPremium) {
      label = 'Upgrade to Premium'
      action = handleCheckout
    } else {
      label = `Unlock ${deal.name}`
      action = () => document.getElementById('offer-cta')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const btnClass = "flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-pink-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-violet-200 flex-shrink-0"

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-lg px-4 py-3 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-700 font-medium">Deal value</div>
        <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm">
          <DollarSign className="w-3.5 h-3.5" />
          {deal.value_label}
        </div>
      </div>
      {href ? (
        <Link href={href} className={btnClass}>
          {label} <ArrowRight className="w-4 h-4" />
        </Link>
      ) : (
        <button onClick={action!} className={btnClass}>
          {label} <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
