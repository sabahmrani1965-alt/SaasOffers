'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Menu, X, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/offers', label: 'Offers' },
  { href: '/blog', label: 'Blog' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/partners', label: 'Partners' },
]

export function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => {
      listener.subscription.unsubscribe()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled ? 'bg-white/97 backdrop-blur-xl shadow-sm border-b border-gray-150' : 'bg-white/85 backdrop-blur-sm'
    )}>
      <nav className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between h-[68px]">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center shadow-md shadow-violet-200 group-hover:shadow-violet-300 transition-all">
            <Zap className="w-4.5 h-4.5 text-white" fill="white" />
          </div>
          <span className="font-bold text-gray-900 text-xl tracking-tight">SaaSOffers</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-9">
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href}
              className={cn('text-[15px] font-medium transition-colors',
                pathname === link.href ? 'text-violet-600' : 'text-gray-700 hover:text-gray-900'
              )}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link href="/dashboard" className="text-[15px] text-gray-700 hover:text-gray-900 font-medium transition-colors">Dashboard</Link>
              <button onClick={handleSignOut} className="text-[15px] text-gray-600 hover:text-gray-800 transition-colors">Sign out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-[15px] text-gray-700 hover:text-gray-900 font-medium transition-colors">Log in</Link>
              <Link href="/signup" className="text-[15px] font-semibold bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 text-white px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-violet-200 hover:shadow-lg hover:-translate-y-0.5">
                Get Access
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-gray-700 hover:text-gray-900 transition-colors p-1">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 shadow-lg px-6 py-5 space-y-1">
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
              className="block text-base text-gray-700 hover:text-gray-900 py-3 font-medium transition-colors">
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-100 flex flex-col gap-3 mt-2">
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block text-base text-gray-700 py-2 font-medium">Dashboard</Link>
                <button onClick={handleSignOut} className="text-left text-base text-gray-700 py-2">Sign out</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="block text-base text-gray-700 py-2 font-medium">Log in</Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)} className="block bg-gradient-to-r from-violet-600 to-pink-500 text-white text-base text-center py-3.5 rounded-xl font-semibold shadow-md shadow-violet-200">Get Access</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
