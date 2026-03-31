import { cn } from '@/lib/utils'
import { DealType } from '@/types'
import { Lock, Star, FileText } from 'lucide-react'

interface DealBadgeProps {
  type: DealType
  className?: string
}

const BADGE_CONFIG: Record<DealType, { label: string; icon: React.ElementType; className: string }> = {
  free: {
    label: 'Free',
    icon: Star,
    className: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
  },
  premium: {
    label: 'Premium',
    icon: Lock,
    className: 'bg-violet-50 text-violet-600 border border-violet-100',
  },
  apply: {
    label: 'Apply',
    icon: FileText,
    className: 'bg-amber-50 text-amber-600 border border-amber-100',
  },
}

export function DealBadge({ type, className }: DealBadgeProps) {
  const config = BADGE_CONFIG[type]
  const Icon = config.icon
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full', config.className, className)}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  )
}
