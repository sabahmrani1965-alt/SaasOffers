import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { SEED_DEALS } from '@/lib/seed-data'
import { DealBadge } from '@/components/ui/DealBadge'
import { Crown, Zap, ArrowRight, DollarSign, Lock } from 'lucide-react'
import { UpgradeButton } from '@/components/UpgradeButton'
import { DashboardNav } from '@/components/dashboard/DashboardNav'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your SaaSOffers dashboard',
}

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Get user profile using admin client to bypass RLS
  const adminDb = createAdminClient()
  const { data: profile } = await adminDb
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  const isPremium = profile?.is_premium ?? false

  // Get unlocked deals
  const { data: unlockedRows } = await supabase
    .from('unlocked_deals')
    .select('*, deal:deals(*)')
    .eq('user_id', user.id)

  const unlockedDeals = unlockedRows ?? []

  // Recommended deals (not yet unlocked)
  const { data: allDeals } = await supabase.from('deals').select('*').limit(6)
  const deals = allDeals && allDeals.length > 0 ? allDeals : SEED_DEALS
  const unlockedIds = new Set(unlockedDeals.map((u: any) => u.deal_id || u.deal?.id))
  const recommended = deals.filter((d: any) => !unlockedIds.has(d.id)).slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-700 text-sm mt-1">{user.email}</p>
          </div>
          {isPremium ? (
            <div className="flex items-center gap-2 bg-violet-50 border border-violet-100 text-violet-700 text-sm font-semibold px-4 py-2 rounded-full">
              <Crown className="w-4 h-4 fill-current" />
              Premium Member
            </div>
          ) : (
            <UpgradeButton
              className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-violet-200"
            >
              <Zap className="w-4 h-4" fill="white" />
              Upgrade to Premium
            </UpgradeButton>
          )}
        </div>

        {/* Dashboard Navigation */}
        <DashboardNav />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            {
              label: 'Deals Unlocked',
              value: unlockedDeals.length,
              icon: Zap,
              color: 'text-violet-600',
              bg: 'bg-violet-50',
            },
            {
              label: 'Total Saved',
              value: `$${unlockedDeals.reduce((sum: number, u: any) => sum + (u.deal?.value || 0), 0).toLocaleString()}`,
              icon: DollarSign,
              color: 'text-emerald-600',
              bg: 'bg-emerald-50',
            },
            {
              label: 'Plan',
              value: isPremium ? 'Premium' : 'Free',
              icon: Crown,
              color: isPremium ? 'text-amber-600' : 'text-gray-700',
              bg: isPremium ? 'bg-amber-50' : 'bg-gray-100',
            },
          ].map(stat => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-4 shadow-card">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-700 font-medium">{stat.label}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Unlocked Deals */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Unlocked Deals</h2>
          {unlockedDeals.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center shadow-card">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-gray-600" />
              </div>
              <p className="text-gray-700 text-sm mb-4 font-medium">You haven't unlocked any deals yet.</p>
              <Link
                href="/offers"
                className="inline-flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-700 font-semibold transition-colors"
              >
                Browse all deals <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {unlockedDeals.map((unlocked: any) => {
                const deal = unlocked.deal
                if (!deal) return null
                return (
                  <div key={unlocked.deal_id} className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-5 py-4 shadow-card">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-bold text-xs"
                        style={{ backgroundColor: deal.logo_bg || '#7C3AED' }}
                      >
                        {deal.name?.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{deal.name}</div>
                        <div className="text-xs text-emerald-600 font-medium">{deal.value_label}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <DealBadge type={deal.type} />
                      <Link
                        href={`/offers/${deal.slug}`}
                        className="text-gray-600 hover:text-violet-600 transition-colors"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Recommended */}
        {recommended.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recommended Deals</h2>
              <Link href="/offers" className="text-sm text-violet-600 hover:text-violet-700 font-semibold transition-colors">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {recommended.map((deal: any) => (
                <div key={deal.slug} className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-5 py-4 shadow-card">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-bold text-xs"
                      style={{ backgroundColor: deal.logo_bg || '#7C3AED' }}
                    >
                      {deal.name?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{deal.name}</div>
                      <div className="text-xs text-emerald-600 font-medium">{deal.value_label}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DealBadge type={deal.type} />
                    {deal.type === 'premium' && !isPremium ? (
                      <Lock className="w-4 h-4 text-gray-600" />
                    ) : (
                      <Link href={`/offers/${deal.slug}`} className="text-gray-600 hover:text-violet-600 transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Premium upsell */}
        {!isPremium && (
          <div className="mt-10 relative bg-gradient-to-br from-violet-600 to-pink-500 rounded-2xl p-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-transparent pointer-events-none" />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-white mb-1 flex items-center gap-2">
                  <Crown className="w-4 h-4 fill-current" />
                  Upgrade to Premium
                </h3>
                <p className="text-white/80 text-sm">Unlock AWS ($5,000), Deel ($1,500) and all premium deals for just $79/year.</p>
              </div>
              <UpgradeButton
                className="flex-shrink-0 flex items-center gap-2 bg-white text-violet-700 hover:bg-violet-50 text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg"
              >
                Upgrade — $79/yr <ArrowRight className="w-4 h-4" />
              </UpgradeButton>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
