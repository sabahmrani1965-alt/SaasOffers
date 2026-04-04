import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST: Request a payout of referral credits
// For now this sends a notification to admin — manual payout via PayPal/bank transfer
export async function POST(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const adminDb = createAdminClient()
  const { data: profile } = await adminDb
    .from('users')
    .select('referral_credits, email')
    .eq('id', user.id)
    .single()

  const credits = profile?.referral_credits || 0
  if (credits < 3000) {
    return NextResponse.json({ error: 'Minimum payout is $30' }, { status: 400 })
  }

  const body = await req.json()
  const method = body.method // 'paypal' or 'bank'
  const details = body.details // PayPal email or bank info

  if (!method || !details) {
    return NextResponse.json({ error: 'Payment method and details required' }, { status: 400 })
  }

  // Log the payout request (admin will process manually)
  await adminDb.from('activity_log').insert({
    admin_id: user.id,
    action: `Payout request: $${(credits / 100).toFixed(2)} via ${method} to ${details}`,
    entity_type: 'payout',
    entity_id: user.id,
  })

  // Reset credits after payout request
  await adminDb
    .from('users')
    .update({ referral_credits: 0 })
    .eq('id', user.id)

  return NextResponse.json({
    success: true,
    amount: credits / 100,
    message: `Payout of $${(credits / 100).toFixed(2)} requested. You will receive it within 5 business days.`,
  })
}
