import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SEED_DEALS } from '@/lib/seed-data'
import { Deal } from '@/types'
import { DealBadge } from '@/components/ui/DealBadge'
import { OfferCTA } from '@/components/offers/OfferCTA'
import { DealHighlights } from '@/components/offers/DealHighlights'
import { FAQAccordion } from '@/components/offers/FAQAccordion'
import { RelatedOffers } from '@/components/offers/RelatedOffers'
import { MobileCTABar } from '@/components/offers/MobileCTABar'
import { CheckCircle2, ChevronRight, DollarSign, Zap } from 'lucide-react'
import Link from 'next/link'
import { getCategoryByDbValue } from '@/lib/categories'

interface PageProps {
  params: { slug: string }
}

async function getDeal(slug: string): Promise<Deal | null> {
  const supabase = createClient()
  const { data } = await supabase.from('deals').select('*').eq('slug', slug).single()
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
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `https://saasoffers.tech/offers/${deal.slug}` },
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

  // Parse long_description into sections
  const sections = parseSections(deal.long_description || '')

  return (
    <div className="min-h-screen bg-gray-50 pb-28 lg:pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Mobile sticky CTA */}
      <MobileCTABar deal={deal} user={user} isUnlocked={isUnlocked} />

      <div className="pt-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/offers" className="hover:text-gray-900 transition-colors font-medium">Offers</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            {deal.category && (() => {
              const cat = getCategoryByDbValue(deal.category)
              const href = cat ? `/offers/category/${cat.slug}` : `/offers?category=${deal.category}`
              return (
                <>
                  <Link href={href} className="hover:text-gray-900 transition-colors">{deal.category}</Link>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </>
              )
            })()}
            <span className="text-gray-900 font-semibold">{deal.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── MAIN CONTENT ── */}
            <div className="lg:col-span-2 space-y-5">

              {/* Hero card */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-card">
                <div className="flex items-start gap-4 mb-5">
                  {/* Logo */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0"
                    style={{ backgroundColor: deal.logo_bg || '#7C3AED' }}
                    aria-label={`${deal.name} logo`}
                  >
                    {deal.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    {/* Verified badge */}
                    <div className="inline-flex items-center gap-1.5 bg-violet-50 border border-violet-100 text-violet-600 text-xs font-semibold px-2.5 py-1 rounded-full mb-2">
                      <Zap className="w-3 h-3 fill-current" />
                      Verified by SaaSOffers
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">{deal.name}</h1>
                    {deal.category && <p className="text-sm text-gray-500 mt-0.5">{deal.category}</p>}
                  </div>
                </div>

                {/* Value + badges row */}
                <div className="flex items-center gap-3 flex-wrap mb-4">
                  <DealBadge type={deal.type} />
                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-lg">
                    <DollarSign className="w-4 h-4" />
                    {deal.value_label}
                  </div>
                </div>

                {/* Short description */}
                <p className="text-gray-600 text-sm leading-relaxed">{deal.description}</p>
              </div>

              {/* Deal Highlights */}
              <DealHighlights deal={deal} />

              {/* About / Overview */}
              {sections.overview.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-card">
                  <h2 className="text-base font-bold text-gray-900 mb-4">About this deal</h2>
                  <ContentRenderer lines={sections.overview} />
                </div>
              )}

              {/* Benefits */}
              {sections.benefits.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-card">
                  <h2 className="text-base font-bold text-gray-900 mb-4">What You Get</h2>
                  <div className="space-y-2">
                    {sections.benefits.map((b, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm leading-relaxed">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* How to Redeem */}
              {sections.steps.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-card">
                  <h2 className="text-base font-bold text-gray-900 mb-4">How to Redeem</h2>
                  <div className="space-y-3">
                    {sections.steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {deal.requirements && (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
                  <h2 className="text-gray-900 font-bold text-sm mb-2">Eligibility Requirements</h2>
                  <p className="text-gray-600 text-sm leading-relaxed">{deal.requirements}</p>
                </div>
              )}

              {/* FAQ */}
              {deal.faq && deal.faq.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                  <FAQAccordion items={deal.faq} />
                </div>
              )}

              {/* Related offers */}
              <div className="pt-2">
                <RelatedOffers currentSlug={deal.slug} category={deal.category} />
              </div>
            </div>

            {/* ── SIDEBAR ── */}
            <div className="lg:col-span-1 hidden lg:block">
              <OfferCTA
                deal={deal}
                user={user}
                isPremium={isPremium}
                isUnlocked={isUnlocked}
              />
            </div>
          </div>

          {/* Mobile CTA card (inline, above related offers) */}
          <div className="lg:hidden mt-5">
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

// ── Helpers ──────────────────────────────────────────────────

interface ParsedSections {
  overview: string[]
  benefits: string[]
  steps: string[]
  other: string[]
}

function parseSections(text: string): ParsedSections {
  const lines = text.split('\n')
  const result: ParsedSections = { overview: [], benefits: [], steps: [], other: [] }

  let currentSection: keyof ParsedSections = 'overview'
  let stepCounter = 0

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue

    // Section header detection
    if (line.startsWith('**') && line.endsWith('**')) {
      const heading = line.replace(/\*\*/g, '').toLowerCase()
      if (heading.includes('what you get') || heading.includes('includes') || heading.includes('benefit')) {
        currentSection = 'benefits'
      } else if (heading.includes('how to') || heading.includes('redeem') || heading.includes('step')) {
        currentSection = 'steps'
        stepCounter = 0
      } else {
        currentSection = 'other'
      }
      continue
    }

    // Bullet point — goes to current section or benefits
    if (line.startsWith('- ')) {
      const content = line.replace(/^- /, '')
      if (currentSection === 'steps') {
        result.steps.push(content)
      } else {
        result.benefits.push(content)
      }
      continue
    }

    // Numbered step (e.g. "1. Do this")
    const stepMatch = line.match(/^\d+\.\s+(.+)/)
    if (stepMatch) {
      result.steps.push(stepMatch[1])
      continue
    }

    // Regular paragraph
    if (currentSection === 'overview' || currentSection === 'other') {
      result.overview.push(line)
    }
  }

  return result
}

function ContentRenderer({ lines }: { lines: string[] }) {
  return (
    <div className="space-y-3">
      {lines.map((line, i) => (
        <p key={i} className="text-gray-600 text-sm leading-relaxed">{line}</p>
      ))}
    </div>
  )
}
