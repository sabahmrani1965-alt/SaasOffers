import { cn } from '@/lib/utils'

type BadgeVariant = 'green' | 'violet' | 'amber' | 'gray' | 'red' | 'blue'

const VARIANTS: Record<BadgeVariant, string> = {
  green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  gray: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  red: 'bg-red-500/10 text-red-400 border-red-500/20',
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
}

export function Badge({ children, variant = 'gray', className }: { children: React.ReactNode; variant?: BadgeVariant; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border', VARIANTS[variant], className)}>
      {children}
    </span>
  )
}
