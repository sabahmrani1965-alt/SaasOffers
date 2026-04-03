import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Deal } from '@/types'
import { ArrowLeftRight, CheckCircle2, XCircle, DollarSign, Zap, ArrowRight, ChevronRight } from 'lucide-react'

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

  const title = `${dealA.name} vs ${dealB.name} for Startups (2026) | SaaSOffers`
  const description = `Compare ${dealA.name} and ${dealB.name} side by side — features, pricing, startup deals, and which is right for your startup in 2026.`

  return {
    title,
    description,
    openGraph: { title, description, type: 'website' },
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
  const styles = {
    free: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    premium: 'bg-violet-50 text-violet-700 border-violet-200',
    apply: 'bg-amber-50 text-amber-700 border-amber-200',
  }
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${styles[type as keyof typeof styles] || styles.apply}`}>
      {type}
    </span>
  )
}

function parseBenefits(deal: Deal): string[] {
  if (deal.benefits && deal.benefits.length > 0) return deal.benefits
  return []
}

function extractFAQs(deal: Deal): { question: string; answer: string }[] {
  if (deal.faq && deal.faq.length > 0) return deal.faq.slice(0, 3)
  return []
}

export default async function ComparePage({ params }: PageProps) {
  const parsed = parseSlugs(params.slugs)
  if (!parsed) notFound()

  const [dealA, dealB] = await getDeals(parsed[0], parsed[1])
  if (!dealA || !dealB) notFound()

  const benefitsA = parseBenefits(dealA)
  const benefitsB = parseBenefits(dealB)
  const faqA = extractFAQs(dealA)
  const faqB = extractFAQs(dealB)

  // JSON-LD
  const comparisonJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${dealA.name} vs ${dealB.name} for Startups (2026)`,
    description: `Side-by-side comparison of ${dealA.name} and ${dealB.name} for startup teams.`,
    author: { '@type': 'Organization', name: 'SaaSOffers', url: 'https://saasoffers.tech' },
    publisher: { '@type': 'Organization', name: 'SaaSOffers', url: 'https://saasoffers.tech' },
    datePublished: new Date().toISOString(),
    mainEntityOfPage: `https://saasoffers.tech/compare/${params.slugs}`,
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(comparisonJsonLd) }} />

      <div className="max-w-5xl mx-auto">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/compare" className="hover:text-gray-900 transition-colors font-medium">Compare</Link>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <span className="text-gray-900 font-semibold">{dealA.name} vs {dealB.name}</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-bold"
              style={{ backgroundColor: dealA.logo_bg || '#7C3AED' }}
            >
              {dealA.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5 text-gray-400" />
            </div>
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-bold"
              style={{ backgroundColor: dealB.logo_bg || '#7C3AED' }}
            >
              {dealB.name.slice(0, 2).toUpperCase()}
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
            {dealA.name} vs {dealB.name}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Side-by-side comparison for startups in 2026 — which one fits your stack?
          </p>
        </div>

        {/* Quick comparison cards */}
        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          {[dealA, dealB].map(deal => (
            <div key={deal.slug} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: deal.logo_bg || '#7C3AED' }}
                >
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
              <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">{deal.description}</p>
              <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-lg mb-4">
                <DollarSign className="w-4 h-4" />
                {deal.value_label}
              </div>
              <Link
                href={`/offers/${deal.slug}`}
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-violet-600 to-pink-500 text-white text-sm font-semibold py-3 rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <Zap className="w-4 h-4" fill="white" />
                Claim {deal.name} Deal
              </Link>
            </div>
          ))}
        </div>

        {/* Detailed comparison table */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Detailed Comparison</h2>

          {/* Table header */}
          <div className="grid grid-cols-3 gap-4 pb-4 border-b border-gray-200">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Feature</div>
            <div className="text-sm font-bold text-gray-900">{dealA.name}</div>
            <div className="text-sm font-bold text-gray-900">{dealB.name}</div>
          </div>

          <FeatureRow
            label="Deal value"
            a={<span className="text-emerald-600 font-bold">{dealA.value_label}</span>}
            b={<span className="text-emerald-600 font-bold">{dealB.value_label}</span>}
          />
          <FeatureRow
            label="Deal type"
            a={<DealTypeBadge type={dealA.type} />}
            b={<DealTypeBadge type={dealB.type} />}
          />
          <FeatureRow
            label="Category"
            a={dealA.category || '—'}
            b={dealB.category || '—'}
          />
          <FeatureRow
            label="Requirements"
            a={<span className="text-xs">{dealA.requirements || 'Not specified'}</span>}
            b={<span className="text-xs">{dealB.requirements || 'Not specified'}</span>}
          />
        </div>

        {/* What's included — side by side */}
        {(benefitsA.length > 0 || benefitsB.length > 0) && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-6">What&apos;s Included</h2>
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4">{dealA.name}</h3>
                <ul className="space-y-2.5">
                  {benefitsA.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      {b}
                    </li>
                  ))}
                  {benefitsA.length === 0 && <li className="text-sm text-gray-400">No benefits listed</li>}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4">{dealB.name}</h3>
                <ul className="space-y-2.5">
                  {benefitsB.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      {b}
                    </li>
                  ))}
                  {benefitsB.length === 0 && <li className="text-sm text-gray-400">No benefits listed</li>}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* FAQ comparison */}
        {(faqA.length > 0 || faqB.length > 0) && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Common Questions</h2>
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4">{dealA.name}</h3>
                <div className="space-y-4">
                  {faqA.map((f, i) => (
                    <div key={i}>
                      <p className="text-sm font-semibold text-gray-800 mb-1">{f.question}</p>
                      <p className="text-xs text-gray-600 leading-relaxed">{f.answer.slice(0, 200)}{f.answer.length > 200 ? '...' : ''}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4">{dealB.name}</h3>
                <div className="space-y-4">
                  {faqB.map((f, i) => (
                    <div key={i}>
                      <p className="text-sm font-semibold text-gray-800 mb-1">{f.question}</p>
                      <p className="text-xs text-gray-600 leading-relaxed">{f.answer.slice(0, 200)}{f.answer.length > 200 ? '...' : ''}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Verdict */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">The Verdict</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-violet-50 border border-violet-100 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 mb-2">Choose {dealA.name} if:</h3>
              <ul className="space-y-1.5 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-500 flex-shrink-0 mt-0.5" />
                  You want {dealA.value_label} in startup credits
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-500 flex-shrink-0 mt-0.5" />
                  Your team needs {dealA.category?.toLowerCase() || 'this type of tool'}
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-500 flex-shrink-0 mt-0.5" />
                  You prefer a {dealA.type === 'free' ? 'free, no-application' : dealA.type === 'premium' ? 'premium-tier' : 'application-based'} deal
                </li>
              </ul>
            </div>
            <div className="bg-pink-50 border border-pink-100 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 mb-2">Choose {dealB.name} if:</h3>
              <ul className="space-y-1.5 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-500 flex-shrink-0 mt-0.5" />
                  You want {dealB.value_label} in startup credits
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-500 flex-shrink-0 mt-0.5" />
                  Your team needs {dealB.category?.toLowerCase() || 'this type of tool'}
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-500 flex-shrink-0 mt-0.5" />
                  You prefer a {dealB.type === 'free' ? 'free, no-application' : dealB.type === 'premium' ? 'premium-tier' : 'application-based'} deal
                </li>
              </ul>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-5 text-center">
            Can&apos;t decide? Claim both — there are no restrictions on using multiple deals simultaneously.
          </p>
        </div>

        {/* CTA */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href={`/offers/${dealA.slug}`}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-violet-700 text-white font-semibold py-4 rounded-xl shadow-md hover:shadow-lg transition-all text-sm"
          >
            Claim {dealA.name} — {dealA.value_label} <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href={`/offers/${dealB.slug}`}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold py-4 rounded-xl shadow-md hover:shadow-lg transition-all text-sm"
          >
            Claim {dealB.name} — {dealB.value_label} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* More comparisons */}
        <div className="mt-14 text-center">
          <Link href="/compare" className="inline-flex items-center gap-2 text-violet-600 font-semibold text-sm hover:underline">
            <ArrowLeftRight className="w-4 h-4" />
            Browse all comparisons
          </Link>
        </div>
      </div>
    </div>
  )
}
