import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(req: Request) {
  const supabase = createClient()
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const sort = searchParams.get('sort') || 'newest'

  let query = supabase
    .from('community_posts')
    .select('*, user:users(id, email)')

  if (category && category !== 'All') {
    query = query.eq('category', category)
  }

  if (sort === 'top') {
    query = query.order('upvotes', { ascending: false })
  } else {
    query = query.order('pinned', { ascending: false }).order('created_at', { ascending: false })
  }

  const { data, error } = await query.limit(50)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Check premium status
  const adminDb = createAdminClient()
  const { data: profile } = await adminDb.from('users').select('is_premium').eq('id', user.id).single()
  if (!profile?.is_premium) return NextResponse.json({ error: 'Premium required' }, { status: 403 })

  const body = await req.json()
  const { data, error } = await supabase
    .from('community_posts')
    .insert({ user_id: user.id, title: body.title, body: body.body, category: body.category || 'General' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
