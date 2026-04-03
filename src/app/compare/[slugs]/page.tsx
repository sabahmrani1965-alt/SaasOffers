import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Deal } from '@/types'
import { ArrowLeftRight, CheckCircle2, DollarSign, Zap, ArrowRight, ChevronRight, Users, Clock, Shield } from 'lucide-react'
import { MarkdownContent } from '@/components/offers/MarkdownContent'

interface PageProps {
  params: { slugs: string }
}

async function getDeals(slugA: string, slugB: string): Promise<[Deal | null, Deal | null]> {
  const supabase = createClient()
  const [{ data: a }, { data: b }] = await Promise.all([
    supabase.from('deals').select('*').eq('slug', slugA).single(),
    supabase.from('deals').select('*').eq('slug', slugB).single(),
  ])
  return [a as Deal | null, b as Deal | null]
}

function parseSlugs(slugs: string): [string, string] | null {
  const match = slugs.match(/^(.+)-vs-(.+)$/)
  if (!match) return null
  return [match[1], match[2]]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const parsed = parseSlugs(params.slugs)
  if (!parsed) return { title: 'Compare Tools' }
  const [dealA, dealB] = await getDeals(parsed[0], parsed[1])
  if (!dealA || !dealB) return { title: 'Compare Tools' }

  const title = `${dealA.name} vs ${dealB.name} for Startups (2026 Comparison) | SaaSOffers`
  const description = `${dealA.name} offers ${dealA.value_label}. ${dealB.name} offers ${dealB.value_label}. Compare features, pricing, startup deals, and find which one is right for your startup in 2026.`

  return {
    title,
    description,
    keywords: [`${dealA.name} vs ${dealB.name}`, `${dealA.name} alternative`, `${dealB.name} alternative`, 'startup tools comparison', `best ${dealA.category?.toLowerCase() || 'SaaS'} for startups 2026`],
    openGraph: { title, description, type: 'article', url: `https://saasoffers.tech/compare/${params.slugs}` },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `https://saasoffers.tech/compare/${params.slugs}` },
  }
}

function FeatureRow({ label, a, b }: { label: string; a: React.ReactNode; b: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-4 py-4 border-b border-gray-50 last:border-0">
      <div className="text-sm font-medium text-gray-600">{label}</div>
      <div className="text-sm text-gray-900 font-medium">{a}</div>
      <div className="text-sm text-gray-900 font-medium">{b}</div>
    </div>
  )
}

function DealTypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    free: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    premium: 'bg-violet-50 text-violet-700 border-violet-200',
    apply: 'bg-amber-50 text-amber-700 border-amber-200',
  }
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${styles[type] || styles.apply}`}>
      {type}
    </span>
  )
}

// Extract first 2-3 meaningful paragraphs from long_description for "What Is" section
function extractOverview(longDesc: string | undefined, name: string): string {
  if (!longDesc) return `${name} is a popular SaaS tool offering startup-friendly pricing and credits for early-stage companies.`
  // Get content after first ## heading, before second ## heading
  const sections = longDesc.split(/^## /m)
  if (sections.length < 2) return longDesc.slice(0, 500)
  // First section after "What Is X?" is usually the overview
  const overview = sections[1]
  // Get the text content (skip the heading line)
  const lines = overview.split('\n').slice(1).filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('-') && !l.startsWith('|') && !l.startsWith('>'))
  return lines.slice(0, 3).join('\n\n')
}

// Extract "Key Features" section
function extractKeyFeatures(longDesc: string | undefined): string[] {
  if (!longDesc) return []
  const features: string[] = []
  const lines = longDesc.split('\n')
  let inFeatures = false
  for (const line of lines) {
    if (line.match(/^### /)) {
      if (inFeatures) {
        features.push(line.slice(4).trim())
      }
    }
    if (line.match(/^## .*Key Feature|^## .*Features/i)) {
      inFeatures = true
    } else if (line.match(/^## /) && inFeatures) {
      break
    }
  }
  return features.slice(0, 5)
}

export default async function ComparePage({ params }: PageProps) {
  const parsed = parseSlugs(params.slugs)
  if (!parsed) notFound()

  const [dealA, dealB] = await getDeals(parsed[0], parsed[1])
  if (!dealA || !dealB) notFound()

  const benefitsA = dealA.benefits || []
  const benefitsB = dealB.benefits || []
  const faqA = dealA.faq || []
  const faqB = dealB.faq || []
  const overviewA = extractOverview(dealA.long_description, dealA.name)
  const overviewB = extractOverview(dealB.long_description, dealB.name)
  const featuresA = extractKeyFeatures(dealA.long_description)
  const featuresB = extractKeyFeatures(dealB.long_description)

  // Determine which has higher value
  const higherValue = dealA.value > dealB.value ? dealA : dealB
  const lowerValue = dealA.value > dealB.value ? dealB : dealA

  // Combine all FAQs for schema
  const allFaqs = [
    { question: `What is the difference between ${dealA.name} and ${dealB.name}?`, answer: `${dealA.name} offers ${dealA.value_label} and is categorized as ${dealA.category || 'SaaS'}. ${dealB.name} offers ${dealB.value_label} and is categorized as ${dealB.category || 'SaaS'}. Both offer startup deals through SaaSOffers. The right choice depends on your specific needs — ${dealA.name} is best for teams needing ${dealA.category?.toLowerCase() || 'its specific capabilities'}, while ${dealB.name} excels at ${dealB.category?.toLowerCase() || 'its specific use cases'}.` },
    { question: `Can I use both ${dealA.name} and ${dealB.name} together?`, answer: `Yes. There are no restrictions on claiming startup deals from multiple tools. Many startups use both ${dealA.name} and ${dealB.name} simultaneously — each serving different needs. Claim both through SaaSOffers for maximum savings.` },
    { question: `Which has a better startup deal — ${dealA.name} or ${dealB.name}?`, answer: `${higherValue.name} offers ${higherValue.value_label}, while ${lowerValue.name} offers ${lowerValue.value_label}. However, the "better" deal depends on which tool you actually need — a larger credit on a tool you won't use is worth less than a smaller credit on a tool that's essential to your stack.` },
    { question: `Is ${dealA.name} free for startups?`, answer: `${dealA.name} offers ${dealA.value_label} through its startup program on SaaSOffers. The deal type is "${dealA.type}" — ${dealA.type === 'free' ? 'available to all users for free' : dealA.type === 'premium' ? 'available to SaaSOffers Premium members ($79/year)' : 'available after a short application process'}. ${dealA.requirements || ''}` },
    { question: `Is ${dealB.name} free for startups?`, answer: `${dealB.name} offers ${dealB.value_label} through its startup program on SaaSOffers. The deal type is "${dealB.type}" — ${dealB.type === 'free' ? 'available to all users for free' : dealB.type === 'premium' ? 'available to SaaSOffers Premium members ($79/year)' : 'available after a short application process'}. ${dealB.requirements || ''}` },
    ...faqA.slice(0, 3),
    ...faqB.slice(0, 3),
  ]

  // JSON-LD schemas
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${dealA.name} vs ${dealB.name} for Startups (2026)`,
    description: `Side-by-side comparison of ${dealA.name} and ${dealB.name} for startup teams in 2026.`,
    author: { '@type': 'Organization', name: 'SaaSOffers', url: 'https://saasoffers.tech' },
    publisher: { '@type': 'Organization', name: 'SaaSOffers', url: 'https://saasoffers.tech', logo: { '@type': 'ImageObject', url: 'https://saasoffers.tech/icon.png' } },
    datePublished: '2026-04-03T00:00:00.000Z',
    dateModified: new Date().toISOString(),
    mainEntityOfPage: `https://saasoffers.tech/compare/${params.slugs}`,
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allFaqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://saasoffers.tech' },
      { '@type': 'ListItem', position: 2, name: 'Compare', item: 'https://saasoffers.tech/compare' },
      { '@type': 'ListItem', position: 3, name: `${dealA.name} vs ${dealB.name}`, item: `https://saasoffers.tech/compare/${params.slugs}` },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="max-w-6xl mx-auto">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <Link href="/compare" className="hover:text-gray-900 transition-colors font-medium">Compare</Link>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <span className="text-gray-900 font-semibold">{dealA.name} vs {dealB.name}</span>
        </nav>

        {/* ── HERO ── */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-bold" style={{ backgroundColor: dealA.logo_bg || '#7C3AED' }}>
              {dealA.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5 text-gray-400" />
            </div>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-bold" style={{ backgroundColor: dealB.logo_bg || '#7C3AED' }}>
              {dealB.name.slice(0, 2).toUpperCase()}
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
            {dealA.name} vs {dealB.name} for Startups in 2026
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Choosing between {dealA.name} ({dealA.value_label}) and {dealB.name} ({dealB.value_label}) for your startup?
            This side-by-side comparison covers features, startup deals, pricing, and which tool fits your stack — with verified deals you can claim through <Link href="/offers" className="text-violet-600 font-semibold hover:underline">SaaSOffers</Link>.
          </p>
        </div>

        {/* ── QUICK ANSWER BOX ── */}
        <div className="bg-violet-50 border border-violet-100 rounded-2xl p-6 sm:p-8 mb-10">
          <p className="text-sm font-bold text-violet-800 mb-2">Quick Answer</p>
          <p className="text-sm text-gray-800 leading-relaxed">
            <strong>{dealA.name}</strong> offers {dealA.value_label} and is best for startups needing {dealA.category?.toLowerCase() || 'its specific capabilities'}.{' '}
            <strong>{dealB.name}</strong> offers {dealB.value_label} and is best for {dealB.category?.toLowerCase() || 'its specific use cases'}.{' '}
            {dealA.value > dealB.value
              ? `${dealA.name} provides a higher-value startup deal, but ${dealB.name} may be the better fit depending on your stack.`
              : dealA.value < dealB.value
              ? `${dealB.name} provides a higher-value startup deal, but ${dealA.name} may be the better fit depending on your stack.`
              : `Both offer comparable deal values — choose based on which tool your team actually needs.`
            }{' '}
            You can claim both through <Link href="/offers" className="text-violet-600 font-semibold hover:underline">SaaSOffers</Link> — there are no restrictions on using multiple startup deals.
          </p>
        </div>

        {/* ── QUICK COMPARISON CARDS ── */}
        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          {[dealA, dealB].map(deal => (
            <div key={deal.slug} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: deal.logo_bg || '#7C3AED' }}>
                  {deal.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">{deal.name}</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <DealTypeBadge type={deal.type} />
                    {deal.category && <span className="text-xs text-gray-500">{deal.category}</span>}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{deal.description}</p>
              <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-lg mb-4">
                <DollarSign className="w-4 h-4" />{deal.value_label}
              </div>
              <Link href={`/offers/${deal.slug}`} className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-violet-600 to-pink-500 text-white text-sm font-semibold py-3 rounded-xl shadow-sm hover:shadow-md transition-all">
                <Zap className="w-4 h-4" fill="white" />
                Claim {deal.name} Deal
              </Link>
            </div>
          ))}
        </div>

        {/* ── WHAT IS [TOOL A]? ── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What Is {dealA.name}?</h2>
          <div className="text-[15px] text-gray-700 leading-relaxed space-y-4">
            {overviewA.split('\n\n').map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {featuresA.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Key Features</h3>
              <ul className="grid sm:grid-cols-2 gap-2">
                {featuresA.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ── WHAT IS [TOOL B]? ── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What Is {dealB.name}?</h2>
          <div className="text-[15px] text-gray-700 leading-relaxed space-y-4">
            {overviewB.split('\n\n').map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {featuresB.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Key Features</h3>
              <ul className="grid sm:grid-cols-2 gap-2">
                {featuresB.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ── DETAILED COMPARISON TABLE ── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{dealA.name} vs {dealB.name} — Detailed Comparison</h2>
          <div className="grid grid-cols-3 gap-4 pb-4 border-b border-gray-200">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Feature</div>
            <div className="text-sm font-bold text-gray-900">{dealA.name}</div>
            <div className="text-sm font-bold text-gray-900">{dealB.name}</div>
          </div>
          <FeatureRow label="Startup deal value" a={<span className="text-emerald-600 font-bold">{dealA.value_label}</span>} b={<span className="text-emerald-600 font-bold">{dealB.value_label}</span>} />
          <FeatureRow label="Deal type" a={<DealTypeBadge type={dealA.type} />} b={<DealTypeBadge type={dealB.type} />} />
          <FeatureRow label="Category" a={dealA.category || '—'} b={dealB.category || '—'} />
          <FeatureRow label="Requirements" a={<span className="text-xs leading-relaxed">{dealA.requirements || 'Early-stage startup'}</span>} b={<span className="text-xs leading-relaxed">{dealB.requirements || 'Early-stage startup'}</span>} />
          <FeatureRow label="Available on SaaSOffers" a={<span className="text-emerald-600 font-semibold">✓ Yes</span>} b={<span className="text-emerald-600 font-semibold">✓ Yes</span>} />
          <FeatureRow
            label="Bootstrapped eligible"
            a={<span className="text-emerald-600 font-semibold">✓ Yes</span>}
            b={<span className="text-emerald-600 font-semibold">✓ Yes</span>}
          />
        </div>

        {/* ── WHAT'S INCLUDED ── */}
        {(benefitsA.length > 0 || benefitsB.length > 0) && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What&apos;s Included in Each Startup Deal</h2>
            <p className="text-sm text-gray-600 mb-6">Here is exactly what you get when claiming each deal through SaaSOffers:</p>
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[9px] font-bold" style={{ backgroundColor: dealA.logo_bg || '#7C3AED' }}>{dealA.name[0]}</div>
                  {dealA.name}
                </h3>
                <ul className="space-y-2.5">
                  {benefitsA.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />{b}
                    </li>
                  ))}
                  {benefitsA.length === 0 && <li className="text-sm text-gray-400 italic">Benefits details available on the deal page</li>}
                </ul>
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[9px] font-bold" style={{ backgroundColor: dealB.logo_bg || '#7C3AED' }}>{dealB.name[0]}</div>
                  {dealB.name}
                </h3>
                <ul className="space-y-2.5">
                  {benefitsB.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />{b}
                    </li>
                  ))}
                  {benefitsB.length === 0 && <li className="text-sm text-gray-400 italic">Benefits details available on the deal page</li>}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ── WHO SHOULD USE WHICH ── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Who Should Use {dealA.name} vs {dealB.name}?</h2>
          <p className="text-[15px] text-gray-700 leading-relaxed mb-6">
            The right tool depends on what your startup actually needs day-to-day. Both {dealA.name} and {dealB.name} serve different use cases, and many startups use tools from the same category for different purposes. Here is when each makes sense:
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-violet-50 border border-violet-100 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-3">Choose {dealA.name} if:</h3>
              <ul className="space-y-2.5 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" />
                  You need {dealA.category?.toLowerCase() || 'this type of tool'} as a core part of your product or operations
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" />
                  {dealA.value_label} in credits covers your usage for 6–12 months
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" />
                  Your team has experience with {dealA.name} or similar tools in its category
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" />
                  You want a {dealA.type === 'free' ? 'free, no-application deal' : dealA.type === 'premium' ? 'premium-tier deal with SaaSOffers Premium' : 'deal available through a short application'}
                </li>
              </ul>
            </div>
            <div className="bg-pink-50 border border-pink-100 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-3">Choose {dealB.name} if:</h3>
              <ul className="space-y-2.5 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" />
                  You need {dealB.category?.toLowerCase() || 'this type of tool'} as a core part of your product or operations
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" />
                  {dealB.value_label} in credits covers your usage for 6–12 months
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" />
                  Your team has experience with {dealB.name} or similar tools in its category
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" />
                  You want a {dealB.type === 'free' ? 'free, no-application deal' : dealB.type === 'premium' ? 'premium-tier deal with SaaSOffers Premium' : 'deal available through a short application'}
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6 bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-700">
              <strong>Can you use both?</strong> Yes — there are no restrictions on claiming multiple startup deals. Many startups use {dealA.name} and {dealB.name} simultaneously for different needs.
              Claim both through <Link href="/offers" className="text-violet-600 font-semibold hover:underline">SaaSOffers</Link>.
            </p>
          </div>
        </div>

        {/* ── STARTUP DEAL COMPARISON ── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Startup Deal Comparison: Which Saves More?</h2>
          <p className="text-[15px] text-gray-700 leading-relaxed mb-6">
            Both {dealA.name} and {dealB.name} offer startup deals through SaaSOffers. Here is how the deals compare for a typical early-stage startup in 2026:
          </p>
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-100">Factor</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-100">{dealA.name}</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-100">{dealB.name}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <tr><td className="px-4 py-3 text-gray-600">Deal value</td><td className="px-4 py-3 text-emerald-600 font-bold">{dealA.value_label}</td><td className="px-4 py-3 text-emerald-600 font-bold">{dealB.value_label}</td></tr>
                <tr><td className="px-4 py-3 text-gray-600">Access type</td><td className="px-4 py-3 capitalize">{dealA.type}</td><td className="px-4 py-3 capitalize">{dealB.type}</td></tr>
                <tr><td className="px-4 py-3 text-gray-600">Category</td><td className="px-4 py-3">{dealA.category || '—'}</td><td className="px-4 py-3">{dealB.category || '—'}</td></tr>
                <tr><td className="px-4 py-3 text-gray-600">VC funding required?</td><td className="px-4 py-3 text-emerald-600">No</td><td className="px-4 py-3 text-emerald-600">No</td></tr>
                <tr><td className="px-4 py-3 text-gray-600">Solo founders eligible?</td><td className="px-4 py-3 text-emerald-600">Yes</td><td className="px-4 py-3 text-emerald-600">Yes</td></tr>
                <tr><td className="px-4 py-3 text-gray-600">Claim through SaaSOffers</td><td className="px-4 py-3"><Link href={`/offers/${dealA.slug}`} className="text-violet-600 font-semibold hover:underline">Claim →</Link></td><td className="px-4 py-3"><Link href={`/offers/${dealB.slug}`} className="text-violet-600 font-semibold hover:underline">Claim →</Link></td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── FAQ SECTION ── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
          <p className="text-sm text-gray-600 mb-6">Common questions about {dealA.name} vs {dealB.name} for startups.</p>
          <div className="space-y-5">
            {allFaqs.map((f, i) => (
              <div key={i} className="border-b border-gray-50 pb-5 last:border-0 last:pb-0">
                <h3 className="text-sm font-bold text-gray-900 mb-2">{f.question}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── THE VERDICT ── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The Bottom Line: {dealA.name} vs {dealB.name}</h2>
          <div className="text-[15px] text-gray-700 leading-relaxed space-y-4">
            <p>
              Both {dealA.name} and {dealB.name} offer genuine value for early-stage startups in 2026. The decision comes down to your specific needs:
            </p>
            <p>
              <strong>{dealA.name}</strong> provides {dealA.value_label} and is the stronger choice for startups that need {dealA.category?.toLowerCase() || 'its specific capabilities'}.
              The deal is accessible as a {dealA.type === 'free' ? 'free' : dealA.type === 'premium' ? 'premium' : 'apply-for'} offer through SaaSOffers.
            </p>
            <p>
              <strong>{dealB.name}</strong> provides {dealB.value_label} and is the stronger choice for startups that need {dealB.category?.toLowerCase() || 'its specific capabilities'}.
              The deal is accessible as a {dealB.type === 'free' ? 'free' : dealB.type === 'premium' ? 'premium' : 'apply-for'} offer through SaaSOffers.
            </p>
            <p>
              The best approach for most startups is to claim both deals — there are no restrictions, and each tool serves a different part of your stack.
              Start by claiming the tool you need first, then add the second when you need it.
            </p>
          </div>
        </div>

        {/* ── CTAs ── */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <Link href={`/offers/${dealA.slug}`} className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-violet-700 text-white font-semibold py-4 rounded-xl shadow-md hover:shadow-lg transition-all text-sm">
            Claim {dealA.name} — {dealA.value_label} <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href={`/offers/${dealB.slug}`} className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold py-4 rounded-xl shadow-md hover:shadow-lg transition-all text-sm">
            Claim {dealB.name} — {dealB.value_label} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* ── MORE COMPARISONS ── */}
        <div className="text-center">
          <Link href="/compare" className="inline-flex items-center gap-2 text-violet-600 font-semibold text-sm hover:underline">
            <ArrowLeftRight className="w-4 h-4" />
            Browse all comparisons
          </Link>
        </div>

        {/* ── AUTHOR ── */}
        <div className="mt-14 bg-gray-50 border border-gray-100 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            SO
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">SaaSOffers Team</div>
            <p className="text-sm text-gray-600 leading-relaxed mt-1">
              We&apos;ve helped 2,000+ startup founders unlock $500,000+ in SaaS credits and discounts. Every comparison is based on real deal data from our platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
