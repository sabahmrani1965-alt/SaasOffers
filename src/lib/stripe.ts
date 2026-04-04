import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
  typescript: true,
})

export async function createCheckoutSession(userId: string, userEmail: string, referralDiscount?: boolean) {
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: userEmail,
    metadata: { userId },
    line_items: [
      {
        price: process.env.STRIPE_PREMIUM_PRICE_ID!,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgrade=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?upgrade=cancelled`,
  }

  // Apply $30 off coupon for referred users
  if (referralDiscount) {
    const coupon = await getOrCreateReferralCoupon()
    sessionParams.discounts = [{ coupon: coupon.id }]
  }

  const session = await stripe.checkout.sessions.create(sessionParams)
  return session
}

// Get or create a $30 off coupon for referrals
async function getOrCreateReferralCoupon(): Promise<Stripe.Coupon> {
  const couponId = 'REFERRAL30'
  try {
    return await stripe.coupons.retrieve(couponId)
  } catch {
    return await stripe.coupons.create({
      id: couponId,
      amount_off: 3000, // $30 in cents
      currency: 'usd',
      duration: 'once',
      name: 'Referral Discount — $30 off',
    })
  }
}
