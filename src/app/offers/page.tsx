import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SEED_DEALS } from '@/lib/seed-data'
import { CATEGORIES, getCategoryBySlug } from '@/lib/categories'
import { DealCard } from '@/components/offers/DealCard'
import { SearchBar } from '@/components/offers/SearchBar'
import { Deal } from '@/types'
import { Zap, Star, Lock, FileText, Sparkles, ChevronRight, Search } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Browse SaaS Deals & Startup Credits | SaaSOffers',
  description: 'Explore $500,000+ in exclusive SaaS deals for startups. AI tools, CRM, DevOps, Marketing, Finance and more. Free and premium offers available.',
  alternates: { canonical: 'https://saasoffers.tech/offers' },
}

const SPECIAL_FILTERS = [
  { label: 'All Deals', value: '', icon: null },
  { label: 'Featured', value: 'featured', icon: Sparkles },
  { label: 'Free', value: 'free', icon: Star },
  { label: 'Premium', value: 'premium', icon: Lock },
  { label: 'New', value: 'new', icon: Zap },
  { label: 'Apply', value: 'apply', icon: FileText },
]

const DEALS_PER_PAGE = 42

interface PageProps {
  searchParams: { filter?: string; category?: string; page?: string; q?: string }
}

function isNew(deal: Deal) {
  return Date.now() - new Date(deal.created_at).getTime() < 30 * 24 * 60 * 60 * 1000
}

