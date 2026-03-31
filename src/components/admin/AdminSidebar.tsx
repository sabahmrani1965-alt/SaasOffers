'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Package, FileText, Users,
  Settings, ChevronRight, ExternalLink, ClipboardList
} from 'lucide-react'
import Image from 'next/image'

const NAV = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/offers', label: 'Offers', icon: Package },
  { href: '/admin/applications', label: 'Applications', icon: ClipboardList },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 flex-shrink-0 bg-gray-950 border-r border-white/5 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/logo.png"
            alt="SaaSOffers"
            width={110}
            height={32}
            className="h-7 w-auto object-contain brightness-0 invert"
          />
          <div className="text-[10px] text-gray-500 font-medium border-l border-white/10 pl-2.5">Admin</div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest px-3 mb-2">Menu</p>
        {NAV.map(item => {
          const Icon = item.icon
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                active
                  ? 'bg-violet-500/15 text-violet-300'
                  : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'
              )}
            >
              <Icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-violet-400' : 'text-gray-500 group-hover:text-gray-300')} />
              {item.label}
              {active && <ChevronRight className="w-3 h-3 ml-auto text-violet-400/60" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all group"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View site
        </Link>
      </div>
    </aside>
  )
}
