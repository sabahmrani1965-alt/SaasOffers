import { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight, Gift, DollarSign, Users, Share2,
  CheckCircle2, Sparkles, Zap, TrendingUp, Shield,
  Copy, ChevronRight,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Affiliate Program — Earn $30 Per Referral | SaaSOffers',
  description: 'Join the SaaSOffers affiliate program. Share your unique link, earn $30 for every friend who upgrades to Premium. Withdraw to PayPal or your bank account.',
  alternates: { canonical: 'https://saasoffers.tech/affiliates' },
}

const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'Sign up and get your link',
    description: 'Create a free SaaSOffers account. Your unique referral link is generated automatically in your dashboard.',
    icon: Share2,
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    step: '2',
    title: 'Share with your audience',
    description: 'Share your link on social media, your blog, newsletter, YouTube, community, or directly with friends. No limits on how you promote.',
    icon: Users,
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    step: '3',
    title: 'Your friend gets $30 off',
    description: 'When someone signs up through your link and upgrades to Premium, they automatically get $30 off — paying just $49 instead of $79.',
    icon: Gift,
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    step: '4',
    title: 'You earn $30 cash',
    description: 'Once your referral upgrades, $30 is added to your credits. Withdraw anytime to PayPal or your bank account. No minimum payout threshold hassle.',
    icon: DollarSign,
    gradient: 'from-emerald-500 to-teal-600',
  },
]

const BENEFITS = [
  {
    icon: DollarSign,
    title: '$30 per conversion',
    description: 'Earn $30 in cash for every person who upgrades to Premium through your link. Not credits, not discounts — real money.',
  },
  {
    icon: Gift,
    title: 'Your friends save too',
    description: 'Every referral gets $30 off Premium automatically. You are not just promoting — you are giving your audience a genuine deal.',
  },
  {
    icon: TrendingUp,
    title: 'No earning cap',
    description: 'Refer 10 people, earn $300. Refer 100, earn $3,000. There is no cap on how much you can earn.',
  },
  {
    icon: Shield,
    title: 'Instant payout',
    description: 'Withdraw your earnings anytime via PayPal or bank transfer. No waiting 60 days, no complicated approval process.',
  },
  {
    icon: Users,
    title: 'Real-time tracking',
    description: 'See who signed up, who upgraded, and how much you have earned — all from your dashboard in real-time.',
  },
  {
    icon: Zap,
    title: 'Promote what you believe in',
    description: 'SaaSOffers gives startups access to $500,000+ in credits. You are helping founders save money on tools they actually need.',
  },
]

const WHO_IS_THIS_FOR = [
  { title: 'Startup founders', description: 'Share with other founders in your network, accelerator cohort, or community.' },
  { title: 'Content creators', description: 'Tech YouTubers, bloggers, and newsletter writers covering startup tools and SaaS.' },
  { title: 'Community leaders', description: 'Slack, Discord, and WhatsApp group admins for founder and developer communities.' },
  { title: 'Freelancers and agencies', description: 'Recommend SaaSOffers to your clients who are building startups.' },
  { title: 'Twitter/X and LinkedIn creators', description: 'Share your link in threads, posts, and DMs about startup resources.' },
  { title: 'Anyone who knows founders', description: 'You do not need a huge audience. One referral earns you $30.' },
]

const FAQ = [
  {
    q: 'How much do I earn per referral?',
    a: 'You earn $30 for every person who signs up through your link and upgrades to Premium ($79/year). Your referral also gets $30 off.',
  },
  {
    q: 'How do I get paid?',
    a: 'Earnings are added to your dashboard credits. You can withdraw anytime via PayPal or bank transfer from your Referrals dashboard.',
  },
  {
    q: 'Is there a minimum payout?',
    a: 'The minimum payout is $30 — which is just one successful referral.',
  },
  {
    q: 'How do I get my referral link?',
    a: 'Sign up for a free SaaSOffers account and go to Dashboard > Referrals. Your unique link is generated automatically.',
  },
  {
    q: 'Do I need to be a Premium member to refer?',
    a: 'No. Any SaaSOffers user — free or Premium — can share their referral link and earn commissions.',
  },
  {
    q: 'Is there a limit on how many people I can refer?',
    a: 'No. Refer as many people as you want. There is no cap on earnings.',
  },
  {
    q: 'When do I get credited?',
    a: 'Your $30 credit is added the moment your referral completes their Premium upgrade. No waiting period.',
  },
  {
    q: 'Can I promote on social media?',
    a: 'Yes. Share your link anywhere — social media, blogs, newsletters, YouTube, podcasts, communities, or directly with friends.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(f => ({
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
    { '@type': 'ListItem', position: 2, name: 'Affiliate Program', item: 'https://saasoffers.tech/affiliates' },
  ],
}

