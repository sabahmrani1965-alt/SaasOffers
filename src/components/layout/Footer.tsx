import Link from 'next/link'
import { Zap } from 'lucide-react'

const FOOTER_LINKS = {
  Product: [
    { label: 'Browse Offers', href: '/offers' },
    { label: 'Compare Tools', href: '/compare' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Blog', href: '/blog' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Partner With Us', href: '/partners' },
    { label: 'Contact', href: 'mailto:ilyas@saasoffers.tech' },
  ],
  Legal: [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-14">

          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center shadow-md shadow-violet-200 group-hover:shadow-violet-300 transition-all">
                <Zap className="w-4 h-4 text-white" fill="white" />
              </div>
              <span className="font-bold text-gray-900 text-xl tracking-tight">SaaSOffers</span>
            </Link>
            <p className="text-gray-600 text-[15px] leading-relaxed max-w-xs">
              The perks platform built for ambitious startups. Unlock $500,000+ in SaaS credits and build your product faster.
            </p>
            <p className="text-gray-500 text-sm mt-8">© {new Date().getFullYear()} SaaSOffers. All rights reserved.</p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-5">{section}</h4>
              <ul className="space-y-3.5">
                {links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[15px] text-gray-700 hover:text-gray-900 transition-colors font-medium">
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
