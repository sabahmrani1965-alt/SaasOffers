import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createCheckoutSession } from '@/lib/stripe'

async function handleCheckout() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.redirect(new URL('/signup?plan=premium', process.env.NEXT_PUBLIC_SITE_URL || 'https://saasoffers.tech'))
  }

  // Check if user was referred (eligible for $30 off)
  const adminDb = createAdminClient()
  const { data: profile } = await adminDb
    .from('users')
    .select('referred_by')
    .eq('id', user.id)
    .single()

  const hasReferral = !!profile?.referred_by

  const session = await createCheckoutSession(user.id, user.email!, hasReferral)

  if (session.url) {
    return NextResponse.redirect(session.url)
  }

  return NextResponse.redirect(new URL('/dashboard', process.env.NEXT_PUBLIC_SITE_URL || 'https://saasoffers.tech'))
}

export async function GET() {
  try {
    return await handleCheckout()
  } catch (err: any) {
    console.error('Stripe checkout error:', err)
    return NextResponse.redirect(new URL('/dashboard', process.env.NEXT_PUBLIC_SITE_URL || 'https://saasoffers.tech'))
  }
}

export async function POST() {
  try {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user was referred (eligible for $30 off)
    const adminDb = createAdminClient()
    const { data: profile } = await adminDb
      .from('users')
      .select('referred_by')
      .eq('id', user.id)
      .single()

    const hasReferral = !!profile?.referred_by

    const session = await createCheckoutSession(user.id, user.email!, hasReferral)

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: 'Checkout failed. Please try again.' }, { status: 500 })
  }
}
