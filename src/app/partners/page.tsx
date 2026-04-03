import { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight, CheckCircle2, Users, BarChart3, Zap,
  Globe, TrendingUp, Shield, Sparkles, Building2,
  Mail, Send,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Partner With Us — List Your SaaS on SaaSOffers',
  description: 'Get your SaaS product in front of 2,000+ early-stage startup founders. Apply to list your startup deal on SaaSOffers and acquire customers at zero cost.',
  alternates: { canonical: 'https://saasoffers.tech/partners' },
}

const BENEFITS = [
  {
    icon: Users,
    title: '2,000+ startup founders',
    description: 'Your deal reaches early-stage founders actively building their tech stack — the highest-intent audience for SaaS products.',
  },
  {
    icon: BarChart3,
    title: 'Zero customer acquisition cost',
    description: 'Listing your deal on SaaSOffers is free. No placement fees, no CPM, no CPC. You pay nothing until a startup becomes your customer.',
  },
  {
    icon: TrendingUp,
    title: 'Long-term customer retention',
    description: 'Startups that adopt your product through credits have 3x higher retention than trial users — they build workflows around your tool during the free period.',
  },
  {
    icon: Globe,
    title: 'SEO-optimized deal page',
    description: 'Every partner gets a dedicated, SEO-optimized deal page with rich content, FAQs, and comparison tables that rank on Google for "[your brand] startup deal" searches.',
  },
  {
    icon: Shield,
    title: 'Verified deal badge',
    description: 'Your deal is marked as "Verified by SaaSOffers" — a trust signal that increases click-through and application rates from founders.',
  },
  {
    icon: Sparkles,
    title: 'Featured in blog content',
    description: 'Partners are mentioned in our SEO-optimized blog articles, startup guides, and tool comparison posts — earning backlinks and brand visibility.',
  },
]

const STATS = [
  { value: '199+', label: 'SaaS deals listed' },
  { value: '2,000+', label: 'Active founders' },
  { value: '$500K+', label: 'Total deal value' },
  { value: '13', label: 'SEO blog articles' },
]

const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'Submit your deal',
    description: 'Fill out the partner application with your product details, credit amount, and eligibility requirements. Takes under 5 minutes.',
  },
  {
    step: '2',
    title: 'We review and verify',
    description: 'Our team verifies the deal terms, creates your SEO-optimized deal page with rich content, FAQs, and comparison tables.',
  },
  {
    step: '3',
    title: 'Go live to founders',
    description: 'Your deal goes live on SaaSOffers, visible to 2,000+ founders. We promote it in relevant blog content and category pages.',
  },
  {
    step: '4',
    title: 'Startups claim your deal',
    description: 'Qualified founders apply for your startup program through SaaSOffers. You receive warm leads who have already expressed interest in your product.',
  },
]

