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

    const handleScroll = () => setScrolled(window.scrollY > 20)
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
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-surface/90 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/20'
          : 'bg-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-lg shadow-accent/30 group-hover:shadow-accent/50 transition-shadow">
            <Zap className="w-4 h-4 text-white" fill="white" />
          </div>
          <span className="font-semibold text-white text-lg tracking-tight">SaaSOffers</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors',
                pathname === link.href
                  ? 'text-white'
                  : 'text-zinc-400 hover:text-white'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="text-sm font-medium bg-accent hover:bg-accent-600 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-accent/20"
              >
                Get Access
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-zinc-400 hover:text-white transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface-50 border-b border-white/5 px-4 py-4 space-y-3">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-zinc-300 hover:text-white py-2 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-white/5 flex flex-col gap-2">
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block text-sm text-zinc-300 py-2">Dashboard</Link>
                <button onClick={handleSignOut} className="text-left text-sm text-zinc-500 py-2">Sign out</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="block text-sm text-zinc-300 py-2">Log in</Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)} className="block bg-accent text-white text-sm text-center py-2 rounded-lg">Get Access</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
