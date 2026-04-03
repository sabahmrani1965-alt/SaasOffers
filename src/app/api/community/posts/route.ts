import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!domain) return 'anonymous'
  const visible = local.slice(0, 2)
  return `${visible}***@${domain}`
}

export async function GET(req: Request) {
  // Require authentication to view community posts
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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
  if (error) return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })

  // Fetch user emails for all posts
  const userIds = Array.from(new Set((posts || []).map((p: any) => p.user_id)))
  const { data: users } = await adminDb.from('users').select('id, email').in('id', userIds)
  const userMap: Record<string, string> = {}
  ;(users || []).forEach((u: any) => { userMap[u.id] = u.email })

  // Attach masked email to posts
  const enriched = (posts || []).map((p: any) => ({
    ...p,
    user: { id: p.user_id, email: maskEmail(userMap[p.user_id] || 'anonymous') },
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

  // Input validation
  const title = typeof body.title === 'string' ? body.title.trim().slice(0, 200) : ''
  const postBody = typeof body.body === 'string' ? body.body.trim().slice(0, 5000) : ''
  const category = typeof body.category === 'string' ? body.category.trim().slice(0, 50) : 'General'

  if (!title || !postBody) {
    return NextResponse.json({ error: 'Title and body are required' }, { status: 400 })
  }

  const { data, error } = await adminDb
    .from('community_posts')
    .insert({ user_id: user.id, title, body: postBody, category })
    .select()
    .single()

  if (error) return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  return NextResponse.json(data)
}
