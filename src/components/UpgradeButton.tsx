'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface UpgradeButtonProps {
  children: React.ReactNode
  className?: string
}

export function UpgradeButton({ children, className }: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleClick = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const { url, error } = await res.json()
      if (error) throw new Error(error)
      if (url) window.location.href = url
    } catch (e) {
      console.error('Checkout error:', e)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleClick} disabled={loading} className={className}>
      {loading ? 'Loading...' : children}
    </button>
  )
}
