import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const adminDb = createAdminClient()

  // Get or create referral code
  const { data: profile } = await adminDb
    .from('users')
    .select('referral_code')
    .eq('id', user.id)
    .single()

  let referralCode = profile?.referral_code

  if (!referralCode) {
    referralCode = generateCode()
    await adminDb
      .from('users')
      .update({ referral_code: referralCode })
      .eq('id', user.id)
  }

  // Get referral stats
  const { data: referrals } = await adminDb
    .from('referrals')
    .select('*')
    .eq('referrer_id', user.id)
    .order('created_at', { ascending: false })

  const allReferrals = referrals || []
  const completed = allReferrals.filter(r => r.status === 'completed' || r.status === 'rewarded')
  const rewarded = allReferrals.filter(r => r.status === 'rewarded')

  // Mask emails in referral list
  const list = allReferrals.map(r => ({
    id: r.id,
    status: r.status,
    email: r.referred_email ? maskEmail(r.referred_email) : null,
    created_at: r.created_at,
    rewarded_at: r.rewarded_at,
  }))

  return NextResponse.json({
    referral_code: referralCode,
    stats: {
      invited: allReferrals.length,
      joined: completed.length,
      months_earned: rewarded.length,
    },
    referrals: list,
  })
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!domain) return 'anonymous'
  return `${local.slice(0, 2)}***@${domain}`
}
