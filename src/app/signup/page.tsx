'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { GoogleButton } from '@/components/auth/GoogleButton'
import { Zap, Mail, Lock, CheckCircle2 } from 'lucide-react'

function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan')
  const refCode = searchParams.get('ref')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    if (err) { setError(err.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('users').upsert({ id: data.user.id, email: data.user.email, is_premium: false })
      await fetch('/api/auth/welcome', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })

      // Apply referral if ref code present
      if (refCode) {
        await fetch('/api/referrals/apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ referral_code: refCode, new_user_id: data.user.id, new_user_email: email }),
        })
      }
    }
    if (plan === 'premium' && data.user) {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const { url } = await res.json()
      if (url) { window.location.href = url; return }
    }
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/30 flex items-center justify-center px-4 pt-16">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
          <p className="text-gray-900 text-sm font-medium mb-6">We sent a confirmation link to <strong>{email}</strong>.</p>
          <Link href="/login" className="text-violet-600 font-semibold hover:text-violet-700 text-sm transition-colors">Back to login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/30 flex items-center justify-center px-4 pt-16 pb-8">
      <div className="w-full max-w-md sm:max-w-lg">
        <div className="bg-white border border-gray-100 rounded-2xl p-8 sm:p-10 shadow-xl shadow-gray-100/80">

          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center shadow-md shadow-violet-200 group-hover:shadow-violet-300 transition-all">
                <Zap className="w-5 h-5 text-white" fill="white" />
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {plan === 'premium' ? 'Start Premium' : 'Get free access'}
            </h1>
            <p className="text-gray-900 text-base mt-2 font-medium">
              {plan === 'premium' ? 'Create your account, then upgrade to Premium' : 'Join 1,000+ startups saving on top SaaS tools'}
            </p>
          </div>

          {/* Google */}
          <GoogleButton label="Sign up with Google" refCode={refCode || undefined} />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-xs text-gray-700 font-medium">
              <span className="bg-white px-3">or sign up with email</span>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {['Free forever', 'No spam', '50+ deals'].map(b => (
              <span key={b} className="text-xs text-gray-900 font-semibold bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full">✓ {b}</span>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@startup.com"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Min. 8 characters"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 font-medium bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
            )}

            <Button type="submit" loading={loading} className="w-full justify-center py-3 text-base" size="lg">
              {plan === 'premium' ? 'Create Account & Upgrade' : 'Create Free Account'}
            </Button>
          </form>

          <p className="text-center text-xs text-gray-700 font-medium mt-5">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="text-gray-900 font-semibold hover:text-violet-600 transition-colors">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-gray-900 font-semibold hover:text-violet-600 transition-colors">Privacy Policy</Link>
          </p>
          <p className="text-center text-sm text-gray-900 font-medium mt-3">
            Already have an account?{' '}
            <Link href="/login" className="text-violet-600 font-semibold hover:text-violet-700 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-6 h-6 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" /></div>}>
      <SignupForm />
    </Suspense>
  )
}
