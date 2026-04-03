import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowRight, ArrowLeftRight, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Compare SaaS Tools — Side by Side for Startups',
  description: 'Compare SaaS tools side by side — features, pricing, startup deals, and which one is right for your startup. Unbiased comparisons backed by real data.',
  alternates: { canonical: 'https://saasoffers.tech/compare' },
}

interface Comparison {
  id: string
  deal_a_slug: string
  deal_b_slug: string
  label: string
  category: string
  featured: boolean
  sort_order: number
}

export default async function ComparePage() {
  const supabase = createClient()
  const { data: comparisons } = await supabase
    .from('comparisons')
    .select('*')
    .order('category')
    .order('sort_order')

  const items: Comparison[] = comparisons ?? []

  // Group by category
  const grouped = items.reduce<Record<string, Comparison[]>>((acc, c) => {
    if (!acc[c.category]) acc[c.category] = []
    acc[c.category].push(c)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">

        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-100 text-violet-700 text-xs font-semibold px-4 py-2 rounded-full mb-6">
            <ArrowLeftRight className="w-3.5 h-3.5" />
            {items.length} side-by-side comparisons
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            Compare SaaS tools for startups
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Unbiased, side-by-side comparisons of the best SaaS tools — features, pricing, startup deals, and which one fits your stack in 2026.
          </p>
        </div>

        {/* Comparison categories */}
        {Object.entries(grouped).map(([category, catComparisons]) => (
          <div key={category} className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{category}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {catComparisons.map(c => (
                <Link
                  key={c.id}
                  href={`/compare/${c.deal_a_slug}-vs-${c.deal_b_slug}`}
                  className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-5 py-4 shadow-sm hover:shadow-md hover:border-violet-200 transition-all group"
                >
                  <ArrowLeftRight className="w-4 h-4 text-violet-400 flex-shrink-0 group-hover:text-violet-600 transition-colors" />
                  <span className="text-sm font-semibold text-gray-800 group-hover:text-violet-700 transition-colors flex-1">{c.label}</span>
                  {c.featured && (
                    <span className="text-[9px] font-bold bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded-full">TOP</span>
                  )}
                  <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-violet-500 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-16">
            <ArrowLeftRight className="w-10 h-10 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No comparisons available yet.</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-14 bg-gradient-to-br from-violet-600 to-pink-500 rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Can&apos;t find your comparison?</h2>
          <p className="text-white/80 mb-6">Browse all 199+ deals and find the right tools for your startup.</p>
          <Link
            href="/offers"
            className="inline-flex items-center gap-2 bg-white text-violet-600 font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm"
          >
            <Zap className="w-4 h-4" fill="currentColor" />
            Browse all deals <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
