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
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center shadow-md shadow-violet-200">
                <Zap className="w-4 h-4 text-white" fill="white" />
              </div>
              <span className="font-bold text-gray-900 text-lg tracking-tight">SaaSOffers</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              The perks platform built for ambitious startups. Unlock $10,000+ in SaaS credits and build your product faster.
            </p>
            <p className="text-gray-400 text-xs mt-6">© {new Date().getFullYear()} SaaSOffers. All rights reserved.</p>
          </div>
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">{section}</h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
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
