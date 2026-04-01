import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

async function fetchAllPartnerships() {
  const key = process.env.PARTNERSTACK_API_KEY!
  const all: any[] = []
  let minKey = ''
  let hasMore = true

  while (hasMore) {
    const url = new URL('https://api.partnerstack.com/api/v2/partnerships')
    url.searchParams.set('limit', '100')
    if (minKey) url.searchParams.set('min_key', minKey)

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${key}` },
    })
    const json = await res.json()
    const items: any[] = json.data?.items ?? []

    all.push(...items)
    hasMore = json.data?.has_more ?? false
    if (hasMore && items.length > 0) {
      minKey = items[items.length - 1].key
    }
  }

  return all
}

export async function POST() {
  try {
    const all = await fetchAllPartnerships()

    // Only sync active partnerships
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
      logo_url: `https://cdn.simpleicons.org/${slugify(p.company.name)}`,
      logo_bg: '#7C3AED',
      featured: false,
      requirements: null,
      expires_at: null,
    }))

    let inserted = 0
    let updated = 0

    for (const deal of deals) {
      const { data: existing } = await db
        .from('deals')
        .select('id')
        .eq('slug', deal.slug)
        .single()

      if (existing) {
        // Update affiliate link if changed
        await db
          .from('deals')
          .update({ affiliate_link: deal.affiliate_link })
          .eq('slug', deal.slug)
        updated++
      } else {
        await db.from('deals').insert(deal)
        inserted++
      }
    }

    return NextResponse.json({
      success: true,
      total: active.length,
      inserted,
      updated,
      deals: active.map(p => ({ name: p.company.name, status: p.status, url: p.link?.url })),
    })
  } catch (err: any) {
    console.error('PartnerStack sync error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
