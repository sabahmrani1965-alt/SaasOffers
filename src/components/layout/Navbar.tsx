'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Menu, X, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/offers', label: 'Offers' },
  { href: '/compare', label: 'Compare' },
  { href: '/blog', label: 'Blog' },
  { href: '/community', label: 'Community' },
  { href: '/pricing', label: 'Pricing' },
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
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
      scrolled
        ? 'bg-[#0F0A2E]/98 backdrop-blur-xl shadow-lg shadow-black/10 border-white/10'
        : 'bg-[#0F0A2E]/95 backdrop-blur-sm border-white/5'
    )}>
      <nav className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between h-[68px]">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-md shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-all">
            <Zap className="w-4.5 h-4.5 text-white" fill="white" />
          </div>
          <span className="font-bold text-white text-xl tracking-tight">SaaSOffers</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-9">
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href}
              className={cn('text-[15px] font-medium transition-colors',
                pathname === link.href ? 'text-violet-400' : 'text-white/70 hover:text-white'
              )}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link href="/dashboard" className="text-[15px] font-medium text-white/80 hover:text-white border border-white/20 hover:border-white/40 px-4 py-2 rounded-xl transition-all">
                Dashboard
              </Link>
              <button onClick={handleSignOut} className="text-[15px] text-white/60 hover:text-white/90 transition-colors">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-[15px] text-white/70 hover:text-white font-medium transition-colors">
                Log in
              </Link>
              <Link href="/signup" className="text-[15px] font-semibold bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-500 hover:to-pink-400 text-white px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-violet-500/25 hover:shadow-lg hover:shadow-violet-500/30 hover:-translate-y-0.5">
                Get Access
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white/80 hover:text-white transition-colors p-1">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0F0A2E] border-t border-white/10 shadow-lg px-6 py-5 space-y-1">
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
              className={cn(
                'block text-base py-3 font-medium transition-colors',
                pathname === link.href ? 'text-violet-400' : 'text-white/70 hover:text-white'
              )}>
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/10 flex flex-col gap-3 mt-2">
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block text-base text-white/80 py-2 font-medium">Dashboard</Link>
                <button onClick={handleSignOut} className="text-left text-base text-white/60 py-2">Sign out</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="block text-base text-white/70 py-2 font-medium">Log in</Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)} className="block bg-gradient-to-r from-violet-600 to-pink-500 text-white text-base text-center py-3.5 rounded-xl font-semibold shadow-md shadow-violet-500/25">Get Access</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
