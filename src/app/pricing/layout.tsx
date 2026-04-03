import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing — SaaSOffers | Free & Premium Plans',
  description:
    'Start free with 100+ startup deals or upgrade to Premium for $79/year and unlock 199+ deals, $500,000+ in credits, accelerators directory, and private founder community.',
  alternates: { canonical: 'https://saasoffers.tech/pricing' },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children
}
