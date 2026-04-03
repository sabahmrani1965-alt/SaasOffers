import type { Metadata } from 'next'
import '../styles/globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Analytics } from '@/components/Analytics'
import { Analytics as VercelAnalytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata: Metadata = {
  title: {
    default: 'SaaSOffers — $500,000+ in Startup Credits',
    template: '%s | SaaSOffers',
  },
  description: 'Access exclusive SaaS deals and credits for your startup. AWS, Notion, Deel and 199+ tools — save thousands on your stack.',
  keywords: ['startup deals', 'saas discounts', 'startup credits', 'aws activate', 'startup perks'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://saasoffers.tech',
    siteName: 'SaaSOffers',
    title: 'SaaSOffers — $500,000+ in Startup Credits',
    description: 'Access exclusive SaaS deals and credits for your startup.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@saasoffers',
    creator: '@saasoffers',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>
        <Analytics />
        <VercelAnalytics />
        <SpeedInsights />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
