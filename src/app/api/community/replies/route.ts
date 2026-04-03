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
  // Require authentication
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const adminDb = createAdminClient()
  const { searchParams } = new URL(req.url)
  const postId = searchParams.get('post_id')
  if (!postId) return NextResponse.json({ error: 'post_id required' }, { status: 400 })

  const { data: replies, error } = await adminDb
    .from('community_replies')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: 'Failed to fetch replies' }, { status: 500 })

  // Fetch user emails
  const userIds = Array.from(new Set((replies || []).map((r: any) => r.user_id)))
  const { data: users } = await adminDb.from('users').select('id, email').in('id', userIds)
  const userMap: Record<string, string> = {}
  ;(users || []).forEach((u: any) => { userMap[u.id] = u.email })

  const enriched = (replies || []).map((r: any) => ({
    ...r,
    user: { id: r.user_id, email: maskEmail(userMap[r.user_id] || 'anonymous') },
  }))

  return NextResponse.json(enriched)
}

export async function POST(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const adminDb = createAdminClient()

  const { data: profile } = await adminDb.from('users').select('is_premium, premium_until').eq('id', user.id).single()
  const isPremium = profile?.is_premium || (profile?.premium_until && new Date(profile.premium_until) > new Date())
  if (!isPremium) return NextResponse.json({ error: 'Premium required' }, { status: 403 })

  const body = await req.json()

  const replyBody = typeof body.body === 'string' ? body.body.trim().slice(0, 5000) : ''
  const postId = body.post_id

  if (!replyBody || !postId) {
    return NextResponse.json({ error: 'Body and post_id are required' }, { status: 400 })
  }

  const { data, error } = await adminDb
    .from('community_replies')
    .insert({ user_id: user.id, post_id: postId, body: replyBody })
    .select()
    .single()

  if (error) return NextResponse.json({ error: 'Failed to create reply' }, { status: 500 })
  return NextResponse.json(data)
}
