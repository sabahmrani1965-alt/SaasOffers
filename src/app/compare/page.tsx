import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowRight, ArrowLeftRight, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Compare SaaS Tools — Side by Side for Startups',
  description: 'Compare SaaS tools side by side — features, pricing, startup deals, and which one is right for your startup. Unbiased comparisons backed by real data.',
  alternates: { canonical: 'https://saasoffers.tech/compare' },
}

const POPULAR_COMPARISONS = [
  // Cloud
  { a: 'aws-activate', b: 'google-cloud', label: 'AWS vs Google Cloud' },
  { a: 'aws-activate', b: 'digitalocean', label: 'AWS vs DigitalOcean' },
  { a: 'vercel', b: 'render', label: 'Vercel vs Render' },
  { a: 'render', b: 'railway', label: 'Render vs Railway' },
  { a: 'supabase', b: 'neon', label: 'Supabase vs Neon' },
  { a: 'supabase', b: 'mongodb', label: 'Supabase vs MongoDB' },
  // AI
  { a: 'openai', b: 'anthropic', label: 'OpenAI vs Anthropic' },
  { a: 'openai', b: 'cohere', label: 'OpenAI vs Cohere' },
  { a: 'pinecone', b: 'weaviate', label: 'Pinecone vs Weaviate' },
  { a: 'cursor', b: 'replit', label: 'Cursor vs Replit' },
  // Analytics
  { a: 'mixpanel', b: 'amplitude', label: 'Mixpanel vs Amplitude' },
  { a: 'mixpanel', b: 'posthog', label: 'Mixpanel vs PostHog' },
  { a: 'hotjar', b: 'logrocket', label: 'Hotjar vs LogRocket' },
  { a: 'segment', b: 'posthog', label: 'Segment vs PostHog' },
  // Productivity
  { a: 'notion', b: 'clickup', label: 'Notion vs ClickUp' },
  { a: 'notion', b: 'airtable', label: 'Notion vs Airtable' },
  { a: 'asana', b: 'clickup', label: 'Asana vs ClickUp' },
  { a: 'asana', b: 'monday', label: 'Asana vs Monday.com' },
  { a: 'linear', b: 'jira', label: 'Linear vs Jira' },
  { a: 'slack', b: 'zoom', label: 'Slack vs Zoom' },
  // CRM & Sales
  { a: 'hubspot-for-startups', b: 'pipedrive', label: 'HubSpot vs Pipedrive' },
  { a: 'hubspot-for-startups', b: 'attio', label: 'HubSpot vs Attio' },
  { a: 'apollo', b: 'lemlist', label: 'Apollo vs Lemlist' },
  { a: 'instantly', b: 'lemlist', label: 'Instantly vs Lemlist' },
  // Email
  { a: 'sendgrid', b: 'resend', label: 'SendGrid vs Resend' },
  { a: 'mailchimp', b: 'convertkit', label: 'Mailchimp vs ConvertKit' },
  { a: 'brevo', b: 'mailchimp', label: 'Brevo vs Mailchimp' },
  { a: 'customer-io', b: 'loops', label: 'Customer.io vs Loops' },
  // Support
  { a: 'intercom', b: 'crisp', label: 'Intercom vs Crisp' },
  { a: 'zendesk', b: 'freshdesk', label: 'Zendesk vs Freshdesk' },
  // Finance
  { a: 'stripe-billing', b: 'chargebee', label: 'Stripe Billing vs Chargebee' },
  { a: 'mercury', b: 'brex', label: 'Mercury vs Brex' },
  { a: 'xero', b: 'quickbooks', label: 'Xero vs QuickBooks' },
  { a: 'paddle', b: 'lemon-squeezy', label: 'Paddle vs Lemon Squeezy' },
  // HR
  { a: 'deel', b: 'remote', label: 'Deel vs Remote' },
  { a: 'gusto', b: 'rippling', label: 'Gusto vs Rippling' },
  // Dev Tools
  { a: 'datadog', b: 'grafana-cloud', label: 'Datadog vs Grafana Cloud' },
  { a: 'sentry-pro', b: 'highlight', label: 'Sentry vs Highlight' },
  { a: 'github', b: 'gitlab', label: 'GitHub vs GitLab' },
  { a: 'clerk', b: 'auth0', label: 'Clerk vs Auth0' },
]

