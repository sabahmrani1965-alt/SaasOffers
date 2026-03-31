import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { SEED_DEALS } from '@/lib/seed-data'
import { DealCard } from '@/components/offers/DealCard'
import { Deal, DealType } from '@/types'
import { Filter, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Browse SaaS Deals & Startup Credits',
  description: 'Explore exclusive SaaS deals for startups. AWS, Notion, Deel, Linear, Figma and more. Free and premium offers available.',
}

const FILTER_OPTIONS: { label: string; value: DealType | 'all' }[] = [
  { label: 'All Deals', value: 'all' },
  { label: 'Free', value: 'free' },
  { label: 'Premium', value: 'premium' },
  { label: 'Apply', value: 'apply' },
]

export default async function OffersPage({ searchParams }: { searchParams: { type?: string } }) {
  const supabase = createClient()
  const { data: dbDeals } = await supabase.from('deals').select('*').order('value', { ascending: false })
  const allDeals: Deal[] = (dbDeals && dbDeals.length > 0 ? dbDeals : SEED_DEALS) as Deal[]
  const activeFilter = (searchParams.type as DealType | 'all') || 'all'
  const filtered = activeFilter === 'all' ? allDeals : allDeals.filter(d => d.type === activeFilter)
  const totalValue = allDeals.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-10">
          <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-100 text-violet-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            <Zap className="w-3 h-3 fill-current" />
            {allDeals.length} deals available
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3 tracking-tight">All Deals</h1>
          <p className="text-gray-500 text-lg">${totalValue.toLocaleString()}+ in total value · hand-picked for startups</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 pb-20">
        {/* Filters */}
        <div className="flex items-center gap-2.5 mb-8 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mr-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </div>
          {FILTER_OPTIONS.map(opt => (
            <a
              key={opt.value}
              href={opt.value === 'all' ? '/offers' : `/offers?type=${opt.value}`}
              className={`text-sm px-4 py-2 rounded-xl border font-medium transition-all ${
                activeFilter === opt.value
                  ? 'bg-violet-600 border-violet-600 text-white shadow-sm shadow-violet-200'
                  : 'border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300 bg-white shadow-sm'
              }`}
            >
              {opt.label}
            </a>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-400">No deals found for this filter.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(deal => <DealCard key={deal.slug} deal={deal} />)}
          </div>
        )}
      </div>
    </div>
  )
}
