import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServerClient } from '@supabase/ssr'
import { sendPremiumUpgradeEmail } from '@/lib/email'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature error:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Service role client to bypass RLS
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const userId = session.metadata?.userId
    const userEmail = session.customer_email

    if (!userId) {
      console.error('No userId in checkout session metadata')
      return NextResponse.json({ error: 'No userId' }, { status: 400 })
    }

    // Update is_premium = true
    const { error } = await supabase
      .from('users')
      .update({ is_premium: true })
      .eq('id', userId)

    if (error) {
      console.error('Failed to update premium status:', error)
      return NextResponse.json({ error: 'DB update failed' }, { status: 500 })
    }

    // Send premium email
    if (userEmail) {
      await sendPremiumUpgradeEmail(userEmail)
    }

    console.log(`✅ Premium activated for user ${userId}`)
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    // Optionally revoke premium on cancellation
    const customerId = subscription.customer as string
    // You'd look up the user by stripe_customer_id if you store it
    console.log(`Subscription cancelled for customer ${customerId}`)
  }

  return NextResponse.json({ received: true })
}
