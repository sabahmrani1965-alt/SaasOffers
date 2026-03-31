'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FAQItem {
  question: string
  answer: string
}

export function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div
          key={i}
          className={cn(
            'border rounded-xl overflow-hidden transition-all duration-200',
            open === i ? 'border-violet-200 bg-violet-50/40' : 'border-gray-100 bg-white'
          )}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left"
          >
            <span className={cn('text-sm font-semibold pr-4', open === i ? 'text-violet-700' : 'text-gray-900')}>
              {item.question}
            </span>
            <ChevronDown
              className={cn('w-4 h-4 flex-shrink-0 transition-transform duration-200', open === i ? 'rotate-180 text-violet-500' : 'text-gray-400')}
            />
          </button>
          {open === i && (
            <div className="px-5 pb-4">
              <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