export default async function OffersPage({ searchParams }: PageProps) {
  const supabase = createClient()
  const { data: dbDeals } = await supabase
    .from('deals')
    .select('*')
    .order('featured', { ascending: false })
    .order('value', { ascending: false })

  const allDeals: Deal[] = (dbDeals && dbDeals.length > 0 ? dbDeals : SEED_DEALS) as Deal[]

  const activeFilter = searchParams.filter || ''
  const activeCategory = searchParams.category || ''
  const activeCategory_ = activeCategory ? getCategoryBySlug(activeCategory) : null

  // Apply filters
  let filtered = allDeals

  if (activeCategory_) {
    filtered = filtered.filter(d =>
      d.category && activeCategory_.dbValues.includes(d.category)
    )
  }

  if (activeFilter === 'featured') {
    filtered = filtered.filter(d => d.featured)
  } else if (activeFilter === 'free') {
    filtered = filtered.filter(d => d.type === 'free')
  } else if (activeFilter === 'premium') {
    filtered = filtered.filter(d => d.type === 'premium')
  } else if (activeFilter === 'apply') {
    filtered = filtered.filter(d => d.type === 'apply')
  } else if (activeFilter === 'new') {
    filtered = filtered.filter(d => isNew(d))
  }

  // Search filter
  const searchQuery = (searchParams.q || '').trim().toLowerCase()
  if (searchQuery) {
    filtered = filtered.filter(d =>
      d.name.toLowerCase().includes(searchQuery) ||
      d.description?.toLowerCase().includes(searchQuery) ||
      d.category?.toLowerCase().includes(searchQuery) ||
      d.value_label?.toLowerCase().includes(searchQuery)
    )
  }

  const totalValue = allDeals.reduce((sum, d) => sum + d.value, 0)
  const isFiltered = !!activeCategory || !!activeFilter || !!searchQuery

  // Pagination
  const currentPage = Math.max(1, parseInt(searchParams.page || '1'))
  const totalPages = Math.ceil(filtered.length / DEALS_PER_PAGE)
  const paginatedDeals = filtered.slice((currentPage - 1) * DEALS_PER_PAGE, currentPage * DEALS_PER_PAGE)

  // Build pagination URL helper
  function pageUrl(page: number) {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (activeCategory) params.set('category', activeCategory)
    if (activeFilter) params.set('filter', activeFilter)
    if (page > 1) params.set('page', String(page))
    const qs = params.toString()
    return `/offers${qs ? `?${qs}` : ''}`
  }

  // Deal counts per category
  const categoryCounts = CATEGORIES.map(cat => ({
    ...cat,
    count: allDeals.filter(d => d.category && cat.dbValues.includes(d.category)).length,
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-10">
          <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-100 text-violet-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            <Zap className="w-3 h-3 fill-current" />
            {allDeals.length} deals · ${totalValue.toLocaleString()}+ in value
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
            {activeCategory_ ? activeCategory_.name : 'All Deals'}
          </h1>
          <p className="text-gray-700 text-lg max-w-2xl">
            {activeCategory_
              ? activeCategory_.description
              : 'Hand-picked SaaS deals and startup credits, updated weekly.'}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-20 space-y-10">

        {/* ── Category Grid (shown when no category is selected) ── */}
        {!activeCategory && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">Browse by Category</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {categoryCounts.map(cat => {
                const Icon = cat.icon
                return (
                  <Link
                    key={cat.slug}
                    href={`/offers/category/${cat.slug}`}
                    className="group bg-white border border-gray-100 hover:border-gray-200 rounded-2xl p-4 flex items-center gap-3 transition-all hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${cat.color}15` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: cat.color }} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 leading-tight truncate">
                        {cat.name}
                      </div>
                      {cat.count > 0 && (
                        <div className="text-xs text-gray-600 mt-0.5">{cat.count} deals</div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* ── Active Category breadcrumb ── */}
        {activeCategory_ && (
          <nav className="flex items-center gap-2 text-sm text-gray-700 -mb-4">
            <Link href="/offers" className="hover:text-gray-900 transition-colors font-medium">All Deals</Link>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <span className="text-gray-900 font-semibold">{activeCategory_.name}</span>
          </nav>
        )}

        {/* ── Search + Filter bar ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <SearchBar />
        </div>

        {/* ── Special filter pills ── */}
        <div className="flex items-center gap-2 flex-wrap -mt-4">
          {SPECIAL_FILTERS.map(f => {
            const Icon = f.icon
            const isActive = activeFilter === f.value
            const href = f.value === ''
              ? activeCategory ? `/offers?category=${activeCategory}` : '/offers'
              : activeCategory
                ? `/offers?category=${activeCategory}&filter=${f.value}`
                : `/offers?filter=${f.value}`
            return (
              <Link
                key={f.value}
                href={href}
                className={`inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl border font-medium transition-all shadow-sm ${
                  isActive
                    ? 'bg-violet-600 border-violet-600 text-white shadow-violet-200'
                    : 'border-gray-200 text-gray-700 hover:text-gray-900 hover:border-gray-300 bg-white'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {f.label}
              </Link>
            )
          })}
          <span className="text-xs text-gray-600 ml-2">{filtered.length} results</span>
        </div>

        {/* ── Deals Grid ── */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-gray-600" />
            </div>
            <p className="text-gray-700 font-medium">No deals found</p>
            <Link href="/offers" className="text-violet-600 text-sm font-semibold mt-3 hover:underline">
              Clear filters
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedDeals.map(deal => <DealCard key={deal.slug} deal={deal} />)}
            </div>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8">
                {currentPage > 1 && (
                  <Link
                    href={pageUrl(currentPage - 1)}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:border-gray-300 hover:text-gray-900 transition-all shadow-sm"
                  >
                    Previous
                  </Link>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                  .reduce<(number | string)[]>((acc, p, i, arr) => {
                    if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...')
                    acc.push(p)
                    return acc
                  }, [])
                  .map((p, i) =>
                    typeof p === 'string' ? (
                      <span key={`dots-${i}`} className="px-2 text-gray-400 text-sm">...</span>
                    ) : (
                      <Link
                        key={p}
                        href={pageUrl(p)}
                        className={`w-10 h-10 rounded-xl text-sm font-semibold flex items-center justify-center transition-all shadow-sm ${
                          p === currentPage
                            ? 'bg-violet-600 text-white shadow-violet-200'
                            : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900'
                        }`}
                      >
                        {p}
                      </Link>
                    )
                  )}

                {currentPage < totalPages && (
                  <Link
                    href={pageUrl(currentPage + 1)}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:border-gray-300 hover:text-gray-900 transition-all shadow-sm"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}

            <p className="text-center text-xs text-gray-500">
              Showing {(currentPage - 1) * DEALS_PER_PAGE + 1}–{Math.min(currentPage * DEALS_PER_PAGE, filtered.length)} of {filtered.length} deals
            </p>
          </>
        )}
      </div>
    </div>
  )
}
