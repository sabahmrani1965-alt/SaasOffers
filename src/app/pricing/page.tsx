'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  CheckCircle2, Shield, ShieldCheck, Zap, ArrowRight,
  ChevronDown, Lock, Rocket, Users, Star, Sparkles, X,
} from 'lucide-react'
import { UpgradeButton } from '@/components/UpgradeButton'

/* ── JSON-LD (rendered as script tags) ── */
const FAQ_ITEMS = [
  {
    q: 'Do I need a credit card for the free plan?',
    a: 'No. The free plan is completely free with no card required. Sign up in 30 seconds and start claiming deals instantly.',
  },
  {
    q: 'Can I cancel my premium plan anytime?',
    a: 'Yes. Cancel with one click from your dashboard. No questions asked, no cancellation fees.',
  },
  {
    q: 'What happens when my year ends?',
    a: 'You will receive a reminder 7 days before your renewal date. Your access continues until the end of your billing period.',
  },
  {
    q: 'Is $79/year really worth it?',
    a: 'One deal pays for the entire year. AWS Activate alone gives you $5,000 in credits — that is 63x the cost of Premium. Most founders save $10,000+ in their first month.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'Yes. If you cannot access a deal and have not redeemed any other deal, we will fully refund you within 30 days. No questions asked.',
  },
  {
    q: 'How often are new deals added?',
    a: 'New verified deals are added every week. Premium members get notified first via email.',
  },
  {
    q: 'Who is Premium for?',
    a: 'Premium is for founders who are serious about building. If you are actively working on a startup and want access to the best tools, the strongest community, and the highest-value credits — Premium is built for you.',
  },
  {
    q: 'Can I use a promo code?',
    a: 'Yes. Enter your promo code at checkout to apply your discount. Try GITEX50 for 50% off.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://saasoffers.tech' },
    { '@type': 'ListItem', position: 2, name: 'Pricing', item: 'https://saasoffers.tech/pricing' },
  ],
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Pricing — SaaSOffers',
  description: 'Start free with 100+ startup deals or upgrade to Premium for $79/year and unlock 500+ deals, $500,000+ in credits, accelerators directory, and private founder community.',
  url: 'https://saasoffers.tech/pricing',
  publisher: {
    '@type': 'Organization',
    name: 'SaaSOffers',
    url: 'https://saasoffers.tech',
  },
}

/* ── Comparison table rows ── */
const COMPARISON = [
  { feature: 'Deals access',          free: '100+ free deals',  premium: '500+ premium deals' },
  { feature: 'Potential savings',      free: '~$10,000+',       premium: '$500,000+' },
  { feature: 'Accelerators directory', free: false,              premium: true },
  { feature: 'Application tracker',    free: false,              premium: true },
  { feature: 'Deadline alerts',        free: false,              premium: true },
  { feature: 'Private community',      free: false,              premium: true },
  { feature: 'Founder events',         free: false,              premium: true },
  { feature: 'Priority support',       free: false,              premium: true },
  { feature: 'Early access',           free: false,              premium: true },
  { feature: 'Money back guarantee',   free: false,              premium: '30 days' },
  { feature: 'Price',                  free: '$0',               premium: '$79/year' },
]

