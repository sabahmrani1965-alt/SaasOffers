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
    className: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  },
  premium: {
    label: 'Premium',
    icon: Lock,
    className: 'bg-accent/10 text-accent-300 border border-accent/20',
  },
  apply: {
    label: 'Apply',
    icon: FileText,
    className: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  },
}

export function DealBadge({ type, className }: DealBadgeProps) {
  const config = BADGE_CONFIG[type]
  const Icon = config.icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full',
        config.className,
        className
      )}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  )
}
