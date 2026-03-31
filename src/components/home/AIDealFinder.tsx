'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react'

const KEYWORD_MAP: Record<string, string> = {
  // AI & Data
  ai: 'ai-data', machine: 'ai-data', data: 'ai-data', ml: 'ai-data', analytics: 'ai-data', intelligence: 'ai-data',
  // Marketing & Growth
  marketing: 'marketing-growth', seo: 'marketing-growth', email: 'marketing-growth', growth: 'marketing-growth', ads: 'marketing-growth', campaign: 'marketing-growth',
  // Sales & CRM
  sales: 'sales-crm', crm: 'sales-crm', pipeline: 'sales-crm', leads: 'sales-crm', outreach: 'sales-crm', deals: 'sales-crm',
  // Developer & IT
  developer: 'developer-it', cloud: 'developer-it', devops: 'developer-it', infra: 'developer-it', aws: 'developer-it', hosting: 'developer-it', api: 'developer-it',
  // Operations & Productivity
  project: 'operations-productivity', productivity: 'operations-productivity', operations: 'operations-productivity', management: 'operations-productivity', team: 'operations-productivity', collaboration: 'operations-productivity',
  // Finance & Legal
  finance: 'finance-legal', legal: 'finance-legal', accounting: 'finance-legal', payroll: 'finance-legal', invoice: 'finance-legal', banking: 'finance-legal',
  // HR & People
  hr: 'hr-people', hiring: 'hr-people', people: 'hr-people', recruiting: 'hr-people', onboarding: 'hr-people',
  // Web & Design
  design: 'web-design', ui: 'web-design', ux: 'web-design', website: 'web-design', figma: 'web-design', branding: 'web-design',
}

const SUGGESTIONS = [
  'I need tools for marketing and growth',
  'Looking for a CRM and sales automation',
  'Need cloud infrastructure and DevOps tools',
  'Design tools and website builders',
]

export function AIDealFinder() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)

  const findDeals = () => {
    if (!query.trim()) return
    setLoading(true)

    const lower = query.toLowerCase()
    const words = lower.split(/\s+|,|and|for|the|a|an|with|need|want|looking/)
    const matched = new Set<string>()

    for (const word of words) {
      const slug = KEYWORD_MAP[word.trim()]
      if (slug) matched.add(slug)
    }

    setTimeout(() => {
      const matchedArray = Array.from(matched)
      if (matchedArray.length === 1) {
        router.push(`/offers/category/${matchedArray[0]}`)
      } else {
        router.push(`/offers?q=${encodeURIComponent(query.trim())}`)
      }
      setLoading(false)
    }, 600)
  }

  return (
    <section className="py-20 px-4 sm:px-6 bg-gradient-to-b from-white to-violet-50/40">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 text-xs font-bold px-4 py-1.5 rounded-full mb-5 tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
            Find the best SaaS deals<br className="hidden sm:block" /> for your startup in seconds
          </h2>
          <p className="text-gray-700 text-lg">
            Tell us what you need — we'll surface the best deals instantly.
          </p>
        </div>

        {/* Input card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-xl shadow-violet-100/40">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && findDeals()}
                placeholder="I need tools for marketing, CRM, and analytics…"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
              />
            </div>
            <button
              onClick={findDeals}
              disabled={!query.trim() || loading}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 shadow-md shadow-violet-200 hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap text-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {loading ? 'Finding deals…' : 'Get AI recommendations'}
            </button>
          </div>

          {/* Suggestions */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-gray-500 flex items-center mr-1">Try:</span>
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="text-xs text-gray-600 hover:text-violet-600 bg-gray-100 hover:bg-violet-50 border border-gray-200 hover:border-violet-200 px-3 py-1.5 rounded-full transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
