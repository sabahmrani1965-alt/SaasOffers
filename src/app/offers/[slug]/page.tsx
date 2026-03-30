import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SEED_DEALS } from '@/lib/seed-data'
import { Deal } from '@/types'
import { DealBadge } from '@/components/ui/DealBadge'
import { OfferCTA } from '@/components/offers/OfferCTA'
import { CheckCircle2, ChevronRight, DollarSign } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  params: { slug: string }
}

async function getDeal(slug: string): Promise<Deal | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('deals')
    .select('*')
    .eq('slug', slug)
    .single()

  if (data) return data as Deal
  // Fallback to seed
  return (SEED_DEALS.find(d => d.slug === slug) as Deal) || null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const deal = await getDeal(params.slug)
  if (!deal) return { title: 'Offer Not Found' }
  return {
    title: `${deal.name} — ${deal.value_label}`,
    description: deal.description,
  }
}

export default async function OfferPage({ params }: PageProps) {
  const deal = await getDeal(params.slug)
  if (!deal) notFound()

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isPremium = false
  let isUnlocked = false

  if (user) {
    const [{ data: profile }, { data: unlocked }] = await Promise.all([
      supabase.from('users').select('is_premium').eq('id', user.id).single(),
      supabase.from('unlocked_deals').select('*').eq('user_id', user.id).eq('deal_id', deal.id).single(),
    ])
    isPremium = profile?.is_premium ?? false
    isUnlocked = !!unlocked
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
          <Link href="/offers" className="hover:text-white transition-colors">Offers</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-zinc-300">{deal.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-xl"
                  style={{ backgroundColor: deal.logo_bg || '#6366f1' }}
                >
                  {deal.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{deal.name}</h1>
                  {deal.category && <p className="text-sm text-zinc-500">{deal.category}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <DealBadge type={deal.type} />
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <DollarSign className="w-4 h-4" />
                  {deal.value_label}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-surface-50 border border-white/5 rounded-2xl p-6">
              <div className="prose prose-sm max-w-none">
                {deal.long_description
                  ? deal.long_description.split('\n').map((para, i) => {
                      if (para.startsWith('**') && para.endsWith('**')) {
                        return <h3 key={i} className="text-white font-semibold text-base mt-4 mb-2">{para.replace(/\*\*/g, '')}</h3>
                      }
                      if (para.startsWith('- ')) {
                        return (
                          <div key={i} className="flex items-start gap-2 mb-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span className="text-zinc-300 text-sm">{para.replace(/^- /, '')}</span>
                          </div>
                        )
                      }
                      if (!para.trim()) return <br key={i} />
                      return <p key={i} className="text-zinc-400 text-sm leading-relaxed">{para}</p>
                    })
                  : <p className="text-zinc-400">{deal.description}</p>
                }
              </div>
            </div>

            {/* Requirements */}
            {deal.requirements && (
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-6">
                <h3 className="text-white font-semibold text-sm mb-2">Requirements</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{deal.requirements}</p>
              </div>
            )}

            {/* FAQ */}
            {deal.faq && deal.faq.length > 0 && (
              <div>
                <h2 className="text-white font-semibold text-lg mb-4">Frequently Asked Questions</h2>
                <div className="space-y-3">
                  {deal.faq.map((item, i) => (
                    <div key={i} className="bg-surface-50 border border-white/5 rounded-xl p-5">
                      <h3 className="text-white font-medium text-sm mb-2">{item.question}</h3>
                      <p className="text-zinc-400 text-sm leading-relaxed">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar CTA */}
          <div className="lg:col-span-1">
            <OfferCTA
              deal={deal}
              user={user}
              isPremium={isPremium}
              isUnlocked={isUnlocked}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