/* ── Premium feature groups ── */
const PREMIUM_GROUPS = [
  {
    emoji: '\uD83D\uDD13',
    label: 'DEALS',
    features: [
      '500+ premium deals fully unlocked',
      '$500,000+ in potential savings',
      'Highest-value credits unlocked',
      'New premium deals every week',
      'Verified and updated weekly',
    ],
  },
  {
    emoji: '\uD83D\uDE80',
    label: 'ACCELERATORS',
    features: [
      'Full accelerators directory access',
      'Filter by industry, stage, location',
      'Application deadline tracker',
      'Save and track your applications',
      'Deadline alerts and reminders',
    ],
  },
  {
    emoji: '\uD83D\uDC65',
    label: 'COMMUNITY',
    features: [
      'Private founder community access',
      'Connect with 2,000+ founders',
      'Share resources, get feedback',
      'Exclusive founder events',
    ],
  },
  {
    emoji: '\u2B50',
    label: 'PREMIUM',
    features: [
      'Priority support',
      'Founding member status',
      'Early access to new features',
      '30-day money back guarantee',
    ],
  },
]

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-white">
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      {/* ── HERO ── */}
      <section className="relative pt-28 pb-16 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-violet-400 rounded-full blur-[130px] opacity-[0.06]" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-pink-400 rounded-full blur-[130px] opacity-[0.05]" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-100 text-violet-700 text-xs font-semibold px-4 py-2 rounded-full mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            Pricing
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight mb-4">
            Simple Pricing.{' '}
            <span className="gradient-text">Massive Savings.</span>
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Start free. Upgrade when the math makes sense. Cancel anytime.
          </p>
        </div>
      </section>

      {/* ── PRICING CARDS ── */}
      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

          {/* FREE CARD */}
          <div className="relative rounded-3xl p-8 border bg-white border-gray-100 shadow-card hover:shadow-card-hover transition-all h-full flex flex-col">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Free</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-sm text-gray-700">/ forever</span>
              </div>
              <p className="text-sm text-gray-700">Everything you need to get started</p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {[
                'Access to 100+ free deals',
                'Notion, Linear, Figma & more',
                '~$10,000+ in potential savings',
                'Weekly new deal alerts',
                'Blog guides and startup resources',
                'Basic community access',
              ].map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-violet-500" />
                  <span className="text-gray-700">{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/signup"
              className="block text-center font-bold py-3.5 rounded-2xl transition-all duration-200 text-sm border-2 border-gray-200 text-gray-900 hover:border-violet-300 hover:text-violet-600"
            >
              Get Started Free
            </Link>
            <p className="text-center text-xs text-gray-500 mt-3">No credit card required</p>
          </div>

          {/* PREMIUM CARD */}
          <div className="relative rounded-3xl p-8 border bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 border-transparent shadow-brand-lg transition-all h-full flex flex-col">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="bg-white text-violet-600 text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
                Most Popular
              </span>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-1">Premium</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold text-white">$79</span>
                <span className="text-sm text-white/70">/ year</span>
              </div>
              <p className="text-sm text-white/80">Everything you need to build smarter</p>
              <p className="text-xs text-white/60 mt-1">Less than $7/month</p>
            </div>

            {/* Premium feature groups */}
            <div className="space-y-5 mb-8 flex-1">
              {PREMIUM_GROUPS.map(group => (
                <div key={group.label}>
                  <p className="text-xs font-bold text-white tracking-wider mb-2.5 bg-white/15 inline-block px-3 py-1 rounded-lg">
                    {group.emoji} {group.label}
                  </p>
                  <ul className="space-y-2">
                    {group.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-white/90" />
                        <span className="text-white/90">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <UpgradeButton className="block w-full text-center font-bold py-3.5 rounded-2xl transition-all duration-200 text-sm bg-white text-violet-600 hover:bg-gray-50 shadow-lg hover:-translate-y-0.5 cursor-pointer">
              Upgrade to Premium
            </UpgradeButton>

            <p className="text-center text-xs text-white/50 mt-4 flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Secure payment via Stripe. Cancel anytime.
            </p>
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-12 text-center">
            Everything you get
          </h2>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-5 px-8 font-bold text-gray-700 text-sm uppercase tracking-wider">Feature</th>
                  <th className="text-center py-5 px-6 font-bold text-gray-700 text-sm uppercase tracking-wider">Free</th>
                  <th className="text-center py-5 px-6 font-bold text-sm uppercase tracking-wider text-violet-600">Premium</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} className={i < COMPARISON.length - 1 ? 'border-b border-gray-100' : ''}>
                    <td className="py-5 px-8 text-gray-900 font-semibold text-[15px]">{row.feature}</td>
                    <td className="py-5 px-6 text-center">
                      {typeof row.free === 'boolean'
                        ? row.free
                          ? <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                          : <X className="w-5 h-5 text-gray-300 mx-auto" />
                        : <span className="text-gray-700 font-medium text-[15px]">{row.free}</span>
                      }
                    </td>
                    <td className="py-5 px-6 text-center">
                      {typeof row.premium === 'boolean'
                        ? row.premium
                          ? <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                          : <X className="w-5 h-5 text-gray-300 mx-auto" />
                        : <span className="text-violet-600 font-bold text-[15px]">{row.premium}</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── MONEY BACK GUARANTEE ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-3xl p-10 sm:p-14 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white border border-emerald-100 flex items-center justify-center mx-auto mb-6 shadow-sm">
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Zero Risk. Full Reward.
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-xl mx-auto">
              If you upgrade to Premium and cannot access a deal, we will fully refund you within 30 days. No questions asked. No hoops to jump through.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between text-left px-6 py-5 gap-4"
                >
                  <span className="font-semibold text-gray-900 text-[15px]">{item.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 -mt-1">
                    <p className="text-gray-600 text-[15px] leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-violet-600 to-pink-500 rounded-3xl p-10 sm:p-14 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Build Smarter?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Join 2,000+ founders already saving on their startup stack.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-all text-base border border-white/20"
              >
                Get Started Free
              </Link>
              <UpgradeButton className="inline-flex items-center justify-center gap-2 bg-white text-violet-600 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-base cursor-pointer">
                Upgrade to Premium — $79/year
              </UpgradeButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