const PARTNER_TYPES = [
  {
    icon: Building2,
    title: 'SaaS Companies',
    description: 'List your startup program, free tier, or credit offer. Get in front of founders when they are choosing their stack.',
    examples: 'Cloud providers, developer tools, analytics, CRM, HR, marketing tools',
  },
  {
    icon: Zap,
    title: 'Infrastructure Providers',
    description: 'Cloud credits, hosting credits, and infrastructure deals are the most claimed offers on SaaSOffers. High demand, high conversion.',
    examples: 'Cloud hosting, databases, CDN, serverless, monitoring, security',
  },
  {
    icon: TrendingUp,
    title: 'Growth & Marketing Tools',
    description: 'Ad credits, email marketing deals, and SEO tool discounts reach founders actively investing in customer acquisition.',
    examples: 'Advertising platforms, email tools, SEO, social media, analytics',
  },
]

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <section className="relative pt-28 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-violet-400 rounded-full blur-[130px] opacity-[0.06]" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-emerald-400 rounded-full blur-[130px] opacity-[0.05]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold px-4 py-2 rounded-full mb-8">
            <Building2 className="w-3.5 h-3.5" />
            For SaaS companies
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
            Get your product in front of
            <span className="gradient-text"> 2,000+ startup founders</span>
          </h1>

          <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            List your startup deal on SaaSOffers and acquire early-stage customers who build their
            entire stack on your platform. Free to list. No fees. Just qualified founders.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#apply"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 text-white font-semibold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-violet-200 hover:shadow-xl hover:-translate-y-0.5 text-base"
            >
              Apply to list your deal <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium px-8 py-4 rounded-2xl transition-all text-base"
            >
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-gray-900">{s.value}</div>
                <div className="text-sm text-gray-600 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY PARTNER ── */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
              Why SaaS companies partner with us
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Every major SaaS company runs a startup program. SaaSOffers makes yours visible to the founders who need it most.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map(b => {
              const Icon = b.icon
              return (
                <div key={b.title} className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-11 h-11 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center mb-5">
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

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
              How it works
            </h2>
            <p className="text-gray-600 text-lg">
              From application to live deal in under a week.
            </p>
          </div>

          <div className="space-y-6">
            {HOW_IT_WORKS.map(step => (
              <div key={step.step} className="flex items-start gap-6 bg-white border border-gray-100 rounded-2xl p-7 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-violet-600 text-white text-lg font-bold flex items-center justify-center flex-shrink-0">
                  {step.step}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO SHOULD PARTNER ── */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
              Who should partner with SaaSOffers?
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {PARTNER_TYPES.map(t => {
              const Icon = t.icon
              return (
                <div key={t.title} className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{t.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">{t.description}</p>
                  <p className="text-xs text-gray-500 font-medium">{t.examples}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CURRENT PARTNERS ── */}
      <section className="py-16 px-4 sm:px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-500 font-semibold uppercase tracking-widest mb-6">Trusted by 199+ SaaS companies including</p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {['AWS', 'Google Cloud', 'OpenAI', 'Anthropic', 'Vercel', 'Supabase', 'Twilio', 'Segment', 'Datadog', 'HubSpot', 'Notion', 'Figma', 'Stripe', 'Chargebee', 'MongoDB', 'Mixpanel'].map(name => (
              <span key={name} className="text-gray-400 font-semibold text-sm">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPLICATION FORM ── */}
      <section id="apply" className="py-24 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
              Apply to list your deal
            </h2>
            <p className="text-gray-600 text-lg">
              Takes under 5 minutes. We review applications within 48 hours.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-10 shadow-md">
            <form
              action="https://formspree.io/f/xjkvqpwz"
              method="POST"
              className="space-y-6"
            >
              {/* Company Name */}
              <div>
                <label htmlFor="company" className="block text-sm font-semibold text-gray-800 mb-2">
                  Company name *
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  required
                  placeholder="e.g. Acme Cloud"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-gray-400"
                />
              </div>

              {/* Website */}
              <div>
                <label htmlFor="website" className="block text-sm font-semibold text-gray-800 mb-2">
                  Website URL *
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  required
                  placeholder="https://acmecloud.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-gray-400"
                />
              </div>

              {/* Contact Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
                  Contact email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="partnerships@acmecloud.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-gray-400"
                />
              </div>

              {/* Contact Name */}
              <div>
                <label htmlFor="contact_name" className="block text-sm font-semibold text-gray-800 mb-2">
                  Your name *
                </label>
                <input
                  type="text"
                  id="contact_name"
                  name="contact_name"
                  required
                  placeholder="Jane Smith"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-gray-400"
                />
              </div>

              {/* Product Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-gray-800 mb-2">
                  Product category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-gray-700"
                >
                  <option value="">Select a category</option>
                  <option value="Cloud & Infrastructure">Cloud & Infrastructure</option>
                  <option value="Developer Tools">Developer Tools</option>
                  <option value="AI Tools">AI / Machine Learning</option>
                  <option value="Analytics">Analytics & Data</option>
                  <option value="Marketing">Marketing & Growth</option>
                  <option value="Sales & CRM">Sales & CRM</option>
                  <option value="HR & Payroll">HR & People</option>
                  <option value="Finance & Legal">Finance & Legal</option>
                  <option value="Productivity">Productivity & Operations</option>
                  <option value="Design">Design & Creative</option>
                  <option value="Customer Support">Customer Support</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Deal Description */}
              <div>
                <label htmlFor="deal" className="block text-sm font-semibold text-gray-800 mb-2">
                  Describe your startup deal *
                </label>
                <textarea
                  id="deal"
                  name="deal"
                  required
                  rows={4}
                  placeholder="e.g. $5,000 in cloud credits for startups under 2 years old, pre-Series B. New accounts only. Credits valid for 12 months."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-gray-400 resize-none"
                />
                <p className="text-xs text-gray-500 mt-1.5">Include: credit amount, eligibility requirements, and any restrictions.</p>
              </div>

              {/* Deal Value */}
              <div>
                <label htmlFor="value" className="block text-sm font-semibold text-gray-800 mb-2">
                  Estimated deal value *
                </label>
                <input
                  type="text"
                  id="value"
                  name="value"
                  required
                  placeholder="e.g. $5,000 in credits / 6 months free / 50% off"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-gray-400"
                />
              </div>

              {/* Existing Startup Program */}
              <div>
                <label htmlFor="program_url" className="block text-sm font-semibold text-gray-800 mb-2">
                  Existing startup program URL (if any)
                </label>
                <input
                  type="url"
                  id="program_url"
                  name="program_url"
                  placeholder="https://acmecloud.com/startups"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-gray-400"
                />
              </div>

              {/* Additional Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-semibold text-gray-800 mb-2">
                  Anything else we should know?
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  placeholder="Special terms, affiliate structure, partnership ideas..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-gray-400 resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 text-white font-semibold py-4 rounded-xl transition-all shadow-md shadow-violet-200 hover:shadow-lg text-sm"
              >
                <Send className="w-4 h-4" />
                Submit partner application
              </button>

              <p className="text-center text-xs text-gray-500">
                We review applications within 48 hours and respond to every submission.
              </p>
            </form>
          </div>

          {/* Direct contact alternative */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Prefer email? Reach us directly at{' '}
              <a href="mailto:ilyas@saasoffers.tech" className="text-violet-600 font-semibold hover:underline">
                ilyas@saasoffers.tech
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-4 sm:px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Partner FAQ</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Is it free to list my deal on SaaSOffers?',
                a: 'Yes. Listing your startup deal is completely free. There are no placement fees, monthly charges, or per-click costs. We earn revenue from our startup-facing Premium subscription, not from partners.',
              },
              {
                q: 'What kind of deals can I list?',
                a: 'Any startup-relevant offer: free credits, extended free plans, percentage discounts, free months of service, or special startup pricing. The deal should provide genuine value to early-stage companies.',
              },
              {
                q: 'How many startups will see my deal?',
                a: 'SaaSOffers has 2,000+ active startup founders. Your deal page is also indexed by Google and ranks for "[your brand] startup deal" searches, driving organic traffic beyond our existing user base.',
              },
              {
                q: 'How long does the review process take?',
                a: 'We review partner applications within 48 hours. If approved, your deal page goes live within 3–5 business days with full SEO content, FAQs, and comparison tables.',
              },
              {
                q: 'Can I update my deal terms after listing?',
                a: 'Yes. Email us at ilyas@saasoffers.tech to update credit amounts, eligibility requirements, or any other deal details. We update the deal page within 24 hours.',
              },
              {
                q: 'Do you offer featured or promoted placements?',
                a: 'Yes. Featured deals appear at the top of category pages and in our homepage featured section. Contact us at ilyas@saasoffers.tech to discuss featured placement options.',
              },
            ].map(faq => (
              <div key={faq.q} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-violet-600 to-pink-500 rounded-3xl p-10 sm:p-14 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to reach 2,000+ startup founders?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Join 199+ SaaS companies that list their startup deals on SaaSOffers. Free to list. No strings attached.
            </p>
            <a
              href="#apply"
              className="inline-flex items-center gap-2 bg-white text-violet-600 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-base"
            >
              Apply now <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
