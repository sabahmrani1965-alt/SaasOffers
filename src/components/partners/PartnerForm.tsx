'use client'

import { useState } from 'react'
import { Send, CheckCircle2 } from 'lucide-react'

export function PartnerForm() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const body = Object.fromEntries(formData.entries())

    try {
      const res = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Submission failed')
      }

      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    }

    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-10 shadow-md text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Application received!</h3>
        <p className="text-gray-600">We will review your application within 48 hours and get back to you at the email you provided.</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-10 shadow-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Name */}
        <div>
          <label htmlFor="company" className="block text-sm font-semibold text-gray-800 mb-2">Company name *</label>
          <input type="text" id="company" name="company" required placeholder="e.g. Acme Cloud"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-gray-400" />
        </div>

        {/* Website */}
        <div>
          <label htmlFor="website" className="block text-sm font-semibold text-gray-800 mb-2">Website URL *</label>
          <input type="url" id="website" name="website" required placeholder="https://acmecloud.com"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-gray-400" />
        </div>

        {/* Contact Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">Contact email *</label>
          <input type="email" id="email" name="email" required placeholder="partnerships@acmecloud.com"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-gray-400" />
        </div>

        {/* Contact Name */}
        <div>
          <label htmlFor="contact_name" className="block text-sm font-semibold text-gray-800 mb-2">Your name *</label>
          <input type="text" id="contact_name" name="contact_name" required placeholder="Jane Smith"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-gray-400" />
        </div>

        {/* Product Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-gray-800 mb-2">Product category *</label>
          <select id="category" name="category" required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-gray-700">
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
          <label htmlFor="deal" className="block text-sm font-semibold text-gray-800 mb-2">Describe your startup deal *</label>
          <textarea id="deal" name="deal" required rows={4}
            placeholder="e.g. $5,000 in cloud credits for startups under 2 years old, pre-Series B. New accounts only. Credits valid for 12 months."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-gray-400 resize-none" />
          <p className="text-xs text-gray-500 mt-1.5">Include: credit amount, eligibility requirements, and any restrictions.</p>
        </div>

        {/* Deal Value */}
        <div>
          <label htmlFor="value" className="block text-sm font-semibold text-gray-800 mb-2">Estimated deal value *</label>
          <input type="text" id="value" name="value" required placeholder="e.g. $5,000 in credits / 6 months free / 50% off"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-gray-400" />
        </div>

        {/* Existing Startup Program */}
        <div>
          <label htmlFor="program_url" className="block text-sm font-semibold text-gray-800 mb-2">Existing startup program URL (if any)</label>
          <input type="url" id="program_url" name="program_url" placeholder="https://acmecloud.com/startups"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-gray-400" />
        </div>

        {/* Additional Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-semibold text-gray-800 mb-2">Anything else we should know?</label>
          <textarea id="notes" name="notes" rows={3} placeholder="Special terms, affiliate structure, partnership ideas..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-gray-400 resize-none" />
        </div>

        {error && (
          <p className="text-sm text-red-600 font-medium bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
        )}

        {/* Submit */}
        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 text-white font-semibold py-4 rounded-xl transition-all shadow-md shadow-violet-200 hover:shadow-lg text-sm disabled:opacity-60">
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          {loading ? 'Submitting...' : 'Submit partner application'}
        </button>

        <p className="text-center text-xs text-gray-500">
          We review applications within 48 hours and respond to every submission.
        </p>
      </form>
    </div>
  )
}
