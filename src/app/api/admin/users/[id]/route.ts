import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

async function checkAdmin() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const db = createAdminClient()
  const { data: profile } = await db.from('users').select('is_admin, admin_role').eq('id', user.id).single()
  if (!profile?.is_admin) return null
  if (profile.admin_role === 'offers') return null
  return user
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await checkAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const db = createAdminClient()

  const { data, error } = await db.from('users').update(body).eq('id', params.id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  await db.from('activity_log').insert({
    admin_id: admin.id,
    action: `Updated user: ${data.email} — plan: ${data.is_premium ? 'Premium' : 'Free'}`,
    entity_type: 'user',
    entity_id: data.id,
  })

  return NextResponse.json({ data })
}
