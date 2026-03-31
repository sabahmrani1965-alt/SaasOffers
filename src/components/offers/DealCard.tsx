import Link from 'next/link'
import { Deal } from '@/types'
import { DealBadge } from '@/components/ui/DealBadge'
import { ArrowRight, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DealCardProps {
  deal: Deal
  className?: string
}

const LOGO_COLORS: Record<string, string> = {
  aws: '#FF9900',
  notion: '#000000',
  deel: '#15CCAE',
  stripe: '#635BFF',
  linear: '#5E6AD2',
  figma: '#F24E1E',
  default: '#7C3AED',
}

function LogoPlaceholder({ name, bg }: { name: string; bg?: string }) {
  const color = bg || LOGO_COLORS[name.toLowerCase().split(' ')[0]] || LOGO_COLORS.default
  return (
    <div
      className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm"
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
        'group block bg-white hover:bg-violet-50/40 border border-gray-100 hover:border-violet-100 rounded-2xl p-5 transition-all duration-200 shadow-card hover:shadow-card-hover hover:-translate-y-0.5',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <LogoPlaceholder name={deal.name} bg={deal.logo_bg} />
          <div>
            <h3 className="font-semibold text-gray-900 text-sm group-hover:text-violet-600 transition-colors">
              {deal.name}
            </h3>
            {deal.category && <p className="text-xs text-gray-400 mt-0.5">{deal.category}</p>}
          </div>
        </div>
        <DealBadge type={deal.type} />
      </div>

      <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">{deal.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-emerald-50 flex items-center justify-center">
            <DollarSign className="w-3 h-3 text-emerald-600" />
          </div>
          <span className="text-sm font-semibold text-emerald-600">{deal.value_label}</span>
        </div>
        <span className="flex items-center gap-1 text-xs text-gray-400 group-hover:text-violet-500 transition-colors font-medium">
          View offer <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </Link>
  )
}
