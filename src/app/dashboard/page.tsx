import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SEED_DEALS } from '@/lib/seed-data'
import { DealBadge } from '@/components/ui/DealBadge'
import { Crown, Zap, ArrowRight, DollarSign, Lock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your SaaSOffers dashboard',
}

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user ?? null

  if (!user) redirect('/login')

  // Get user profile
  const { data: profile } = await supabase
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

  // Fallback: if no DB deals exist yet, show seed data that match unlocked ids
  const unlockedDeals = unlockedRows ?? []

  // Recommended deals (not yet unlocked)
  const { data: allDeals } = await supabase.from('deals').select('*').limit(6)
  const deals = allDeals && allDeals.length > 0 ? allDeals : SEED_DEALS
  const unlockedIds = new Set(unlockedDeals.map((u: any) => u.deal_id || u.deal?.id))
  const recommended = deals.filter((d: any) => !unlockedIds.has(d.id)).slice(0, 3)

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-zinc-500 text-sm mt-1">{user.email}</p>
          </div>
          {isPremium ? (
            <div className="flex items-center gap-2 bg-accent/10 border border-accent/20 text-accent-300 text-sm font-medium px-4 py-2 rounded-full">
              <Crown className="w-4 h-4 fill-current" />
              Premium Member
            </div>
          ) : (
            <Link
              href="/api/stripe/checkout"
              className="flex items-center gap-2 bg-accent hover:bg-accent-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-lg shadow-accent/20"
            >
              <Zap className="w-4 h-4" fill="white" />
              Upgrade to Premium
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            {
              label: 'Deals Unlocked',
              value: unlockedDeals.length,
              icon: Zap,
              color: 'text-accent-300',
              bg: 'bg-accent/10',
            },
            {
              label: 'Total Saved',
              value: `$${unlockedDeals.reduce((sum: number, u: any) => sum + (u.deal?.value || 0), 0).toLocaleString()}`,
              icon: DollarSign,
              color: 'text-emerald-400',
              bg: 'bg-emerald-500/10',
            },
            {
              label: 'Plan',
              value: isPremium ? 'Premium' : 'Free',
              icon: Crown,
              color: isPremium ? 'text-amber-400' : 'text-zinc-400',
              bg: isPremium ? 'bg-amber-500/10' : 'bg-white/5',
            },
          ].map(stat => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-surface-50 border border-white/5 rounded-xl p-5 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-zinc-500">{stat.label}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Unlocked Deals */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-white mb-4">Your Unlocked Deals</h2>
          {unlockedDeals.length === 0 ? (
            <div className="bg-surface-50 border border-white/5 rounded-2xl p-10 text-center">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-zinc-500" />
              </div>
              <p className="text-zinc-400 text-sm mb-4">You haven't unlocked any deals yet.</p>
              <Link
                href="/offers"
                className="inline-flex items-center gap-1.5 text-sm text-accent-300 hover:text-accent-200 font-medium transition-colors"
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
                  <div key={unlocked.deal_id} className="flex items-center justify-between bg-surface-50 border border-white/5 rounded-xl px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-bold text-xs"
                        style={{ backgroundColor: deal.logo_bg || '#6366f1' }}
                      >
                        {deal.name?.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-white text-sm">{deal.name}</div>
                        <div className="text-xs text-emerald-400">{deal.value_label}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <DealBadge type={deal.type} />
                      <Link
                        href={`/offers/${deal.slug}`}
                        className="text-xs text-zinc-500 hover:text-white transition-colors"
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
              <h2 className="text-lg font-semibold text-white">Recommended Deals</h2>
              <Link href="/offers" className="text-sm text-accent-300 hover:text-accent-200 transition-colors">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {recommended.map((deal: any) => (
                <div key={deal.slug} className="flex items-center justify-between bg-surface-50 border border-white/5 rounded-xl px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-bold text-xs"
                      style={{ backgroundColor: deal.logo_bg || '#6366f1' }}
                    >
                      {deal.name?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-white text-sm">{deal.name}</div>
                      <div className="text-xs text-emerald-400">{deal.value_label}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DealBadge type={deal.type} />
                    {deal.type === 'premium' && !isPremium ? (
                      <Lock className="w-4 h-4 text-zinc-600" />
                    ) : (
                      <Link href={`/offers/${deal.slug}`} className="text-xs text-zinc-500 hover:text-white transition-colors">
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
          <div className="mt-10 relative bg-accent/5 border border-accent/20 rounded-2xl p-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-radial from-accent/10 via-transparent to-transparent pointer-events-none" />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-white mb-1 flex items-center gap-2">
                  <Crown className="w-4 h-4 text-accent-300" />
                  Upgrade to Premium
                </h3>
                <p className="text-zinc-400 text-sm">Unlock AWS ($5,000), Deel ($1,500) and all premium deals for just $79/year.</p>
              </div>
              <Link
                href="/api/stripe/checkout"
                className="flex-shrink-0 flex items-center gap-2 bg-accent hover:bg-accent-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-accent/25"
              >
                Upgrade — $79/yr <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
