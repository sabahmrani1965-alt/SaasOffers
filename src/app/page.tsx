import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SEED_DEALS } from '@/lib/seed-data'
import { DealCard } from '@/components/offers/DealCard'
import { ArrowRight, CheckCircle2, Star, Users, Zap, BarChart3, Shield, Clock, Sparkles } from 'lucide-react'

const LOGOS = [
  { name: 'AWS', color: '#FF9900' },
  { name: 'Notion', color: '#000000' },
  { name: 'Deel', color: '#15CCAE' },
  { name: 'Linear', color: '#5E6AD2' },
  { name: 'Figma', color: '#F24E1E' },
  { name: 'Stripe', color: '#635BFF' },
]

const STEPS = [
  {
    step: '01', title: 'Create your account',
    description: 'Sign up in 30 seconds. No credit card required to access free deals.',
    icon: Users, gradient: 'from-violet-500 to-purple-600',
  },
  {
    step: '02', title: 'Browse & unlock deals',
    description: 'Explore 50+ SaaS offers. Free deals are instant — premium deals require an upgrade.',
    icon: Zap, gradient: 'from-blue-500 to-cyan-500',
  },
  {
    step: '03', title: 'Save thousands',
    description: 'Redeem your credits directly with each provider and put more money back into building.',
    icon: BarChart3, gradient: 'from-pink-500 to-rose-500',
  },
]

const TESTIMONIALS = [
  {
    quote: "SaaSOffers helped us unlock $8,000 in AWS credits in under a week. That's two months of runway we didn't have to raise.",
    author: 'Marcus L.', role: 'Co-founder, Revel AI', avatar: 'ML', gradient: 'from-violet-500 to-purple-600',
  },
  {
    quote: "Every serious founder should be using this. We saved over $12,000 on tooling in our first year. The ROI on Premium is insane.",
    author: 'Sofia R.', role: 'CEO, Stackflow', avatar: 'SR', gradient: 'from-blue-500 to-indigo-600',
  },
  {
    quote: "The Notion + Linear + Figma stack — all free for 6 months. We basically had zero tooling costs while building our MVP.",
    author: 'James T.', role: 'Founder, Coda Labs', avatar: 'JT', gradient: 'from-pink-500 to-rose-500',
  },
]

const PRICING = [
  {
    name: 'Free', price: '$0', period: 'forever',
    description: 'Start saving with free deals available to every startup.',
    features: ['Access to free tier deals', 'Notion, Linear & more', '~$1,000+ in potential savings', 'Email deal alerts'],
    cta: 'Get started free', href: '/signup', highlight: false,
  },
  {
    name: 'Premium', price: '$79', period: 'per year',
    description: 'Unlock the highest-value deals including AWS, Deel, and more.',
    features: ['Everything in Free', 'AWS Activate ($5,000)', 'Deel credits ($1,500)', 'All premium-gated deals', '$10,000+ in potential savings', 'Priority support'],
    cta: 'Upgrade to Premium', href: '/signup?plan=premium', highlight: true,
  },
]

