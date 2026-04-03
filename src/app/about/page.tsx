import { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight, Zap, Users, DollarSign, Clock, Heart,
  Shield, Eye, Rocket, CheckCircle2, Globe, Sparkles,
  Target, Handshake, Instagram, Linkedin,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'About SaaSOffers — The Platform We Wished Existed',
  description: 'SaaSOffers started with one frustration — watching founders burn runway on tools they could have gotten for free. Built from Morocco, serving founders worldwide.',
  alternates: { canonical: 'https://saasoffers.tech/about' },
}

const STATS = [
  { value: '2,000+', label: 'Founders', icon: Users },
  { value: '199+', label: 'Verified Deals', icon: Zap },
  { value: '$500,000+', label: 'In Credits', icon: DollarSign },
  { value: '13+', label: 'Years Building', icon: Clock },
]

const DIFFERENTIATORS = [
  {
    icon: Eye,
    title: 'We verify every deal',
    description: 'Every deal on SaaSOffers is manually verified — we check eligibility requirements, confirm credit amounts, and test application links. No dead links, no expired offers, no bait-and-switch. If a deal is listed, it works.',
  },
  {
    icon: Target,
    title: 'We write the content founders need',
    description: 'Every deal page has 1,500+ words of original content — what the tool does, who it is for, how to claim, comparison tables, and real use cases. Not marketing copy from the vendor. Honest information written for founders making stack decisions.',
  },
  {
    icon: Handshake,
    title: 'We charge founders, not vendors',
    description: 'Our business model is simple: founders pay $79/year for Premium access. We do not sell founder data to vendors, we do not charge vendors for placement, and we do not take commissions on deal claims. Our incentive is aligned with yours — better deals for founders.',
  },
]

const VALUES = [
  {
    icon: Shield,
    title: 'Transparency over marketing',
    description: 'Every deal shows the real credit amount, real eligibility requirements, and real limitations. We published an honest breakdown of our own Premium plan — including what we would change.',
  },
  {
    icon: Heart,
    title: 'Founders first, always',
    description: 'Decisions are made by asking one question: does this help founders save money and build faster? If the answer is no, we do not build it.',
  },
  {
    icon: Rocket,
    title: 'Ship fast, improve constantly',
    description: 'We add new deals weekly, publish SEO-optimized guides, and improve the platform based on founder feedback. The platform you see today is better than yesterday and worse than tomorrow.',
  },
  {
    icon: Globe,
    title: 'Global from day one',
    description: 'Built from Morocco, serving founders worldwide. Most deals on SaaSOffers are available globally — bootstrapped founders, solo developers, and international teams are welcome.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <section className="relative pt-28 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-violet-400 rounded-full blur-[130px] opacity-[0.06]" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-pink-400 rounded-full blur-[130px] opacity-[0.05]" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-100 text-violet-700 text-xs font-semibold px-4 py-2 rounded-full mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            Our story
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
            We built the platform we
            <span className="gradient-text"> wished existed</span>
          </h1>

          <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            SaaSOffers started with one frustration — watching founders burn runway on tools they could have gotten for free.
          </p>
        </div>
      </section>

      {/* ── FOUNDER STORY ── */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-8">The Story Behind SaaSOffers</h2>

          <div className="space-y-5 text-[17px] text-gray-700 leading-relaxed">
            <p>
              In 2024, I was helping a friend launch his first startup. He had a solid product idea, a small team, and $30,000 in savings. Within three months, $4,800 of that was going to SaaS tools — AWS for infrastructure, Slack for communication, Mixpanel for analytics, Notion for docs. All at full price.
            </p>
            <p>
              Then an investor casually mentioned: "You know most of these have free startup programs, right?"
            </p>
            <p>
              That one sentence changed everything. Over the next two weeks, we claimed $23,000 in startup credits from tools he was already paying for. AWS Activate gave him $5,000. Mixpanel gave him $50,000 (more than he would ever use). Notion and Slack were free for startups. His monthly SaaS bill went from $4,800 to nearly zero.
            </p>
            <p>
              The frustrating part was not that these programs existed — it was that nobody told him. No centralized place listed them. No one verified which were still active. Eligibility requirements were scattered across dozens of vendor websites. Founders were leaving tens of thousands of dollars on the table because the information was fragmented and hard to find.
            </p>
            <p>
              SaaSOffers exists to fix that. One platform. Every startup deal. Verified, organized, and explained in plain language — so that no founder pays full price for a tool that would have been free if they had known where to look.
            </p>
          </div>

          {/* Founder attribution */}
          <div className="mt-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              I
            </div>
            <div>
              <p className="font-bold text-gray-900">Ilyas</p>
              <p className="text-sm text-gray-600">Founder, SaaSOffers</p>
              <p className="text-sm text-gray-500 mt-0.5">Built from Morocco, serving founders worldwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── NUMBERS ── */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {STATS.map(stat => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 text-violet-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-6">Our Mission</h2>
          <div className="space-y-5 text-[17px] text-gray-700 leading-relaxed">
            <p>
              Every startup deserves access to the best tools — regardless of funding status, location, or connections. The fact that a YC-backed startup in San Francisco gets $500,000 in free credits while a bootstrapped founder in Casablanca pays full price for the same tools is not a feature of the system. It is a bug.
            </p>
            <p>
              SaaSOffers exists to democratize access to startup deals. We aggregate every available startup program, verify eligibility requirements, and make them accessible through one platform — free deals for everyone, premium deals for $79/year. No VC required. No accelerator required. No Bay Area address required.
            </p>
            <p>
              Our goal is simple: by the time you finish setting up your startup, your SaaS stack should cost close to zero — funded by the credit programs that SaaS companies created specifically for founders like you.
            </p>
          </div>
        </div>
      </section>

      {/* ── WHAT WE DO DIFFERENTLY ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-12 text-center">What We Do Differently</h2>
          <div className="space-y-8">
            {DIFFERENTIATORS.map(d => {
              const Icon = d.icon
              return (
                <div key={d.title} className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{d.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{d.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-12 text-center">What We Stand For</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {VALUES.map(v => {
              const Icon = v.icon
              return (
                <div key={v.title} className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm">
                  <div className="w-11 h-11 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-violet-600" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{v.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{v.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-10 text-center">Who We Are</h2>

          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                I
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">Ilyas</h3>
                <p className="text-violet-600 font-semibold text-sm mb-3">Founder & Builder</p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Builder with 13+ years of experience across software engineering, product development, and startup operations. Started SaaSOffers after realizing that the startup deal ecosystem was fragmented, outdated, and inaccessible to most founders — especially those outside Silicon Valley. Now focused on making every startup deal discoverable, verified, and claimable from anywhere in the world.
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Based in Morocco. Building for founders worldwide.
                </p>

                {/* Social links */}
                <div className="flex items-center gap-3">
                  <a
                    href="https://www.instagram.com/lemilyas/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    Instagram
                  </a>
                  <a
                    href="https://www.linkedin.com/in/lemzouri-ilyas/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-violet-600 to-pink-500 rounded-3xl p-10 sm:p-14 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to save on your stack?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Join 2,000+ founders who use SaaSOffers to access $500,000+ in startup credits. Free to start. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/offers"
                className="inline-flex items-center justify-center gap-2 bg-white text-violet-600 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-base"
              >
                <Zap className="w-4 h-4" fill="currentColor" />
                Browse 199+ Free Deals <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-all text-base border border-white/20"
              >
                Upgrade to Premium
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
