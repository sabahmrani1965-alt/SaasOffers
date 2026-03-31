'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Deal } from '@/types'
import { User } from '@supabase/supabase-js'
import { CheckCircle2, ArrowRight, Building2, Globe, Mail, Users, Zap, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { trackEvent } from '@/components/Analytics'

interface ApplyFormProps {
  deal: Deal
  user: User
}

const FREE_EMAIL_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com', 'protonmail.com']

const FUNDING_STAGES = [
  { value: 'pre-seed', label: 'Pre-seed' },
  { value: 'seed', label: 'Seed' },
  { value: 'series-a', label: 'Series A' },
  { value: 'bootstrapped', label: 'Bootstrapped' },
  { value: 'series-b+', label: 'Series B+' },
]

const TEAM_SIZES = [
  { value: '1-5', label: '1–5 people' },
  { value: '6-15', label: '6–15 people' },
  { value: '16-50', label: '16–50 people' },
  { value: '50+', label: '50+ people' },
]

export function ApplyForm({ deal, user }: ApplyFormProps) {
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    company_name: '',
    website: '',
    company_email: '',
    funding_stage: '',
    team_size: '',
    use_case: '',
  })

  function isBusinessEmail(email: string) {
    const domain = email.split('@')[1]?.toLowerCase()
    return domain && !FREE_EMAIL_DOMAINS.includes(domain)
  }

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.company_name.trim()) return setError('Company name is required.')
    if (!form.website.trim()) return setError('Company website is required.')
    if (!form.company_email.trim()) return setError('Business email is required.')
    if (!isBusinessEmail(form.company_email)) return setError('Please use your business email address (not Gmail, Yahoo, etc.).')
    if (!form.funding_stage) return setError('Please select your funding stage.')
    if (!form.team_size) return setError('Please select your team size.')

    setLoading(true)
    try {
      const supabase = createClient()
      const { error: err } = await supabase.from('offer_applications').insert({
        user_id: user.id,
        deal_id: deal.id,
        company_name: form.company_name,
        website: form.website,
        company_email: form.company_email,
        funding_stage: form.funding_stage,
        team_size: form.team_size,
        use_case: form.use_case,
        status: 'pending',
      })
      if (err) {
        if (err.code === '23505') return setError('You have already applied for this deal.')
        throw err
      }

      trackEvent('offer_applied', 'offers', deal.slug, deal.value)
      setStep('success')
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'success') {
    return (
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <p className="text-gray-900 font-bold text-base">Application Submitted!</p>
          <p className="text-gray-500 text-sm mt-1 leading-relaxed">
            We'll verify your eligibility and send you a discount link within <strong className="text-gray-700">24–48 hours</strong>.
          </p>
        </div>
        <div className="pt-2 space-y-2 text-left">
          {['Check your inbox for a confirmation email', 'Our team will review your application', 'You\'ll receive the discount link directly'].map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 text-xs font-bold text-emerald-600">{i + 1}</div>
              {s}
            </div>
          ))}
        </div>
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-violet-600 font-semibold hover:text-violet-700 transition-colors pt-2">
          View in Dashboard <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Company name */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          Company Name <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={form.company_name}
            onChange={e => set('company_name', e.target.value)}
            placeholder="Acme Inc."
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
          />
        </div>
      </div>

      {/* Website */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          Company Website <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={form.website}
            onChange={e => set('website', e.target.value)}
            placeholder="https://yourcompany.com"
            type="url"
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
          />
        </div>
      </div>

      {/* Business email */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          Business Email <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={form.company_email}
            onChange={e => set('company_email', e.target.value)}
            placeholder="you@yourcompany.com"
            type="email"
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">Business email required — no Gmail/Yahoo.</p>
      </div>

      {/* Funding stage + team size side by side */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Funding Stage <span className="text-red-400">*</span>
          </label>
          <select
            value={form.funding_stage}
            onChange={e => set('funding_stage', e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all appearance-none"
          >
            <option value="">Select…</option>
            {FUNDING_STAGES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Team Size <span className="text-red-400">*</span>
          </label>
          <select
            value={form.team_size}
            onChange={e => set('team_size', e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all appearance-none"
          >
            <option value="">Select…</option>
            {TEAM_SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* Use case (optional) */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          How will you use {deal.name}? <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={form.use_case}
          onChange={e => set('use_case', e.target.value)}
          placeholder="e.g. We're looking to replace our current CRM and automate our email outreach…"
          rows={2}
          className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all resize-none"
        />
      </div>

      {error && (
        <p className="text-xs text-red-600 font-medium bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 text-white font-semibold py-3 rounded-xl transition-all text-sm shadow-md shadow-violet-200 disabled:opacity-60"
      >
        {loading ? (
          <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Submitting…</>
        ) : (
          <>Apply for {deal.name} <ArrowRight className="w-4 h-4" /></>
        )}
      </button>

      <p className="text-center text-xs text-gray-400">
        Takes 2 min · Reviewed within 48 hours · No spam
      </p>
    </form>
  )
}
