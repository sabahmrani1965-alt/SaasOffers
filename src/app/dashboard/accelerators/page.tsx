import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Crown, Zap } from 'lucide-react'
import { UpgradeButton } from '@/components/UpgradeButton'
import { DashboardNav } from '@/components/dashboard/DashboardNav'
import { AcceleratorsClient } from '@/components/dashboard/AcceleratorsClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Accelerators',
  description: 'Browse and track startup accelerator applications',
}

export default async function AcceleratorsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [{ data: profile }, { data: accelerators }, { data: statuses }, { data: saved }] = await Promise.all([
    supabase.from('users').select('is_premium').eq('id', user.id).single(),
    supabase.from('accelerators').select('*').order('deadline', { ascending: true }),
    supabase.from('user_accelerator_status').select('*').eq('user_id', user.id),
    supabase.from('user_saved_accelerators').select('*').eq('user_id', user.id),
  ])

  const isPremium = profile?.is_premium ?? false

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
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
            <UpgradeButton className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-violet-200">
              <Zap className="w-4 h-4" fill="white" />
              Upgrade to Premium
            </UpgradeButton>
          )}
        </div>

        <DashboardNav />

        <AcceleratorsClient
          accelerators={accelerators ?? []}
          statuses={statuses ?? []}
          saved={saved ?? []}
          isPremium={isPremium}
          userId={user.id}
        />
      </div>
    </div>
  )
}
