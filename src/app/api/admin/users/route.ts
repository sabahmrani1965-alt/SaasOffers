import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

async function checkAdmin() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const db = createAdminClient()
  const { data: profile } = await db.from('users').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) return null
  return user
}

export async function GET(req: NextRequest) {
  const admin = await checkAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createAdminClient()
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''
  const plan = searchParams.get('plan') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 20
  const offset = (page - 1) * limit

  let query = db.from('users').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(offset, offset + limit - 1)
  if (q) query = query.ilike('email', `%${q}%`)
  if (plan === 'premium') query = query.eq('is_premium', true)
  if (plan === 'free') query = query.eq('is_premium', false)

  const { data, count, error } = await query
  if (error) return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })

  // Fetch referral counts for all users on this page
  const userIds = (data || []).map((u: any) => u.id)
  const { data: referralCounts } = await db
    .from('referrals')
    .select('referrer_id, status')
    .in('referrer_id', userIds)

  // Build referral stats per user
  const referralStats: Record<string, { invited: number; earned: number }> = {}
  ;(referralCounts || []).forEach((r: any) => {
    if (!referralStats[r.referrer_id]) referralStats[r.referrer_id] = { invited: 0, earned: 0 }
    referralStats[r.referrer_id].invited++
    if (r.status === 'rewarded') referralStats[r.referrer_id].earned++
  })

  // Attach referral stats to users
  const enriched = (data || []).map((u: any) => ({
    ...u,
    referrals: referralStats[u.id] || { invited: 0, earned: 0 },
  }))

  return NextResponse.json({ data: enriched, count, page, limit })
}
