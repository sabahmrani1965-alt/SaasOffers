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

    const { error } = await supabase
      .from('users')
      .update({ is_premium: true })
      .eq('id', userId)

    if (error) {
      console.error('Failed to update premium status:', error)
      return NextResponse.json({ error: 'DB update failed' }, { status: 500 })
    }

    if (userEmail) {
      await sendPremiumUpgradeEmail(userEmail)
    }

    // Referral reward: if this user was referred, grant $30 credit to referrer
    const { data: userProfile } = await supabase
      .from('users')
      .select('referred_by')
      .eq('id', userId)
      .single()

    if (userProfile?.referred_by) {
      // Find the pending referral and mark as rewarded
      const { data: referral } = await supabase
        .from('referrals')
        .select('id, referrer_id')
        .eq('referred_id', userId)
        .eq('status', 'pending')
        .single()

      if (referral) {
        // Grant $30 credit (3000 cents) to the referrer
        const { data: referrerProfile } = await supabase
          .from('users')
          .select('referral_credits')
          .eq('id', referral.referrer_id)
          .single()

        const currentCredits = referrerProfile?.referral_credits || 0
        await supabase
          .from('users')
          .update({ referral_credits: currentCredits + 3000 })
          .eq('id', referral.referrer_id)

        // Update referral status
        await supabase
          .from('referrals')
          .update({ status: 'rewarded', rewarded_at: new Date().toISOString() })
          .eq('id', referral.id)

        console.log(`Referral reward: $30 credit granted to referrer ${referral.referrer_id}`)
      }
    }

    console.log(`Premium activated for user ${userId}`)
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    const customerId = subscription.customer as string

    try {
      const customer = await stripe.customers.retrieve(customerId)
      if (!customer.deleted && customer.email) {
        const { error } = await supabase
          .from('users')
          .update({ is_premium: false })
          .eq('email', customer.email)

        if (error) {
          console.error('Failed to revoke premium:', error)
        } else {
          console.log(`Premium revoked for customer ${customerId} (${customer.email})`)
        }
      }
    } catch (err) {
      console.error('Failed to process subscription cancellation:', err)
    }
  }

  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as Stripe.Subscription
    const customerId = subscription.customer as string

    if (subscription.status === 'past_due' || subscription.status === 'unpaid' || subscription.status === 'canceled') {
      try {
        const customer = await stripe.customers.retrieve(customerId)
        if (!customer.deleted && customer.email) {
          await supabase
            .from('users')
            .update({ is_premium: false })
            .eq('email', customer.email)

          console.log(`Premium revoked (${subscription.status}) for ${customer.email}`)
        }
      } catch (err) {
        console.error('Failed to process subscription update:', err)
      }
    }
  }

  return NextResponse.json({ received: true })
}
