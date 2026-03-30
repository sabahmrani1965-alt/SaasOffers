import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import { SEED_DEALS, SEED_BLOG_POSTS } from '@/lib/seed-data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://saasoffers.com'

  const supabase = createClient()

  const { data: deals } = await supabase.from('deals').select('slug, created_at')
  const { data: posts } = await supabase.from('blog_posts').select('slug, created_at').eq('published', true)

  const dealSlugs = (deals && deals.length > 0 ? deals : SEED_DEALS).map((d: any) => ({
    slug: d.slug,
    date: d.created_at,
  }))

  const postSlugs = (posts && posts.length > 0 ? posts : SEED_BLOG_POSTS).map((p: any) => ({
    slug: p.slug,
    date: p.created_at,
  }))

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/offers`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/signup`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    ...dealSlugs.map((d) => ({
      url: `${baseUrl}/offers/${d.slug}`,
      lastModified: d.date ? new Date(d.date) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...postSlugs.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: p.date ? new Date(p.date) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
