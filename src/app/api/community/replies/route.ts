import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(req: Request) {
  const adminDb = createAdminClient()
  const { searchParams } = new URL(req.url)
  const postId = searchParams.get('post_id')
  if (!postId) return NextResponse.json({ error: 'post_id required' }, { status: 400 })

  const { data, error } = await adminDb
    .from('community_replies')
    .select('*, user:users(id, email)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const adminDb = createAdminClient()

  // Check premium
  const { data: profile } = await adminDb.from('users').select('is_premium').eq('id', user.id).single()
  if (!profile?.is_premium) return NextResponse.json({ error: 'Premium required' }, { status: 403 })

  // Insert reply
  const body = await req.json()
  const { data, error } = await adminDb
    .from('community_replies')
    .insert({ user_id: user.id, post_id: body.post_id, body: body.body })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
