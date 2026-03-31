import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

async function checkAdmin() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const db = createAdminClient()
  const { data: profile } = await db.from('users').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) return null
  return user
}

export async function GET(req: NextRequest) {
  const admin = await checkAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createAdminClient()
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''
  const published = searchParams.get('published')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 20
  const offset = (page - 1) * limit

  let query = db.from('blog_posts').select('id, title, slug, category, author, published, created_at, excerpt', { count: 'exact' }).order('created_at', { ascending: false }).range(offset, offset + limit - 1)
  if (q) query = query.ilike('title', `%${q}%`)
  if (published === 'true') query = query.eq('published', true)
  if (published === 'false') query = query.eq('published', false)

  const { data, count, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data, count, page, limit })
}

export async function POST(req: NextRequest) {
  const admin = await checkAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const db = createAdminClient()

  const { data, error } = await db.from('blog_posts').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  await db.from('activity_log').insert({
    admin_id: admin.id,
    action: `Created post: ${data.title}`,
    entity_type: 'blog_post',
    entity_id: data.id,
  })

  return NextResponse.json({ data })
}
