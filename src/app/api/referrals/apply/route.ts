import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// This endpoint is called at signup — it only TRACKS the referral (pending).
// The $30 reward is granted later when the referred user upgrades to Premium (via Stripe webhook).

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

    // Create referral record as pending (reward happens when they upgrade)
    await adminDb.from('referrals').insert({
      referrer_id: referrer.id,
      referral_code: referral_code.toUpperCase(),
      referred_email: new_user_email || null,
      referred_id: new_user_id,
      status: 'pending',
    })

    // Store who referred this user (used at checkout to apply $30 discount)
    await adminDb
      .from('users')
      .update({ referred_by: referral_code.toUpperCase() })
      .eq('id', new_user_id)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to apply referral' }, { status: 500 })
  }
}
