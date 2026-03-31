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

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await checkAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const db = createAdminClient()

  const { data, error } = await db.from('deals').update(body).eq('id', params.id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  await db.from('activity_log').insert({
    admin_id: admin.id,
    action: `Updated offer: ${data.name}`,
    entity_type: 'offer',
    entity_id: data.id,
  })

  return NextResponse.json({ data })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await checkAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createAdminClient()
  const { data: offer } = await db.from('deals').select('name').eq('id', params.id).single()
  const { error } = await db.from('deals').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  await db.from('activity_log').insert({
    admin_id: admin.id,
    action: `Deleted offer: ${offer?.name}`,
    entity_type: 'offer',
    entity_id: params.id,
  })

  return NextResponse.json({ ok: true })
}
