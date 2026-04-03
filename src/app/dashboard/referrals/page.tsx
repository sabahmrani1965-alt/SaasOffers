import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { DashboardNav } from '@/components/dashboard/DashboardNav'
import { ReferralsClient } from '@/components/dashboard/ReferralsClient'
import { isUserPremium } from '@/lib/premium'
import { Crown, Zap } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ReferralsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const adminDb = createAdminClient()
  const { data: profile } = await adminDb
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  const isPremium = isUserPremium(profile || {})

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-700 text-sm mt-1">{user.email}</p>
          </div>
          {isPremium ? (
            <div className="flex items-center gap-2 bg-violet-50 border border-violet-100 text-violet-700 text-sm font-semibold px-4 py-2 rounded-full">
              <Crown className="w-4 h-4" /> Premium Member
            </div>
          ) : (
            <Link href="/pricing" className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-pink-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all">
              <Zap className="w-4 h-4" fill="currentColor" /> Upgrade to Premium
            </Link>
          )}
        </div>

        <DashboardNav />
        <ReferralsClient />
      </div>
    </div>
  )
}
