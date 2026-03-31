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
}

export function MobileCTABar({ deal, user, isUnlocked }: MobileCTABarProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  if (!visible) return null

  const href = !user
    ? `/signup?redirect=/offers/${deal.slug}`
    : deal.type === 'premium'
    ? '/api/stripe/checkout'
    : null

  const label = isUnlocked
    ? 'View in Dashboard'
    : !user
    ? 'Sign up to unlock'
    : deal.type === 'apply'
    ? `Apply for ${deal.name}`
    : `Get ${deal.name}`

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
        <Link
          href={href}
          className="flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-pink-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-violet-200 flex-shrink-0"
        >
          {label} <ArrowRight className="w-4 h-4" />
        </Link>
      ) : (
        <button
          onClick={() => document.getElementById('offer-cta')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-pink-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-violet-200 flex-shrink-0"
        >
          {label} <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
