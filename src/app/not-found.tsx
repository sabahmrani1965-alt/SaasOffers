import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-display text-white/5 font-bold mb-4 select-none">404</div>
        <h1 className="text-2xl font-bold text-white mb-2">Page not found</h1>
        <p className="text-zinc-400 text-sm mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-accent-300 hover:text-accent-200 font-medium text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </div>
    </div>
  )
}