const CATEGORIES: Record<string, typeof POPULAR_COMPARISONS> = {}
POPULAR_COMPARISONS.forEach(c => {
  // Group by rough category
  const cat =
    ['aws-activate', 'google-cloud', 'digitalocean', 'vercel', 'render', 'railway', 'supabase', 'neon', 'mongodb'].some(s => c.a === s || c.b === s) ? 'Cloud & Infrastructure' :
    ['openai', 'anthropic', 'cohere', 'pinecone', 'weaviate', 'cursor', 'replit'].some(s => c.a === s || c.b === s) ? 'AI & Developer Tools' :
    ['mixpanel', 'amplitude', 'posthog', 'hotjar', 'logrocket', 'segment'].some(s => c.a === s || c.b === s) ? 'Analytics' :
    ['notion', 'clickup', 'asana', 'monday', 'linear', 'jira', 'airtable', 'slack', 'zoom'].some(s => c.a === s || c.b === s) ? 'Productivity' :
    ['hubspot-for-startups', 'pipedrive', 'attio', 'apollo', 'lemlist', 'instantly'].some(s => c.a === s || c.b === s) ? 'Sales & CRM' :
    ['sendgrid', 'resend', 'mailchimp', 'convertkit', 'brevo', 'customer-io', 'loops'].some(s => c.a === s || c.b === s) ? 'Email & Marketing' :
    ['intercom', 'crisp', 'zendesk', 'freshdesk'].some(s => c.a === s || c.b === s) ? 'Customer Support' :
    ['stripe-billing', 'chargebee', 'mercury', 'brex', 'xero', 'quickbooks', 'paddle', 'lemon-squeezy'].some(s => c.a === s || c.b === s) ? 'Finance & Billing' :
    ['deel', 'remote', 'gusto', 'rippling'].some(s => c.a === s || c.b === s) ? 'HR & Payroll' :
    'Developer Tools'
  if (!CATEGORIES[cat]) CATEGORIES[cat] = []
  CATEGORIES[cat].push(c)
})

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">

        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-100 text-violet-700 text-xs font-semibold px-4 py-2 rounded-full mb-6">
            <ArrowLeftRight className="w-3.5 h-3.5" />
            Side-by-side comparisons
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            Compare SaaS tools for startups
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Unbiased, side-by-side comparisons of the best SaaS tools — features, pricing, startup deals, and which one fits your stack.
          </p>
        </div>

        {/* Comparison categories */}
        {Object.entries(CATEGORIES).map(([category, comparisons]) => (
          <div key={category} className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{category}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {comparisons.map(c => (
                <Link
                  key={`${c.a}-${c.b}`}
                  href={`/compare/${c.a}-vs-${c.b}`}
                  className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-5 py-4 shadow-sm hover:shadow-md hover:border-violet-200 transition-all group"
                >
                  <ArrowLeftRight className="w-4 h-4 text-violet-400 flex-shrink-0 group-hover:text-violet-600 transition-colors" />
                  <span className="text-sm font-semibold text-gray-800 group-hover:text-violet-700 transition-colors">{c.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-300 ml-auto group-hover:text-violet-500 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="mt-14 bg-gradient-to-br from-violet-600 to-pink-500 rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Can&apos;t find your comparison?</h2>
          <p className="text-white/80 mb-6">Browse all 199+ deals and find the right tools for your startup.</p>
          <Link
            href="/offers"
            className="inline-flex items-center gap-2 bg-white text-violet-600 font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm"
          >
            <Zap className="w-4 h-4" fill="currentColor" />
            Browse all deals <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
