'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Menu, X } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
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
      scrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100' : 'bg-white/80 backdrop-blur-sm'
    )}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/">
          <Logo variant="dark" size="md" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href}
              className={cn('text-sm font-medium transition-colors',
                pathname === link.href ? 'text-violet-600' : 'text-gray-500 hover:text-gray-900'
              )}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors">Dashboard</Link>
              <button onClick={handleSignOut} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Sign out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors">Log in</Link>
              <Link href="/signup" className="text-sm font-semibold bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-md shadow-violet-200 hover:shadow-lg hover:-translate-y-0.5">
                Get Access
              </Link>
            </>
          )}
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-gray-500 hover:text-gray-900 transition-colors p-1">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 shadow-lg px-4 py-4 space-y-1">
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
              className="block text-sm text-gray-600 hover:text-gray-900 py-2.5 font-medium transition-colors">
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2 mt-2">
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block text-sm text-gray-600 py-2 font-medium">Dashboard</Link>
                <button onClick={handleSignOut} className="text-left text-sm text-gray-400 py-2">Sign out</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="block text-sm text-gray-600 py-2 font-medium">Log in</Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)} className="block bg-gradient-to-r from-violet-600 to-pink-500 text-white text-sm text-center py-3 rounded-xl font-semibold shadow-md shadow-violet-200">Get Access</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
