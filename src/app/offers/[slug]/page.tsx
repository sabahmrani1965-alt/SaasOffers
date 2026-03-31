import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SEED_DEALS } from '@/lib/seed-data'
import { Deal } from '@/types'
import { DealBadge } from '@/components/ui/DealBadge'
import { DealLogo } from '@/components/ui/DealLogo'
import { OfferCTA } from '@/components/offers/OfferCTA'
import { DealHighlights } from '@/components/offers/DealHighlights'
import { FAQAccordion } from '@/components/offers/FAQAccordion'
import { RelatedOffers } from '@/components/offers/RelatedOffers'
import { MobileCTABar } from '@/components/offers/MobileCTABar'
import { CheckCircle2, ChevronRight, DollarSign, Zap, ArrowRight, Building2, Rocket, Users } from 'lucide-react'
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

  // Keyword-rich title ≤ 60 chars
  const title = `${deal.name} — ${deal.value_label} Startup Deal | SaaSOffers`
  // High-CTR description ≤ 155 chars
  const description = `Get ${deal.value_label} off ${deal.name} exclusively for startups. ${deal.description.slice(0, 100)}${deal.description.length > 100 ? '…' : ''}`

  return {
    title,
    description,
    keywords: [`${deal.name} startup deal`, `${deal.name} discount`, 'SaaS startup perks', 'startup credits', `${deal.category || 'SaaS'} deals`],
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

  // JSON-LD: Offer schema + FAQ schema
  const offerJsonLd = {
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

  const faqJsonLd = deal.faq && deal.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: deal.faq.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  } : null

  const sections = parseSections(deal.long_description || '')
  const cat = deal.category ? getCategoryByDbValue(deal.category) : null

  return (
    <div className="min-h-screen bg-gray-50 pb-28 lg:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offerJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}

      {/* Mobile sticky CTA */}
      <MobileCTABar deal={deal} user={user} isUnlocked={isUnlocked} />

      {/* ── HERO ── */}
      <div className="bg-white border-b border-gray-100 pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link href="/offers" className="hover:text-gray-900 transition-colors font-medium">Offers</Link>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            {deal.category && (
              <>
                <Link href={cat ? `/offers/category/${cat.slug}` : `/offers?category=${deal.category}`} className="hover:text-gray-900 transition-colors">
                  {deal.category}
                </Link>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </>
            )}
            <span className="text-gray-900 font-semibold truncate">{deal.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

            {/* Left: Hero content */}
            <div className="lg:col-span-2">
              {/* Logo + verified */}
              <div className="flex items-center gap-4 mb-6">
                <DealLogo name={deal.name} logo_url={deal.logo_url} logo_bg={deal.logo_bg} size="xl" />
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-violet-50 border border-violet-100 text-violet-600 text-xs font-semibold px-2.5 py-1 rounded-full mb-1.5">
                    <Zap className="w-3 h-3 fill-current" /> Verified by SaaSOffers
                  </div>
                  <div className="flex items-center gap-2">
                    <DealBadge type={deal.type} />
                    {deal.category && <span className="text-xs text-gray-400 font-medium">{deal.category}</span>}
                  </div>
                </div>
              </div>

              {/* H1 — keyword-rich */}
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-3">
                {deal.name} — {deal.value_label} for Startups
              </h1>

              {/* Deal value pill */}
              <div className="flex items-center gap-2 mb-4">
                <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-base px-4 py-1.5 rounded-full">
                  <DollarSign className="w-4 h-4" />{deal.value_label}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-lg leading-relaxed max-w-xl mb-6">
                {deal.description}
              </p>

              {/* Trust row */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                {[
                  '✓ Verified deal',
                  '✓ No spam, ever',
                  '✓ 2,000+ startups trust SaaSOffers',
                ].map(t => <span key={t} className="font-medium">{t}</span>)}
              </div>
            </div>

            {/* Right: Sidebar CTA (desktop) */}
            <div className="hidden lg:block lg:col-span-1">
              <OfferCTA deal={deal} user={user} isPremium={isPremium} isUnlocked={isUnlocked} />
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ── MAIN CONTENT col ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Highlights */}
            <DealHighlights deal={deal} />

            {/* About */}
            {sections.overview.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About {deal.name}</h2>
                <div className="space-y-3">
                  {sections.overview.map((line, i) => (
                    <p key={i} className="text-gray-600 text-base leading-7">{line}</p>
                  ))}
                </div>
              </div>
            )}

            {/* What You Get */}
            {sections.benefits.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-5">What's Included</h2>
                <div className="space-y-3">
                  {sections.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <span className="text-gray-700 text-base leading-relaxed">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* How to Claim */}
            {sections.steps.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-2">How to Claim This Deal</h2>
                <p className="text-gray-500 text-sm mb-6">3 simple steps — takes less than 2 minutes</p>
                <div className="space-y-5">
                  {sections.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-xl bg-violet-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 pt-0.5">
                        <p className="text-gray-800 text-base font-medium leading-relaxed">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Who is this for */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Who Is This Deal For?</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { icon: Rocket, title: 'Early-Stage Startups', desc: 'Seed and pre-seed companies looking to move fast without overspending on tools.' },
                  { icon: Building2, title: 'Growing SaaS Teams', desc: 'Series A+ companies scaling their stack and optimizing software costs.' },
                  { icon: Users, title: 'Solo Founders', desc: 'Indie hackers and bootstrapped founders who need enterprise tools at startup prices.' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                    <div className="w-9 h-9 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center mb-3">
                      <Icon className="w-4 h-4 text-violet-600" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">{title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mid-page CTA */}
            <div className="bg-gradient-to-r from-violet-600 to-pink-500 rounded-2xl p-7 flex flex-col sm:flex-row items-center justify-between gap-5">
              <div>
                <p className="text-white font-bold text-lg mb-1">
                  Get {deal.value_label} off {deal.name}
                </p>
                <p className="text-white/75 text-sm">
                  {deal.type === 'free' ? 'Free for all startups — claim instantly.' : deal.type === 'apply' ? 'Apply now — reviewed within 48 hours.' : 'Premium deal — upgrade once, unlock everything.'}
                </p>
              </div>
              <Link
                href={user ? '#offer-cta' : `/signup?redirect=/offers/${deal.slug}`}
                className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-violet-600 font-bold px-6 py-3 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-sm whitespace-nowrap"
              >
                {user ? 'Claim Deal' : 'Sign Up & Claim'} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Requirements */}
            {deal.requirements && (
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
                <h2 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-700 text-xs font-bold flex items-center justify-center">!</span>
                  Eligibility Requirements
                </h2>
                <p className="text-gray-700 text-sm leading-relaxed">{deal.requirements}</p>
              </div>
            )}

            {/* FAQ */}
            {deal.faq && deal.faq.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
                <p className="text-gray-500 text-sm mb-6">Everything you need to know about this startup deal.</p>
                <FAQAccordion items={deal.faq} />
              </div>
            )}

            {/* Related */}
            <div>
              <RelatedOffers currentSlug={deal.slug} category={deal.category} />
            </div>
          </div>

          {/* ── SIDEBAR (desktop) ── */}
          <div className="hidden lg:block lg:col-span-1 space-y-5">
            <OfferCTA deal={deal} user={user} isPremium={isPremium} isUnlocked={isUnlocked} />

            {/* Quick summary card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-900">Deal Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Value</span>
                  <span className="font-bold text-emerald-600">{deal.value_label}</span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-50 pt-3">
                  <span className="text-gray-500">Access</span>
                  <span className="font-semibold text-gray-800 capitalize">{deal.type}</span>
                </div>
                {deal.category && (
                  <div className="flex justify-between items-center border-t border-gray-50 pt-3">
                    <span className="text-gray-500">Category</span>
                    <span className="font-semibold text-gray-800">{deal.category}</span>
                  </div>
                )}
                {deal.expires_at && (
                  <div className="flex justify-between items-center border-t border-gray-50 pt-3">
                    <span className="text-gray-500">Expires</span>
                    <span className="font-semibold text-red-500 text-xs">
                      {new Date(deal.expires_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Browse more */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 font-medium mb-3">Looking for more startup deals?</p>
              <Link href="/offers" className="inline-flex items-center gap-1.5 text-violet-600 text-sm font-semibold hover:underline">
                Browse all offers <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile CTA ── */}
      <div className="lg:hidden px-4 pb-10">
        <OfferCTA deal={deal} user={user} isPremium={isPremium} isUnlocked={isUnlocked} />
      </div>
    </div>
  )
}

// ── Helpers ──────────────────────────────────────────────────────────────────

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

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue

    if (line.startsWith('**') && line.endsWith('**')) {
      const heading = line.replace(/\*\*/g, '').toLowerCase()
      if (heading.includes('what you get') || heading.includes('includes') || heading.includes('benefit')) {
        currentSection = 'benefits'
      } else if (heading.includes('how to') || heading.includes('redeem') || heading.includes('step')) {
        currentSection = 'steps'
      } else {
        currentSection = 'other'
      }
      continue
    }

    if (line.startsWith('- ')) {
      const content = line.replace(/^- /, '')
      currentSection === 'steps' ? result.steps.push(content) : result.benefits.push(content)
      continue
    }

    const stepMatch = line.match(/^\d+\.\s+(.+)/)
    if (stepMatch) { result.steps.push(stepMatch[1]); continue }

    if (currentSection === 'overview' || currentSection === 'other') {
      result.overview.push(line)
    }
  }

  return result
}
