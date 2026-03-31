'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { BlogPost } from '@/types'
import { formatDistanceToNow, format } from 'date-fns'
import { Search, Clock, ArrowRight, Tag } from 'lucide-react'

interface Props {
  posts: BlogPost[]
}

const CATEGORY_COLORS: Record<string, string> = {
  'Guides':       'bg-violet-50 text-violet-600 border-violet-100',
  'Case Studies': 'bg-blue-50 text-blue-600 border-blue-100',
  'Comparisons':  'bg-amber-50 text-amber-600 border-amber-100',
  'News':         'bg-emerald-50 text-emerald-600 border-emerald-100',
  'default':      'bg-gray-100 text-gray-600 border-gray-200',
}

const COVER_GRADIENTS: Record<string, string> = {
  'Guides':       'from-violet-500 to-purple-600',
  'Case Studies': 'from-blue-500 to-cyan-600',
  'Comparisons':  'from-amber-400 to-orange-500',
  'News':         'from-emerald-500 to-teal-600',
  'default':      'from-violet-500 to-pink-500',
}

function readTime(content: string) {
  return Math.max(1, Math.ceil(content.split(/\s+/).length / 200))
}

function categoryStyle(cat?: string) {
  return cat ? (CATEGORY_COLORS[cat] || CATEGORY_COLORS.default) : CATEGORY_COLORS.default
}

function coverGradient(cat?: string) {
  return cat ? (COVER_GRADIENTS[cat] || COVER_GRADIENTS.default) : COVER_GRADIENTS.default
}

export function BlogList({ posts }: Props) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = useMemo(() => {
    const cats = Array.from(new Set(posts.map(p => p.category).filter(Boolean))) as string[]
    return ['All', ...cats]
  }, [posts])

  const filtered = useMemo(() => {
    return posts.filter(p => {
      const matchCat = activeCategory === 'All' || p.category === activeCategory
      const q = search.toLowerCase()
      const matchSearch = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
      return matchCat && matchSearch
    })
  }, [posts, search, activeCategory])

  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <div className="space-y-10">

      {/* ── Search + filter bar ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
          />
        </div>
        {/* Category pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-sm px-4 py-2 rounded-xl border font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-violet-600 border-violet-600 text-white shadow-sm shadow-violet-200'
                  : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center text-gray-400">
          <Search className="w-8 h-8 mx-auto mb-3 opacity-50" />
          <p className="font-medium">No articles found</p>
          <button onClick={() => { setSearch(''); setActiveCategory('All') }} className="text-violet-600 text-sm mt-2 hover:underline">Clear filters</button>
        </div>
      )}

      {/* ── Featured post ── */}
      {featured && (
        <Link
          href={`/blog/${featured.slug}`}
          className="group block bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
        >
          {/* Cover */}
          <div className={`h-52 sm:h-64 bg-gradient-to-br ${coverGradient(featured.category)} relative flex items-end p-6`}>
            <div className="absolute inset-0 bg-black/10" />
            {featured.category && (
              <span className="relative inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-full">
                <Tag className="w-3 h-3" />
                {featured.category}
              </span>
            )}
          </div>
          {/* Body */}
          <div className="p-7">
            <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{readTime(featured.content)} min read</span>
              <span>·</span>
              <span>{format(new Date(featured.created_at), 'MMM d, yyyy')}</span>
              {featured.author && <><span>·</span><span>{featured.author}</span></>}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-violet-600 transition-colors">
              {featured.title}
            </h2>
            <p className="text-gray-500 text-base leading-relaxed line-clamp-2 mb-5">
              {featured.excerpt}
            </p>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-600 group-hover:gap-2.5 transition-all">
              Read article <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
      )}

      {/* ── Article grid ── */}
      {rest.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-5">
          {rest.map(post => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col"
            >
              {/* Mini cover */}
              <div className={`h-32 bg-gradient-to-br ${coverGradient(post.category)}`} />
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {post.category && (
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${categoryStyle(post.category)}`}>
                      {post.category}
                    </span>
                  )}
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />{readTime(post.content)} min
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 group-hover:text-violet-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4 flex-1">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <span className="text-xs text-gray-400">{format(new Date(post.created_at), 'MMM d, yyyy')}</span>
                  <span className="text-xs font-semibold text-violet-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* ── Newsletter CTA ── */}
      <div className="bg-gradient-to-br from-violet-600 to-pink-500 rounded-2xl p-8 sm:p-10 text-center text-white">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/20 border border-white/30 px-3 py-1 rounded-full mb-4">
          ✦ Free newsletter
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold mb-2">Get the best SaaS deals in your inbox</h3>
        <p className="text-white/80 text-base mb-6 max-w-sm mx-auto">
          New deals, guides, and startup resources every week. No spam.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 bg-white text-violet-600 font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm"
        >
          Get free access <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  )
}
