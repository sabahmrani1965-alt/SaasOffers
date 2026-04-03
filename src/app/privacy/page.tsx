import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'SaaSOffers Privacy Policy',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-display text-4xl text-white mb-2">Privacy Policy</h1>
        <p className="text-zinc-500 text-sm mb-10">Last updated: January 1, 2025</p>

        <div className="space-y-8">
          {[
            {
              title: 'Information We Collect',
              content: 'We collect information you provide directly to us, including your email address and payment information when you create an account or subscribe to Premium. We also collect usage data such as which deals you browse and unlock.',
            },
            {
              title: 'How We Use Your Information',
              content: 'We use your information to provide and improve our services, process payments, send transactional emails (account confirmation, deal unlock confirmations), and send periodic deal notification emails. You can opt out of marketing emails at any time.',
            },
            {
              title: 'Data Storage',
              content: 'Your data is stored securely using Supabase, which is hosted on AWS infrastructure. Payment information is processed and stored by Stripe — we never store your full card details.',
            },
            {
              title: 'Third-Party Services',
              content: 'We use Stripe for payment processing, Resend for email delivery, and Google Analytics for anonymous usage analytics. Each of these services has their own privacy policy.',
            },
            {
              title: 'Cookies',
              content: 'We use cookies to maintain your session and remember your login state. We use Google Analytics cookies for anonymous usage tracking. You can disable cookies in your browser settings.',
            },
            {
              title: 'Your Rights',
              content: 'You have the right to access, correct, or delete your personal data at any time. To request deletion of your account and associated data, contact us at ilyas@saasoffers.tech.',
            },
            {
              title: 'Data Retention',
              content: 'We retain your account data for as long as your account is active. If you delete your account, we will remove your personal data within 30 days, except where required by law.',
            },
            {
              title: 'Contact',
              content: 'For privacy inquiries, contact us at ilyas@saasoffers.tech.',
            },
          ].map(section => (
            <div key={section.title}>
              <h2 className="text-white font-semibold text-base mb-2">{section.title}</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
