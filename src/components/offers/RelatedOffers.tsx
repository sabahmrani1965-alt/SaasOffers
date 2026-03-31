import { createClient } from '@/lib/supabase/server'
import { SEED_DEALS } from '@/lib/seed-data'
import { Deal } from '@/types'
import { DealCard } from '@/components/offers/DealCard'

interface RelatedOffersProps {
  currentSlug: string
  category?: string
}

export async function RelatedOffers({ currentSlug, category }: RelatedOffersProps) {
  const supabase = createClient()

  let query = supabase
    .from('deals')
    .select('*')
    .neq('slug', currentSlug)
    .limit(3)

  if (category) query = query.eq('category', category)

  const { data } = await query
  let related: Deal[] = (data && data.length > 0 ? data : SEED_DEALS.filter(d => d.slug !== currentSlug).slice(0, 3)) as Deal[]

  // If not enough in category, fill with others
  if (related.length < 3) {
    const { data: extras } = await supabase
      .from('deals')
      .select('*')
      .neq('slug', currentSlug)
      .not('slug', 'in', `(${related.map(d => d.slug).join(',')})`)
      .limit(3 - related.length)
    if (extras) related = [...related, ...extras as Deal[]]
  }

  if (related.length === 0) return null

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Related Offers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {related.map(deal => (
          <DealCard key={deal.slug} deal={deal} />
        ))}
      </div>
    </div>
  )
}
