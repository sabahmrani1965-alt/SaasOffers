import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SEED_DEALS } from '@/lib/seed-data'
import { CATEGORIES, getCategoryBySlug } from '@/lib/categories'
import { DealCard } from '@/components/offers/DealCard'
import { Deal } from '@/types'
import { ChevronRight, Star, Lock, FileText, Zap, ArrowRight } from 'lucide-react'

interface PageProps {
  params: { slug: string }
  searchParams: { type?: string }
}

export async function generateStaticParams() {
  return CATEGORIES.map(c => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const category = getCategoryBySlug(params.slug)
  if (!category) return { title: 'Category Not Found' }

  const title = `${category.name} Deals & Startup Credits | SaaSOffers`
  return {
    title,
    description: category.description,
    openGraph: {
      title,
      description: category.description,
      url: `https://saasoffers.tech/offers/category/${category.slug}`,
      siteName: 'SaaSOffers',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description: category.description },
    alternates: { canonical: `https://saasoffers.tech/offers/category/${category.slug}` },
  }
}

const TYPE_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Free', value: 'free', icon: Star },
  { label: 'Premium', value: 'premium', icon: Lock },
  { label: 'Apply', value: 'apply', icon: FileText },
]

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const category = getCategoryBySlug(params.slug)
  if (!category) notFound()

  const supabase = createClient()
  const { data: dbDeals } = await supabase
    .from('deals')
    .select('*')
    .order('featured', { ascending: false })
    .order('value', { ascending: false })

  const allDeals: Deal[] = (dbDeals && dbDeals.length > 0 ? dbDeals : SEED_DEALS) as Deal[]

  const inCategory = allDeals.filter(d => d.category && category.dbValues.includes(d.category))

  const activeType = searchParams.type || ''
  const filtered = activeType ? inCategory.filter(d => d.type === activeType) : inCategory

  const totalValue = inCategory.reduce((sum, d) => sum + d.value, 0)
  const Icon = category.icon

  // Other categories for "Explore more" section
  const otherCategories = CATEGORIES.filter(c => c.slug !== params.slug).slice(0, 4)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-10">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-700 mb-6">
            <Link href="/offers" className="hover:text-gray-900 transition-colors font-medium">All Deals</Link>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <span className="text-gray-900 font-semibold">{category.name}</span>
          </nav>

          <div className="flex items-start gap-5">
            {/* Category icon */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
              style={{ backgroundColor: `${category.color}18` }}
            >
              <Icon className="w-7 h-7" style={{ color: category.color }} />
            </div>

            <div className="flex-1 min-w-0">
              <div
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-3"
                style={{ backgroundColor: `${category.color}15`, color: category.color }}
              >
                <Zap className="w-3 h-3" />
                {inCategory.length} deals available
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
                {category.name}
              </h1>
              <p className="text-gray-700 text-lg max-w-2xl">{category.description}</p>

              {totalValue > 0 && (
                <div className="flex items-center gap-2 mt-4">
                  <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-semibold px-3 py-1.5 rounded-full">
                    ${totalValue.toLocaleString()}+ in total value
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-20 space-y-8">

        {/* ── Type filter pills ── */}
        <div className="flex items-center gap-2 flex-wrap">
          {TYPE_FILTERS.map(f => {
            const FIcon = f.icon
            const isActive = activeType === f.value
            const href = f.value
              ? `/offers/category/${params.slug}?type=${f.value}`
              : `/offers/category/${params.slug}`
            return (
              <Link
                key={f.value}
                href={href}
                className={`inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl border font-medium transition-all shadow-sm ${
                  isActive
                    ? 'text-white border-transparent shadow-sm'
                    : 'border-gray-200 text-gray-700 hover:text-gray-900 hover:border-gray-300 bg-white'
                }`}
                style={isActive ? { backgroundColor: category.color } : {}}
              >
                {FIcon && <FIcon className="w-3.5 h-3.5" />}
                {f.label}
                {f.value === '' && (
                  <span className={`text-xs ml-0.5 ${isActive ? 'text-white/70' : 'text-gray-600'}`}>
                    {inCategory.length}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        {/* ── Deals grid ── */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ backgroundColor: `${category.color}15` }}>
              <Icon className="w-6 h-6" style={{ color: category.color }} />
            </div>
            <p className="text-gray-700 font-medium">No {activeType || ''} deals in this category yet.</p>
            <Link href="/offers" className="text-violet-600 text-sm font-semibold mt-3 hover:underline">
              Browse all deals
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(deal => <DealCard key={deal.slug} deal={deal} />)}
          </div>
        )}

        {/* ── Explore other categories ── */}
        <section className="pt-6 border-t border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-4">Explore other categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {otherCategories.map(cat => {
              const CatIcon = cat.icon
              const count = allDeals.filter(d => d.category && cat.dbValues.includes(d.category)).length
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
                    <CatIcon className="w-4 h-4" style={{ color: cat.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 leading-tight truncate">
                      {cat.name}
                    </div>
                    {count > 0 && (
                      <div className="text-xs text-gray-600 mt-0.5">{count} deals</div>
                    )}
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-700 flex-shrink-0 transition-colors" />
                </Link>
              )
            })}
          </div>
        </section>

      </div>
    </div>
  )
}
