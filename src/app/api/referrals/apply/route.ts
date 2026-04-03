import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: Request) {
  try {
    const { referral_code, new_user_id, new_user_email } = await req.json()

    if (!referral_code || !new_user_id) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const adminDb = createAdminClient()

    // Find the referrer by code
    const { data: referrer } = await adminDb
      .from('users')
      .select('id, email')
      .eq('referral_code', referral_code.toUpperCase())
      .single()

    if (!referrer) {
      return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 })
    }

    // Prevent self-referral
    if (referrer.id === new_user_id) {
      return NextResponse.json({ error: 'Cannot refer yourself' }, { status: 400 })
    }

    // Check if this user was already referred
    const { data: existing } = await adminDb
      .from('referrals')
      .select('id')
      .eq('referred_id', new_user_id)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Already referred' }, { status: 409 })
    }

    // Create referral record
    await adminDb.from('referrals').insert({
      referrer_id: referrer.id,
      referral_code: referral_code.toUpperCase(),
      referred_email: new_user_email || null,
      referred_id: new_user_id,
      status: 'rewarded',
      completed_at: new Date().toISOString(),
      rewarded_at: new Date().toISOString(),
    })

    // Grant 30 days premium to both users
    const now = new Date()
    const thirtyDays = 30 * 24 * 60 * 60 * 1000

    // Referrer: extend or set premium_until
    const { data: referrerProfile } = await adminDb
      .from('users')
      .select('premium_until')
      .eq('id', referrer.id)
      .single()

    const referrerBase = referrerProfile?.premium_until && new Date(referrerProfile.premium_until) > now
      ? new Date(referrerProfile.premium_until)
      : now
    const referrerNewExpiry = new Date(referrerBase.getTime() + thirtyDays)

    await adminDb
      .from('users')
      .update({ premium_until: referrerNewExpiry.toISOString() })
      .eq('id', referrer.id)

    // Invitee: set premium_until to 30 days from now
    const inviteeExpiry = new Date(now.getTime() + thirtyDays)
    await adminDb
      .from('users')
      .update({ premium_until: inviteeExpiry.toISOString() })
      .eq('id', new_user_id)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to apply referral' }, { status: 500 })
  }
}
