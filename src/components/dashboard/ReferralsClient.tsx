'use client'

import { useState, useEffect } from 'react'
import { Gift, Copy, Check, Users, Trophy, Calendar, Share2, Mail } from 'lucide-react'

interface ReferralData {
  referral_code: string
  stats: { invited: number; joined: number; months_earned: number }
  referrals: { id: string; status: string; email: string | null; created_at: string; rewarded_at: string | null }[]
}

export function ReferralsClient() {
  const [data, setData] = useState<ReferralData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('/api/referrals')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const referralLink = data ? `https://saasoffers.tech/signup?ref=${data.referral_code}` : ''

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareTwitter = () => {
    const text = encodeURIComponent('I\'m using SaaSOffers to save on my startup stack. Sign up with my link and we both get 1 month free Premium!')
    const url = encodeURIComponent(referralLink)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
  }

  const handleShareEmail = () => {
    const subject = encodeURIComponent('Get 1 month free Premium on SaaSOffers')
    const body = encodeURIComponent(`Hey! I've been using SaaSOffers to save on SaaS tools for my startup.\n\nSign up with my referral link and we both get 1 month of Premium for free:\n${referralLink}\n\nIt gives you access to 199+ deals worth $500,000+ in credits.`)
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!data) return null

  const STATS = [
    { label: 'Friends Invited', value: data.stats.invited, icon: Users, color: 'violet' },
    { label: 'Signed Up', value: data.stats.joined, icon: Trophy, color: 'emerald' },
    { label: 'Months Earned', value: data.stats.months_earned, icon: Calendar, color: 'pink' },
  ]

  return (
    <div className="space-y-8">

      {/* How it works banner */}
      <div className="bg-gradient-to-br from-violet-600 to-pink-500 rounded-2xl p-6 sm:p-8 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">Invite friends, both get 1 month free</h2>
            <p className="text-white/80 text-sm leading-relaxed max-w-xl">
              Share your unique referral link. When a friend signs up, you both get 1 month of Premium for free.
              No limits — the more friends you invite, the more free months you earn.
            </p>
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

        {/* Share buttons */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handleShareTwitter}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 bg-gray-50 border border-gray-200 hover:border-gray-300 px-4 py-2.5 rounded-xl transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share on X
          </button>
          <button
            onClick={handleShareEmail}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 bg-gray-50 border border-gray-200 hover:border-gray-300 px-4 py-2.5 rounded-xl transition-colors"
          >
            <Mail className="w-4 h-4" />
            Email a friend
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STATS.map(stat => {
          const Icon = stat.icon
          const bgColor = stat.color === 'violet' ? 'bg-violet-50 border-violet-100' : stat.color === 'emerald' ? 'bg-emerald-50 border-emerald-100' : 'bg-pink-50 border-pink-100'
          const iconColor = stat.color === 'violet' ? 'text-violet-600' : stat.color === 'emerald' ? 'text-emerald-600' : 'text-pink-600'
          return (
            <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${bgColor}`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
            </div>
          )
        })}
      </div>

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
                    : ref.status === 'completed'
                    ? 'bg-blue-50 text-blue-700 border border-blue-100'
                    : 'bg-gray-50 text-gray-500 border border-gray-200'
                }`}>
                  {ref.status === 'rewarded' ? '+1 month' : ref.status === 'completed' ? 'Joined' : 'Pending'}
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
            Share your referral link with a friend. When they sign up, you both get 1 month of Premium for free.
          </p>
        </div>
      )}
    </div>
  )
}
