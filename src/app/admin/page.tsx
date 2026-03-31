import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/admin-auth'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { StatCard } from '@/components/admin/StatCard'
import { Badge } from '@/components/admin/Badge'
import { Users, Package, Crown, Zap, Star, Clock, FileText } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminOverviewPage() {
  await requireAdmin()
  const db = createAdminClient()

  const [
    { count: totalUsers },
    { count: premiumUsers },
    { count: totalOffers },
    { count: featuredOffers },
    { count: totalPosts },
    { data: recentUsers },
    { data: recentOffers },
    { data: recentActivity },
  ] = await Promise.all([
    db.from('users').select('*', { count: 'exact', head: true }),
    db.from('users').select('*', { count: 'exact', head: true }).eq('is_premium', true),
    db.from('deals').select('*', { count: 'exact', head: true }),
    db.from('deals').select('*', { count: 'exact', head: true }).eq('featured', true),
    db.from('blog_posts').select('*', { count: 'exact', head: true }),
    db.from('users').select('id, email, is_premium, created_at').order('created_at', { ascending: false }).limit(5),
    db.from('deals').select('id, name, type, value_label, created_at').order('created_at', { ascending: false }).limit(5),
    db.from('activity_log').select('*').order('created_at', { ascending: false }).limit(10),
  ])

  const conversionRate = totalUsers && premiumUsers
    ? Math.round((premiumUsers / totalUsers) * 100)
    : 0

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Overview"
        description="Welcome back — here's what's happening today."
      />

      <div className="px-8 py-6 space-y-8">
        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Users"
            value={(totalUsers ?? 0).toLocaleString()}
            icon={Users}
            iconColor="text-blue-400"
            iconBg="bg-blue-500/10"
          />
          <StatCard
            label="Premium Users"
            value={(premiumUsers ?? 0).toLocaleString()}
            icon={Crown}
            trend={`${conversionRate}% conv.`}
            trendUp={conversionRate > 0}
            iconColor="text-amber-400"
            iconBg="bg-amber-500/10"
          />
          <StatCard
            label="Total Offers"
            value={(totalOffers ?? 0).toLocaleString()}
            icon={Package}
            iconColor="text-violet-400"
            iconBg="bg-violet-500/10"
          />
          <StatCard
            label="Blog Posts"
            value={(totalPosts ?? 0).toLocaleString()}
            icon={FileText}
            iconColor="text-emerald-400"
            iconBg="bg-emerald-500/10"
          />
        </div>

        {/* Two column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recent users */}
          <div className="bg-gray-900 border border-white/5 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" /> Recent Users
              </h2>
              <a href="/admin/users" className="text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors">View all →</a>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {(recentUsers ?? []).length === 0 && (
                <div className="px-5 py-8 text-center text-sm text-gray-600">No users yet</div>
              )}
              {(recentUsers ?? []).map((u: any) => (
                <div key={u.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {u.email.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm text-gray-200 font-medium truncate max-w-[180px]">{u.email}</div>
                      <div className="text-xs text-gray-600">{new Date(u.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <Badge variant={u.is_premium ? 'amber' : 'gray'}>
                    {u.is_premium ? 'Premium' : 'Free'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Recent offers */}
          <div className="bg-gray-900 border border-white/5 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-500" /> Recent Offers
              </h2>
              <a href="/admin/offers" className="text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors">Manage →</a>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {(recentOffers ?? []).length === 0 && (
                <div className="px-5 py-8 text-center text-sm text-gray-600">No offers yet</div>
              )}
              {(recentOffers ?? []).map((d: any) => (
                <div key={d.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-violet-500/10 flex items-center justify-center">
                      <Zap className="w-3.5 h-3.5 text-violet-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-200 font-medium">{d.name}</div>
                      <div className="text-xs text-emerald-400 font-medium">{d.value_label}</div>
                    </div>
                  </div>
                  <Badge variant={d.type === 'premium' ? 'violet' : d.type === 'apply' ? 'amber' : 'green'}>
                    {d.type}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity log */}
        <div className="bg-gray-900 border border-white/5 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" /> Activity Log
            </h2>
          </div>
          {(recentActivity ?? []).length === 0 ? (
            <div className="px-5 py-10 text-center">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-5 h-5 text-gray-600" />
              </div>
              <p className="text-sm text-gray-600">No activity logged yet.</p>
              <p className="text-xs text-gray-700 mt-1">Actions like creating/editing offers will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {(recentActivity ?? []).map((log: any) => (
                <div key={log.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-gray-300">{log.action}</span>
                    {log.entity_type && (
                      <span className="text-xs text-gray-600 ml-2">• {log.entity_type}</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 flex-shrink-0">
                    {new Date(log.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
