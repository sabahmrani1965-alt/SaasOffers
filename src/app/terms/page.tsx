import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'SaaSOffers Terms of Service',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-4xl text-white mb-2">Terms of Service</h1>
        <p className="text-zinc-500 text-sm mb-10">Last updated: January 1, 2025</p>

        <div className="prose prose-sm max-w-none space-y-8">
          {[
            {
              title: '1. Acceptance of Terms',
              content: 'By accessing or using SaaSOffers, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.',
            },
            {
              title: '2. Service Description',
              content: 'SaaSOffers provides a platform for startup founders to access exclusive discounts and credits from SaaS providers. We act as an intermediary and do not guarantee the availability or terms of any third-party deals.',
            },
            {
              title: '3. Account Responsibilities',
              content: 'You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate information and to notify us immediately of any unauthorized use of your account.',
            },
            {
              title: '4. Premium Subscriptions',
              content: 'Premium subscriptions are billed annually. Subscriptions automatically renew unless cancelled before the renewal date. Refunds are available within 14 days of initial purchase if no premium deals have been unlocked.',
            },
            {
              title: '5. Deal Terms',
              content: 'Deals are provided by third-party SaaS companies. SaaSOffers does not guarantee the continued availability of any deal or the terms of service of any third party. We reserve the right to modify or remove deals at any time.',
            },
            {
              title: '6. Prohibited Uses',
              content: 'You may not use our service to distribute, sell, or transfer access codes to third parties. Each deal may only be redeemed once per company. Violation of these terms may result in immediate account termination.',
            },
            {
              title: '7. Limitation of Liability',
              content: 'SaaSOffers shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our service or inability to access any third-party deals.',
            },
            {
              title: '8. Contact',
              content: 'For questions about these terms, contact us at ilyas@saasoffers.tech.',
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
