import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SEED_DEALS } from '@/lib/seed-data'
import { DealCard } from '@/components/offers/DealCard'
import {
  ArrowRight, CheckCircle2, Star, Users, Zap,
  BarChart3, Shield, Clock
} from 'lucide-react'

const LOGOS = [
  { name: 'AWS', color: '#FF9900' },
  { name: 'Notion', color: '#fff' },
  { name: 'Deel', color: '#15CCAE' },
  { name: 'Linear', color: '#5E6AD2' },
  { name: 'Figma', color: '#F24E1E' },
  { name: 'Stripe', color: '#635BFF' },
]

const STEPS = [
  {
    step: '01',
    title: 'Create your account',
    description: 'Sign up in 30 seconds. No credit card required to access free deals.',
    icon: Users,
  },
  {
    step: '02',
    title: 'Browse & unlock deals',
    description: 'Explore 50+ SaaS offers. Free deals are instant — premium deals require an upgrade.',
    icon: Zap,
  },
  {
    step: '03',
    title: 'Save thousands',
    description: 'Redeem your credits directly with each provider and put more money back into building.',
    icon: BarChart3,
  },
]

const TESTIMONIALS = [
  {
    quote: "SaaSOffers helped us unlock $8,000 in AWS credits in under a week. That's two months of runway we didn't have to raise.",
    author: 'Marcus L.',
    role: 'Co-founder, Revel AI',
    avatar: 'ML',
  },
  {
    quote: "Every serious founder should be using this. We saved over $12,000 on tooling in our first year. The ROI on Premium is insane.",
    author: 'Sofia R.',
    role: 'CEO, Stackflow',
    avatar: 'SR',
  },
  {
    quote: "The Notion + Linear + Figma stack — all free for 6 months. We basically had zero tooling costs while building our MVP.",
    author: 'James T.',
    role: 'Founder, Coda Labs',
    avatar: 'JT',
  },
]

const PRICING = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Start saving with free deals available to every startup.',
    features: [
      'Access to free tier deals',
      'Notion, Linear & more',
      '~$1,000+ in potential savings',
      'Email deal alerts',
    ],
    cta: 'Get started free',
    href: '/signup',
    highlight: false,
  },
  {
    name: 'Premium',
    price: '$79',
    period: 'per year',
    description: 'Unlock the highest-value deals including AWS, Deel, and more.',
    features: [
      'Everything in Free',
      'AWS Activate ($5,000)',
      'Deel credits ($1,500)',
      'All premium-gated deals',
      '$10,000+ in potential savings',
      'Priority support',
    ],
    cta: 'Upgrade to Premium',
    href: '/signup?plan=premium',
    highlight: true,
  },
]

export default async function HomePage() {
  // Try to get deals from Supabase, fallback to seed data
  const supabase = createClient()
  const { data: deals } = await supabase
    .from('deals')
    .select('*')
    .order('value', { ascending: false })
    .limit(6)

  const featuredDeals = (deals && deals.length > 0 ? deals : SEED_DEALS).slice(0, 6)

  return (
    <div className="overflow-hidden">
      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px]" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-700/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 text-accent-300 text-xs font-medium px-3 py-1.5 rounded-full mb-8 animate-in">
            <Star className="w-3 h-3 fill-current" />
            Trusted by 2,000+ startup founders
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.05] mb-6 animate-in delay-100">
            Get{' '}
            <span className="gradient-text">$10,000+</span>
            {' '}in SaaS
            <br />Credits for Your Startup
          </h1>

          <p className="text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10 animate-in delay-200">
            Access exclusive deals from top SaaS tools like AWS, Notion, and Deel.
            Stop overpaying — start building with the stack the best startups use.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-in delay-300">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-600 text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 shadow-2xl shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5 text-base"
            >
              Get Access — It's Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/offers"
              className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-medium px-7 py-3.5 rounded-xl transition-all duration-200 text-base"
            >
              Browse Offers
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ─────────────────────────────────── */}
      <section className="py-12 border-y border-white/5 bg-surface-100/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-center text-xs text-zinc-500 uppercase tracking-widest font-medium mb-8">
            Exclusive deals from industry-leading tools
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {LOGOS.map(logo => (
              <div
                key={logo.name}
                className="flex items-center gap-2.5 opacity-50 hover:opacity-80 transition-opacity"
              >
                <div
                  className="w-6 h-6 rounded-md flex-shrink-0"
                  style={{ backgroundColor: logo.color, opacity: 0.9 }}
                />
                <span className="text-sm font-medium text-zinc-300">{logo.name}</span>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-10">
            {[
              { value: '$10,000+', label: 'Total value unlocked' },
              { value: '2,000+', label: 'Founders trust us' },
              { value: '50+', label: 'SaaS deals available' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-zinc-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED DEALS ─────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl text-white mb-3">
              Featured Deals
            </h2>
            <p className="text-zinc-400">
              Hand-picked offers to accelerate your startup
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredDeals.map((deal: any) => (
              <DealCard key={deal.slug} deal={deal} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/offers"
              className="inline-flex items-center gap-2 text-accent-300 hover:text-accent-200 font-medium text-sm transition-colors"
            >
              View all deals
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 bg-surface-100/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl text-white mb-3">
              How It Works
            </h2>
            <p className="text-zinc-400">Three steps to thousands in savings</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step) => {
              const Icon = step.icon
              return (
                <div key={step.step} className="relative">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-accent-300" />
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-accent-400 font-mono font-bold mb-1">{step.step}</div>
                      <h3 className="font-semibold text-white text-base mb-2">{step.title}</h3>
                      <p className="text-sm text-zinc-400 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────── */}
      <section id="pricing" className="py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl text-white mb-3">
              Simple Pricing
            </h2>
            <p className="text-zinc-400">Start free. Upgrade when the math makes sense.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PRICING.map(plan => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 border ${
                  plan.highlight
                    ? 'bg-accent/5 border-accent/30 shadow-2xl shadow-accent/10'
                    : 'bg-surface-50 border-white/5'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg shadow-accent/30">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-zinc-500 text-sm">/ {plan.period}</span>
                  </div>
                  <p className="text-sm text-zinc-400">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(feature => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlight ? 'text-accent-300' : 'text-emerald-400'}`} />
                      <span className="text-zinc-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block text-center font-semibold py-3 rounded-xl transition-all duration-200 text-sm ${
                    plan.highlight
                      ? 'bg-accent hover:bg-accent-600 text-white shadow-lg shadow-accent/25'
                      : 'bg-white/5 hover:bg-white/10 text-zinc-200 border border-white/10'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-zinc-500 mt-6">
            <Shield className="w-3 h-3 inline mr-1" />
            Secure payment via Stripe. Cancel anytime.
          </p>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 bg-surface-100/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl text-white mb-3">
              What Founders Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.author} className="bg-surface-50 border border-white/5 rounded-2xl p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent-300">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{t.author}</div>
                    <div className="text-xs text-zinc-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative bg-surface-50 border border-white/5 rounded-3xl p-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-radial from-accent/10 via-transparent to-transparent pointer-events-none" />
            <h2 className="font-display text-3xl sm:text-4xl text-white mb-4 relative">
              Ready to save thousands?
            </h2>
            <p className="text-zinc-400 mb-8 relative">
              Join 2,000+ founders already using SaaSOffers to stretch their runway.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-xl shadow-accent/25 hover:shadow-accent/40 relative"
            >
              Get Free Access Now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-xs text-zinc-600 mt-4 relative">
              <Clock className="w-3 h-3 inline mr-1" />
              Takes 30 seconds. No credit card required.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
