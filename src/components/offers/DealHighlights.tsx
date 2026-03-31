import { Deal } from '@/types'
import { DollarSign, Clock, Users, Star, Tag, Zap } from 'lucide-react'

interface DealHighlightsProps {
  deal: Deal
}

export function DealHighlights({ deal }: DealHighlightsProps) {
  const highlights = [
    {
      icon: DollarSign,
      label: 'Deal Value',
      value: deal.value_label,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      icon: deal.type === 'premium' ? Star : deal.type === 'apply' ? Users : Zap,
      label: 'Access Type',
      value: deal.type === 'free' ? 'Instant Access' : deal.type === 'apply' ? 'Apply Required' : 'Premium Plan',
      color: deal.type === 'free' ? 'text-violet-600' : deal.type === 'apply' ? 'text-amber-600' : 'text-violet-600',
      bg: deal.type === 'free' ? 'bg-violet-50' : deal.type === 'apply' ? 'bg-amber-50' : 'bg-violet-50',
      border: deal.type === 'free' ? 'border-violet-100' : deal.type === 'apply' ? 'border-amber-100' : 'border-violet-100',
    },
    {
      icon: Tag,
      label: 'Category',
      value: deal.category || 'SaaS Tool',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    ...(deal.expires_at ? [{
      icon: Clock,
      label: 'Expires',
      value: new Date(deal.expires_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-100',
    }] : []),
  ]

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-card">
      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Deal Highlights</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {highlights.map((h, i) => {
          const Icon = h.icon
          return (
            <div key={i} className={`flex flex-col gap-2 p-3.5 rounded-xl border ${h.bg} ${h.border}`}>
              <div className={`w-7 h-7 rounded-lg bg-white/70 flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${h.color}`} />
              </div>
              <div>
                <div className={`text-sm font-bold ${h.color} leading-tight`}>{h.value}</div>
                <div className="text-xs text-gray-700 mt-0.5">{h.label}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
