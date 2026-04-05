import { AdminHeader } from '@/components/admin/AdminHeader'
import { requireAdmin } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { Shield, Database, Key, Globe, RefreshCw } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const { user } = await requireAdmin()
  const db = createAdminClient()

  const [
    { count: userCount },
    { count: dealCount },
    { count: postCount },
  ] = await Promise.all([
    db.from('users').select('*', { count: 'exact', head: true }),
    db.from('deals').select('*', { count: 'exact', head: true }),
    db.from('blog_posts').select('*', { count: 'exact', head: true }),
  ])

  return (
    <div className="min-h-screen">
      <AdminHeader title="Settings" description="System configuration and admin account info." />

      <div className="px-8 py-6 space-y-6 max-w-3xl">
        {/* Admin account */}
        <div className="bg-gray-900 border border-white/5 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-violet-400" /> Admin Account
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2.5 border-b border-white/5">
              <span className="text-sm text-gray-500">Email</span>
              <span className="text-sm text-gray-200 font-medium">{user.email}</span>
            </div>
            <div className="flex items-center justify-between py-2.5 border-b border-white/5">
              <span className="text-sm text-gray-500">User ID</span>
              <span className="text-xs text-gray-500 font-mono">{user.id}</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-sm text-gray-500">Role</span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <Shield className="w-3 h-3" /> Admin
              </span>
            </div>
          </div>
        </div>

        {/* Database stats */}
        <div className="bg-gray-900 border border-white/5 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" /> Database
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Users', value: userCount ?? 0, color: 'text-blue-400' },
              { label: 'Offers', value: dealCount ?? 0, color: 'text-violet-400' },
              { label: 'Blog Posts', value: postCount ?? 0, color: 'text-emerald-400' },
            ].map(s => (
              <div key={s.label} className="bg-gray-800/50 rounded-xl p-4 text-center">
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Environment */}
        <div className="bg-gray-900 border border-white/5 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" /> Environment
          </h2>
          <div className="space-y-3">
            {[
              { label: 'Supabase URL', value: process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/https?:\/\//, '').split('.')[0] + '.supabase.co', ok: !!process.env.NEXT_PUBLIC_SUPABASE_URL },
              { label: 'Anon Key', value: '••••••••••••', ok: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
              { label: 'Service Role Key', value: '••••••••••••', ok: !!process.env.SUPABASE_SERVICE_ROLE_KEY },
              { label: 'Stripe Secret Key', value: '••••••••••••', ok: !!process.env.STRIPE_SECRET_KEY },
            ].map(env => (
              <div key={env.label} className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
                <span className="text-sm text-gray-500">{env.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 font-mono">{env.value}</span>
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${env.ok ? 'bg-emerald-500' : 'bg-red-500'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SQL migration instructions */}
        <div className="bg-amber-500/5 border border-amber-500/15 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-amber-300 mb-2 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Run Admin Migration
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            If you haven't run the admin migration yet, run <code className="text-amber-400 bg-amber-500/10 px-1 rounded">supabase/admin-migration.sql</code> in your Supabase SQL Editor. Then grant yourself admin:
          </p>
          <pre className="bg-gray-950 rounded-xl p-4 text-xs text-emerald-400 font-mono overflow-x-auto">
{`UPDATE public.users
SET is_admin = TRUE
WHERE email = '${user.email}';`}
          </pre>
        </div>
      </div>
    </div>
  )
}
