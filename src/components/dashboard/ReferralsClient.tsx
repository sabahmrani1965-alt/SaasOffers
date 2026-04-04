'use client'

import { useState, useEffect } from 'react'
import { Gift, Copy, Check, Users, Trophy, DollarSign, Share2, Mail, Wallet, ArrowRight } from 'lucide-react'

interface ReferralData {
  referral_code: string
  credits: number // in cents
  stats: { invited: number; signed_up: number; upgraded: number; total_earned: number }
  referrals: { id: string; status: string; email: string | null; created_at: string; rewarded_at: string | null }[]
}

export function ReferralsClient() {
  const [data, setData] = useState<ReferralData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [showPayout, setShowPayout] = useState(false)
  const [payoutMethod, setPayoutMethod] = useState('paypal')
  const [payoutDetails, setPayoutDetails] = useState('')
  const [payoutLoading, setPayoutLoading] = useState(false)
  const [payoutMessage, setPayoutMessage] = useState('')

  useEffect(() => {
    fetch('/api/referrals')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const referralLink = data ? `https://saasoffers.tech/signup?ref=${data.referral_code}` : ''
  const creditsInDollars = data ? (data.credits / 100).toFixed(2) : '0.00'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareTwitter = () => {
    const text = encodeURIComponent('I\'m using SaaSOffers to save on my startup stack. Sign up with my link and get $30 off Premium!')
    const url = encodeURIComponent(referralLink)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
  }

  const handleShareEmail = () => {
    const subject = encodeURIComponent('Get $30 off SaaSOffers Premium')
    const body = encodeURIComponent(`Hey! I've been using SaaSOffers to save on SaaS tools for my startup.\n\nSign up with my referral link and get $30 off Premium ($49 instead of $79):\n${referralLink}\n\nIt gives you access to 500+ deals worth $500,000+ in credits.`)
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  const handlePayout = async () => {
    if (!payoutDetails.trim()) return
    setPayoutLoading(true)
    try {
      const res = await fetch('/api/referrals/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: payoutMethod, details: payoutDetails.trim() }),
      })
      const result = await res.json()
      if (result.success) {
        setPayoutMessage(result.message)
        setShowPayout(false)
        setPayoutDetails('')
        // Refresh data
        const r = await fetch('/api/referrals')
        const d = await r.json()
        setData(d)
      } else {
        setPayoutMessage(result.error || 'Payout failed')
      }
    } catch {
      setPayoutMessage('Payout request failed')
    }
    setPayoutLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-8">

      {/* How it works banner */}
      <div className="bg-gradient-to-br from-violet-600 to-pink-500 rounded-2xl p-6 sm:p-8 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">Give $30, Get $30</h2>
            <p className="text-white/80 text-sm leading-relaxed max-w-xl">
              Share your referral link. When a friend upgrades to Premium, they get <strong className="text-white">$30 off</strong> and
              you earn <strong className="text-white">$30 in credits</strong>. Use credits to buy Premium or withdraw to your bank account.
            </p>
            <div className="flex items-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">1</div>
                <span className="text-white/90">Friend signs up</span>
              </div>
              <ArrowRight className="w-4 h-4 text-white/40" />
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">2</div>
                <span className="text-white/90">They get $30 off</span>
              </div>
              <ArrowRight className="w-4 h-4 text-white/40 hidden sm:block" />
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">3</div>
                <span className="text-white/90">You get $30 credit</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Referral link */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Your referral link</h3>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 font-mono truncate">
            {referralLink}
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors flex-shrink-0"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handleShareTwitter}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 bg-gray-50 border border-gray-200 hover:border-gray-300 px-4 py-2.5 rounded-xl transition-colors"
          >
            <Share2 className="w-4 h-4" /> Share on X
          </button>
          <button
            onClick={handleShareEmail}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 bg-gray-50 border border-gray-200 hover:border-gray-300 px-4 py-2.5 rounded-xl transition-colors"
          >
            <Mail className="w-4 h-4" /> Email a friend
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="w-10 h-10 rounded-xl border bg-violet-50 border-violet-100 flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-violet-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{data.stats.invited}</div>
          <div className="text-sm text-gray-600 mt-1">Invited</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="w-10 h-10 rounded-xl border bg-blue-50 border-blue-100 flex items-center justify-center mb-3">
            <Trophy className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{data.stats.signed_up}</div>
          <div className="text-sm text-gray-600 mt-1">Signed Up</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="w-10 h-10 rounded-xl border bg-emerald-50 border-emerald-100 flex items-center justify-center mb-3">
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{data.stats.upgraded}</div>
          <div className="text-sm text-gray-600 mt-1">Upgraded</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="w-10 h-10 rounded-xl border bg-pink-50 border-pink-100 flex items-center justify-center mb-3">
            <Wallet className="w-5 h-5 text-pink-600" />
          </div>
          <div className="text-3xl font-bold text-emerald-600">${creditsInDollars}</div>
          <div className="text-sm text-gray-600 mt-1">Available Credits</div>
        </div>
      </div>

      {/* Credits actions */}
      {data.credits > 0 && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-bold text-gray-900">You have ${creditsInDollars} in referral credits</h3>
              <p className="text-sm text-gray-600 mt-1">Use it to pay for Premium or request a bank payout.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPayout(!showPayout)}
                className="text-sm font-semibold text-emerald-700 bg-white border border-emerald-200 hover:border-emerald-300 px-4 py-2.5 rounded-xl transition-colors"
              >
                <Wallet className="w-4 h-4 inline mr-1.5" />
                Request Payout
              </button>
            </div>
          </div>

          {showPayout && (
            <div className="mt-4 pt-4 border-t border-emerald-200 space-y-3">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <input type="radio" name="method" value="paypal" checked={payoutMethod === 'paypal'} onChange={() => setPayoutMethod('paypal')} className="accent-emerald-600" />
                  PayPal
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <input type="radio" name="method" value="bank" checked={payoutMethod === 'bank'} onChange={() => setPayoutMethod('bank')} className="accent-emerald-600" />
                  Bank Transfer
                </label>
              </div>
              <input
                type="text"
                value={payoutDetails}
                onChange={e => setPayoutDetails(e.target.value)}
                placeholder={payoutMethod === 'paypal' ? 'Your PayPal email' : 'Your bank details (IBAN or account)'}
                className="w-full bg-white border border-emerald-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-400"
              />
              <button
                onClick={handlePayout}
                disabled={payoutLoading || !payoutDetails.trim()}
                className="text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50"
              >
                {payoutLoading ? 'Processing...' : `Withdraw $${creditsInDollars}`}
              </button>
            </div>
          )}
        </div>
      )}

      {payoutMessage && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800 font-medium">
          {payoutMessage}
        </div>
      )}

      {/* Referral history */}
      {data.referrals.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">Referral History</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {data.referrals.map(ref => (
              <div key={ref.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{ref.email || 'Pending'}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(ref.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  ref.status === 'rewarded'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    : 'bg-amber-50 text-amber-700 border border-amber-100'
                }`}>
                  {ref.status === 'rewarded' ? '+$30 earned' : 'Awaiting upgrade'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {data.referrals.length === 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center mx-auto mb-4">
            <Gift className="w-7 h-7 text-violet-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No referrals yet</h3>
          <p className="text-sm text-gray-600 max-w-sm mx-auto">
            Share your referral link with a friend. When they upgrade to Premium, they get $30 off and you earn $30 in credits.
          </p>
        </div>
      )}
    </div>
  )
}
