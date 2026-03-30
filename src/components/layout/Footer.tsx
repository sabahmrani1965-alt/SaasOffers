import Link from 'next/link'
import { Zap } from 'lucide-react'

const FOOTER_LINKS = {
  Product: [
    { label: 'Browse Offers', href: '/offers' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Blog', href: '/blog' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: 'mailto:hello@saasoffers.com' },
  ],
  Legal: [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-surface-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-lg shadow-accent/30">
                <Zap className="w-4 h-4 text-white" fill="white" />
              </div>
              <span className="font-semibold text-white text-lg tracking-tight">SaaSOffers</span>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
              The perks platform built for ambitious startups. Unlock $10,000+ in SaaS credits and build your product faster.
            </p>
            <p className="text-zinc-600 text-xs mt-6">
              © {new Date().getFullYear()} SaaSOffers. All rights reserved.
            </p>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">{section}</h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}
