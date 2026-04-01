import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const maxDuration = 60 // extend Vercel timeout to 60s

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

async function fetchAllPartnerships() {
  const key = process.env.PARTNERSTACK_API_KEY
  if (!key) throw new Error('PARTNERSTACK_API_KEY env variable is not set')

  const all: any[] = []
  let minKey = ''
  let hasMore = true
  let page = 0

  while (hasMore && page < 10) { // max 1000 items safety limit
    const url = new URL('https://api.partnerstack.com/api/v2/partnerships')
    url.searchParams.set('limit', '100')
    if (minKey) url.searchParams.set('min_key', minKey)

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(15000),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`PartnerStack API error ${res.status}: ${text}`)
    }

    const json = await res.json()
    const items: any[] = json.data?.items ?? []

    all.push(...items)
    hasMore = json.data?.has_more ?? false
    if (hasMore && items.length > 0) minKey = items[items.length - 1].key
    page++
  }

  return all
}

export async function POST() {
  try {
    const all = await fetchAllPartnerships()
    const active = all.filter(p => p.status === 'active' && !p.is_archived)

    const db = createAdminClient()

    const deals = active.map(p => ({
      name: p.company.name,
      slug: slugify(p.company.name),
      description: `Exclusive deal with ${p.company.name} via SaaSOffers partnership.`,
      long_description: null,
      value: 0,
      value_label: 'Partner Deal',
      type: 'free' as const,
      category: '',
      affiliate_link: p.link?.url ?? null,
      logo_url: null,
      logo_bg: '#7C3AED',
      featured: false,
      requirements: null,
      expires_at: null,
    }))

    // Batch upsert by slug
    const { error } = await db
      .from('deals')
      .upsert(deals, { onConflict: 'slug', ignoreDuplicates: false })

    if (error) throw new Error(error.message)

    return NextResponse.json({
      success: true,
      total: active.length,
      names: active.map(p => p.company.name),
    })
  } catch (err: any) {
    console.error('PartnerStack sync error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
