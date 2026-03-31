import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SEED_DEALS } from '@/lib/seed-data'
import { Deal } from '@/types'
import { DealBadge } from '@/components/ui/DealBadge'
import { OfferCTA } from '@/components/offers/OfferCTA'
import { CheckCircle2, ChevronRight, DollarSign, Clock, ExternalLink, Tag } from 'lucide-react'
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
  return (SEED_DEALS.find(d => d.slug === slug) as Deal) || null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const deal = await getDeal(params.slug)
  if (!deal) return { title: 'Offer Not Found' }
  const title = `${deal.name} — ${deal.value_label} | SaaSOffers`
  const description = deal.description
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://saasoffers.tech/offers/${deal.slug}`,
      siteName: 'SaaSOffers',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://saasoffers.tech/offers/${deal.slug}`,
    },
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

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    name: `${deal.name} — ${deal.value_label}`,
    description: deal.description,
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    url: `https://saasoffers.tech/offers/${deal.slug}`,
    seller: { '@type': 'Organization', name: 'SaaSOffers', url: 'https://saasoffers.tech' },
    ...(deal.expires_at ? { priceValidUntil: deal.expires_at.slice(0, 10) } : {}),
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 sm:px-6">
      {/* JSON-LD structured data for Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/offers" className="hover:text-gray-900 transition-colors font-medium">Offers</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-medium">{deal.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md"
                  style={{ backgroundColor: deal.logo_bg || '#7C3AED' }}
                >
                  {deal.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{deal.name}</h1>
                  {deal.category && <p className="text-sm text-gray-500 mt-0.5">{deal.category}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <DealBadge type={deal.type} />
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-lg">
                  <DollarSign className="w-4 h-4" />
                  {deal.value_label}
                </div>
                {deal.category && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                    <Tag className="w-3 h-3" />{deal.category}
                  </span>
                )}
                {deal.expires_at && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
                    <Clock className="w-3 h-3" />
                    Expires {new Date(deal.expires_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-card">
              <h2 className="text-base font-semibold text-gray-900 mb-4">About this deal</h2>
              <div className="space-y-2">
                {deal.long_description
                  ? deal.long_description.split('\n').map((para, i) => {
                      if (para.startsWith('**') && para.endsWith('**')) {
                        return <h3 key={i} className="text-gray-900 font-semibold text-sm mt-5 mb-2">{para.replace(/\*\*/g, '')}</h3>
                      }
                      if (para.startsWith('- ')) {
                        return (
                          <div key={i} className="flex items-start gap-2.5 py-0.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-sm leading-relaxed">{para.replace(/^- /, '')}</span>
                          </div>
                        )
                      }
                      if (!para.trim()) return <div key={i} className="h-2" />
                      return <p key={i} className="text-gray-600 text-sm leading-relaxed">{para}</p>
                    })
                  : <p className="text-gray-600 text-sm leading-relaxed">{deal.description}</p>
                }
              </div>
            </div>

            {/* Requirements */}
            {deal.requirements && (
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
                <h3 className="text-gray-900 font-semibold text-sm mb-2">Requirements</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{deal.requirements}</p>
              </div>
            )}

            {/* FAQ */}
            {deal.faq && deal.faq.length > 0 && (
              <div>
                <h2 className="text-gray-900 font-semibold text-lg mb-4">Frequently Asked Questions</h2>
                <div className="space-y-3">
                  {deal.faq.map((item, i) => (
                    <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 shadow-card">
                      <h3 className="text-gray-900 font-semibold text-sm mb-2">{item.question}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.answer}</p>
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
