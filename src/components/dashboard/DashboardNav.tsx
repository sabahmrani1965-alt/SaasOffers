'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Zap, Rocket } from 'lucide-react'

const TABS = [
  { href: '/dashboard', label: 'My Deals', icon: Zap },
  { href: '/dashboard/accelerators', label: 'Accelerators', icon: Rocket },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 mb-8">
      {TABS.map(tab => {
        const Icon = tab.icon
        const isActive = tab.href === '/dashboard'
          ? pathname === '/dashboard'
          : pathname.startsWith(tab.href)
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              isActive
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
