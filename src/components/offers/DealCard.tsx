import Link from 'next/link'
import { Deal } from '@/types'
import { DealBadge } from '@/components/ui/DealBadge'
import { ArrowRight, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DealCardProps {
  deal: Deal
  className?: string
}

// Placeholder logo colors by brand name
const LOGO_COLORS: Record<string, string> = {
  aws: '#FF9900',
  notion: '#000000',
  deel: '#15CCAE',
  stripe: '#635BFF',
  linear: '#5E6AD2',
  figma: '#F24E1E',
  default: '#6366f1',
}

function LogoPlaceholder({ name, bg }: { name: string; bg?: string }) {
  const color = bg || LOGO_COLORS[name.toLowerCase().split(' ')[0]] || LOGO_COLORS.default
  return (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
      style={{ backgroundColor: color }}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  )
}

export function DealCard({ deal, className }: DealCardProps) {
  return (
    <Link
      href={`/offers/${deal.slug}`}
      className={cn(
        'group block bg-surface-50 hover:bg-surface-200 border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-all duration-200 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <LogoPlaceholder name={deal.name} bg={deal.logo_bg} />
          <div>
            <h3 className="font-semibold text-white text-sm group-hover:text-accent-300 transition-colors">
              {deal.name}
            </h3>
            {deal.category && (
              <p className="text-xs text-zinc-500 mt-0.5">{deal.category}</p>
            )}
          </div>
        </div>
        <DealBadge type={deal.type} />
      </div>

      <p className="text-sm text-zinc-400 leading-relaxed mb-4 line-clamp-2">
        {deal.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-emerald-500/10 flex items-center justify-center">
            <DollarSign className="w-3 h-3 text-emerald-400" />
          </div>
          <span className="text-sm font-semibold text-emerald-400">{deal.value_label}</span>
        </div>
        <span className="flex items-center gap-1 text-xs text-zinc-500 group-hover:text-accent-300 transition-colors">
          View offer <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </Link>
  )
}
