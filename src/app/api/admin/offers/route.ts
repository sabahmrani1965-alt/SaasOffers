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
  const type = searchParams.get('type') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 20
  const offset = (page - 1) * limit

  let query = db.from('deals').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(offset, offset + limit - 1)
  if (q) query = query.ilike('name', `%${q}%`)
  if (type) query = query.eq('type', type)

  const { data, count, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data, count, page, limit })
}

export async function POST(req: NextRequest) {
  const admin = await checkAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const db = createAdminClient()

  const { data, error } = await db.from('deals').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  await db.from('activity_log').insert({
    admin_id: admin.id,
    action: `Created offer: ${data.name}`,
    entity_type: 'offer',
    entity_id: data.id,
  })

  return NextResponse.json({ data })
}
