import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { SEED_DEALS } from '@/lib/seed-data'
import { DealCard } from '@/components/offers/DealCard'
import { Deal, DealType } from '@/types'
import { Filter } from 'lucide-react'

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

export default async function OffersPage({
  searchParams,
}: {
  searchParams: { type?: string }
}) {
  const supabase = createClient()
  const { data: dbDeals } = await supabase
    .from('deals')
    .select('*')
    .order('value', { ascending: false })

  const allDeals: Deal[] = (dbDeals && dbDeals.length > 0 ? dbDeals : SEED_DEALS) as Deal[]
  const activeFilter = (searchParams.type as DealType | 'all') || 'all'
  const filtered = activeFilter === 'all' ? allDeals : allDeals.filter(d => d.type === activeFilter)

  const totalValue = allDeals.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display text-4xl sm:text-5xl text-white mb-3">
            All Deals
          </h1>
          <p className="text-zinc-400 text-lg">
            {allDeals.length} exclusive offers · $
            {totalValue.toLocaleString()}+ in total value
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 mr-2">
            <Filter className="w-3.5 h-3.5" />
            Filter:
          </div>
          {FILTER_OPTIONS.map(opt => (
            <a
              key={opt.value}
              href={opt.value === 'all' ? '/offers' : `/offers?type=${opt.value}`}
              className={`text-sm px-4 py-1.5 rounded-full border transition-all ${
                activeFilter === opt.value
                  ? 'bg-accent/10 border-accent/30 text-accent-300'
                  : 'border-white/5 text-zinc-400 hover:text-white hover:border-white/10 bg-surface-50'
              }`}
            >
              {opt.label}
            </a>
          ))}
        </div>

        {/* Deals Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-zinc-500">
            No deals found for this filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(deal => (
              <DealCard key={deal.slug} deal={deal} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