export default function AffiliatesPage() {
  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* ── HERO ── */}
      <section className="relative pt-28 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-violet-400 rounded-full blur-[130px] opacity-[0.06]" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-emerald-400 rounded-full blur-[130px] opacity-[0.05]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold px-4 py-2 rounded-full mb-8">
            <Gift className="w-3.5 h-3.5" />
            Affiliate Program
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
            Give $30, Get
            <span className="gradient-text"> $30 Cash</span>
          </h1>

          <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Share SaaSOffers with founders. When they upgrade to Premium, they save $30 and you earn $30 in real cash. No cap on earnings. Withdraw anytime.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-violet-200 hover:shadow-xl hover:-translate-y-0.5 transition-all text-base"
            >
              <Zap className="w-4 h-4" fill="currentColor" />
              Get Your Referral Link <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-violet-300 text-gray-900 hover:text-violet-600 font-semibold px-8 py-4 rounded-xl transition-all text-base"
            >
              Already a member? Log in
            </Link>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-12 pt-8 border-t border-gray-100">
            {[
              { value: '$30', label: 'per referral' },
              { value: '$0', label: 'to join' },
              { value: 'Instant', label: 'payouts' },
              { value: 'No cap', label: 'on earnings' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                <div className="text-sm text-gray-600 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
              How it works
            </h2>
            <p className="text-gray-600 text-lg">Four steps. Five minutes. Start earning.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={step.step} className="relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-4 shadow-md`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Step {step.step}</div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                  {i < HOW_IT_WORKS.length - 1 && (
                    <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-gray-100 rounded-full items-center justify-center shadow-sm z-10">
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── EARNINGS CALCULATOR ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-violet-600 to-pink-500 rounded-3xl p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">See what you could earn</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { referrals: 5, earnings: 150, label: 'Casual sharing' },
                { referrals: 20, earnings: 600, label: 'Active promoter' },
                { referrals: 100, earnings: 3000, label: 'Affiliate pro' },
              ].map(tier => (
                <div key={tier.referrals} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center">
                  <div className="text-4xl font-bold text-white mb-1">${tier.earnings.toLocaleString()}</div>
                  <div className="text-white/70 text-sm mb-3">{tier.referrals} referrals</div>
                  <div className="text-xs font-semibold text-white/50 uppercase tracking-wider">{tier.label}</div>
                </div>
              ))}
            </div>
            <p className="text-center text-white/60 text-sm mt-6">
              $30 per referral. No cap. Withdraw anytime.
            </p>
          </div>
        </div>
      </section>

      {/* ── WHY JOIN ── */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-12 text-center">
            Why affiliates love SaaSOffers
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map(b => {
              const Icon = b.icon
              return (
                <div key={b.title} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <div className="w-11 h-11 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-violet-600" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{b.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{b.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── WHO IS THIS FOR ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-10 text-center">
            Who is this for?
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {WHO_IS_THIS_FOR.map(item => (
              <div key={item.title} className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-xl p-5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-0.5">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 text-[15px] mb-2">{item.q}</h3>
                <p className="text-gray-600 text-[15px] leading-relaxed">{item.a}</p>
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
              Start earning today
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Create a free account, grab your referral link, and start sharing. Your first $30 is one referral away.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-white text-violet-600 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-base"
              >
                <Gift className="w-4 h-4" />
                Join the Affiliate Program <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-white/50 text-sm mt-6">
              Free to join. No application needed. Start in 2 minutes.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
