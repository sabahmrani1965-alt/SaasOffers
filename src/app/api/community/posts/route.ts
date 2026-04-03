import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(req: Request) {
  const adminDb = createAdminClient()
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const sort = searchParams.get('sort') || 'newest'

  let query = adminDb
    .from('community_posts')
    .select('*')

  if (category && category !== 'All') {
    query = query.eq('category', category)
  }

  if (sort === 'top') {
    query = query.order('upvotes', { ascending: false })
  } else {
    query = query.order('pinned', { ascending: false }).order('created_at', { ascending: false })
  }

  const { data: posts, error } = await query.limit(50)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Fetch user emails for all posts
  const userIds = [...new Set((posts || []).map((p: any) => p.user_id))]
  const { data: users } = await adminDb.from('users').select('id, email').in('id', userIds)
  const userMap: Record<string, string> = {}
  ;(users || []).forEach((u: any) => { userMap[u.id] = u.email })

  // Attach user email to posts
  const enriched = (posts || []).map((p: any) => ({
    ...p,
    user: { id: p.user_id, email: userMap[p.user_id] || 'anonymous' },
  }))

  return NextResponse.json(enriched)
}

export async function POST(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const adminDb = createAdminClient()

  const { data: profile } = await adminDb.from('users').select('is_premium').eq('id', user.id).single()
  if (!profile?.is_premium) return NextResponse.json({ error: 'Premium required' }, { status: 403 })

  const body = await req.json()
  const { data, error } = await adminDb
    .from('community_posts')
    .insert({ user_id: user.id, title: body.title, body: body.body, category: body.category || 'General' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
