import Link from 'next/link'
import { Deal } from '@/types'
import { DealBadge } from '@/components/ui/DealBadge'
import { DealLogo } from '@/components/ui/DealLogo'
import { ArrowRight, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DealCardProps {
  deal: Deal
  className?: string
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
      <div className="flex items-start gap-3 mb-4">
        <DealLogo name={deal.name} logo_url={deal.logo_url} logo_bg={deal.logo_bg} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900 text-sm group-hover:text-violet-600 transition-colors leading-tight">
              {deal.name}
            </h3>
            <div className="flex-shrink-0">
              <DealBadge type={deal.type} />
            </div>
          </div>
          {deal.category && <p className="text-xs text-gray-500 mt-1">{deal.category}</p>}
        </div>
      </div>

      <p className="text-sm text-gray-700 leading-relaxed mb-4 line-clamp-2">{deal.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-emerald-50 flex items-center justify-center">
            <DollarSign className="w-3 h-3 text-emerald-600" />
          </div>
          <span className="text-sm font-semibold text-emerald-600">{deal.value_label}</span>
        </div>
        <span className="flex items-center gap-1 text-xs text-gray-600 group-hover:text-violet-500 transition-colors font-medium">
          View offer <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </Link>
  )
}
