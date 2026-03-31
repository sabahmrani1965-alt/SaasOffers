import { cn } from '@/lib/utils'
import { LucideIcon, TrendingUp } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
  iconColor?: string
  iconBg?: string
}

export function StatCard({ label, value, icon: Icon, trend, trendUp, iconColor = 'text-violet-400', iconBg = 'bg-violet-500/10' }: StatCardProps) {
  return (
    <div className="bg-gray-900 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', iconBg)}>
          <Icon className={cn('w-4.5 h-4.5', iconColor)} />
        </div>
        {trend && (
          <div className={cn('flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full', trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400')}>
            <TrendingUp className={cn('w-3 h-3', !trendUp && 'rotate-180')} />
            {trend}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-gray-500 font-medium">{label}</div>
    </div>
  )
}
