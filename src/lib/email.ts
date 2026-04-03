import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL || 'ilyas@saasoffers.tech'

export async function sendWelcomeEmail(email: string) {
  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: 'Welcome to SaaSOffers 🎉',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #fff; padding: 40px; border-radius: 12px;">
          <h1 style="font-size: 28px; margin-bottom: 8px;">Welcome to SaaSOffers</h1>
          <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6;">
            You now have access to exclusive SaaS deals for your startup. Start saving thousands today.
          </p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/offers" 
             style="display: inline-block; background: #6366f1; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 24px; font-weight: 600;">
            Browse Deals →
          </a>
          <p style="color: #52525b; font-size: 14px; margin-top: 40px;">
            The SaaSOffers Team
          </p>
        </div>
      `,
    })
  } catch (error) {
    console.error('Failed to send welcome email:', error)
  }
}

export async function sendPremiumUpgradeEmail(email: string) {
  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: '🔓 You now have Premium access — $500,000+ in credits await',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #fff; padding: 40px; border-radius: 12px;">
          <h1 style="font-size: 28px; margin-bottom: 8px;">Premium Unlocked 🚀</h1>
          <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6;">
            You now have full access to all premium deals including AWS ($5,000), Deel ($1,500), and more.
          </p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/offers" 
             style="display: inline-block; background: #6366f1; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 24px; font-weight: 600;">
            Unlock All Deals →
          </a>
        </div>
      `,
    })
  } catch (error) {
    console.error('Failed to send premium email:', error)
  }
}

export async function sendNewDealsEmail(emails: string[]) {
  // Batch send in chunks of 50
  const chunks = []
  for (let i = 0; i < emails.length; i += 50) {
    chunks.push(emails.slice(i, i + 50))
  }
  for (const chunk of chunks) {
    await Promise.allSettled(
      chunk.map(email =>
        resend.emails.send({
          from: FROM,
          to: email,
          subject: '🎁 New deals just dropped on SaaSOffers',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #fff; padding: 40px; border-radius: 12px;">
              <h1 style="font-size: 24px;">New deals available!</h1>
              <p style="color: #a1a1aa;">We just added new exclusive deals. Don't miss out.</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/offers"
                 style="display: inline-block; background: #6366f1; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 24px;">
                View Deals →
              </a>
            </div>
          `,
        })
      )
    )
  }
}
