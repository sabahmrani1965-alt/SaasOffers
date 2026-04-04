'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Search, X } from 'lucide-react'

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentQuery = searchParams.get('q') || ''
  const [value, setValue] = useState(currentQuery)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (value.trim()) {
      params.set('q', value.trim())
    } else {
      params.delete('q')
    }
    params.delete('page') // reset to page 1 on new search
    const qs = params.toString()
    router.push(`/offers${qs ? `?${qs}` : ''}`)
  }

  const handleClear = () => {
    setValue('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    params.delete('page')
    const qs = params.toString()
    router.push(`/offers${qs ? `?${qs}` : ''}`)
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Search deals..."
        className="w-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all shadow-sm"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </form>
  )
}