export default async function HomePage() {
  const supabase = createClient()
  const { data: deals } = await supabase.from('deals').select('*').order('value', { ascending: false }).limit(6)
  const featuredDeals = (deals && deals.length > 0 ? deals : SEED_DEALS).slice(0, 6)

  return (
    <div className="overflow-hidden">

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-28 px-4 sm:px-6 bg-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-violet-400 rounded-full blur-[130px] opacity-[0.08]" />
          <div className="absolute -top-20 -right-40 w-[600px] h-[600px] bg-pink-400 rounded-full blur-[130px] opacity-[0.07]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-blue-300 rounded-full blur-[100px] opacity-[0.04]" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-100 text-violet-600 text-xs font-semibold px-4 py-2 rounded-full mb-8 animate-in">
            <Sparkles className="w-3.5 h-3.5" />
            Trusted by 2,000+ startup founders
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.05] tracking-tight mb-6 animate-in delay-100">
            Get <span className="gradient-text">$10,000+</span> in SaaS
            <br className="hidden sm:block" /> Credits for Your Startup
          </h1>

          <p className="text-gray-500 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10 animate-in delay-200">
            Access exclusive deals from top SaaS tools like AWS, Notion, and Deel.
            Stop overpaying — start building with the stack the best startups use.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-in delay-300">
            <Link href="/signup" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-violet-200 hover:shadow-xl hover:shadow-violet-300 hover:-translate-y-0.5 text-base">
              Get Access — It's Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/offers" className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-700 font-medium px-8 py-4 rounded-2xl transition-all duration-200 text-base shadow-sm">
              Browse Offers
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-6 flex-wrap animate-in delay-400">
            <div className="flex -space-x-2">
              {['ML', 'SR', 'JT', 'AK', 'BM'].map((init, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold" style={{ background: `hsl(${i * 60 + 250}, 65%, 58%)` }}>
                  {init[0]}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}</div>
              <span className="font-semibold text-gray-700">4.9</span>
              <span>from 200+ reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-center text-xs text-gray-400 uppercase tracking-widest font-semibold mb-8">
            Exclusive deals from industry-leading tools
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
            {LOGOS.map(logo => (
              <div key={logo.name} className="flex items-center gap-2.5 opacity-50 hover:opacity-90 transition-opacity cursor-default">
                <div className="w-6 h-6 rounded-lg flex-shrink-0" style={{ backgroundColor: logo.color }} />
                <span className="text-sm font-semibold text-gray-600">{logo.name}</span>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-12">
            {[
              { value: '$10,000+', label: 'Total value unlocked' },
              { value: '2,000+', label: 'Founders trust us' },
              { value: '50+', label: 'SaaS deals available' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED DEALS ── */}
      <section className="py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-100 text-violet-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
              <Zap className="w-3 h-3 fill-current" /> Top Deals
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 tracking-tight">Featured Deals</h2>
            <p className="text-gray-500 text-lg">Hand-picked offers to accelerate your startup</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredDeals.map((deal: any) => <DealCard key={deal.slug} deal={deal} />)}
          </div>
          <div className="text-center mt-10">
            <Link href="/offers" className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 font-semibold text-sm transition-colors">
              View all deals <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-500 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 shadow-sm">
              Simple Process
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 tracking-tight">How It Works</h2>
            <p className="text-gray-500 text-lg">Three steps to thousands in savings</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={step.step} className="relative bg-white rounded-2xl p-8 shadow-card border border-gray-100 hover:shadow-card-hover transition-shadow">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-5 shadow-sm`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xs font-bold text-gray-200 mb-2 font-mono tracking-widest">{step.step}</div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                  {i < STEPS.length - 1 && (
                    <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-gray-100 rounded-full items-center justify-center shadow-sm z-10">
                      <ArrowRight className="w-3 h-3 text-gray-400" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-100 text-violet-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
              Pricing
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 tracking-tight">Simple Pricing</h2>
            <p className="text-gray-500 text-lg">Start free. Upgrade when the math makes sense.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PRICING.map(plan => (
              <div key={plan.name} className={`relative rounded-3xl p-8 border transition-all ${
                plan.highlight
                  ? 'bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 border-transparent shadow-brand-lg'
                  : 'bg-white border-gray-100 shadow-card hover:shadow-card-hover'
              }`}>
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-white text-violet-600 text-xs font-bold px-4 py-1.5 rounded-full shadow-md">Most Popular</span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className={`text-lg font-bold mb-1 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className={`text-4xl font-bold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.price}</span>
                    <span className={`text-sm ${plan.highlight ? 'text-white/70' : 'text-gray-400'}`}>/ {plan.period}</span>
                  </div>
                  <p className={`text-sm ${plan.highlight ? 'text-white/80' : 'text-gray-500'}`}>{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlight ? 'text-white/90' : 'text-violet-500'}`} />
                      <span className={plan.highlight ? 'text-white/90' : 'text-gray-600'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className={`block text-center font-bold py-3.5 rounded-2xl transition-all duration-200 text-sm ${
                  plan.highlight
                    ? 'bg-white text-violet-600 hover:bg-gray-50 shadow-lg hover:-translate-y-0.5'
                    : 'bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 text-white shadow-md shadow-violet-200 hover:shadow-lg hover:-translate-y-0.5'
                }`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> Secure payment via Stripe. Cancel anytime.
          </p>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 tracking-tight">What Founders Say</h2>
            <p className="text-gray-500 text-lg">Join thousands of founders saving on their stack</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.author} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-xs font-bold text-white shadow-sm`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{t.author}</div>
                    <div className="text-xs text-gray-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 rounded-3xl p-12 sm:p-16 overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
                <Sparkles className="w-3.5 h-3.5" /> Join 2,000+ founders
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">Ready to save thousands?</h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Join 2,000+ founders already using SaaSOffers to stretch their runway.
              </p>
              <Link href="/signup" className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-violet-600 font-bold px-8 py-4 rounded-2xl transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 text-base">
                Get Free Access Now <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-white/60 text-xs mt-4 flex items-center justify-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Takes 30 seconds. No credit card required.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
