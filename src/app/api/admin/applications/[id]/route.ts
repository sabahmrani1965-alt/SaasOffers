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

  const { status } = await req.json()
  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const db = createAdminClient()
  const { data, error } = await db
    .from('offer_applications')
    .update({ status })
    .eq('id', params.id)
    .select('*, user:users(email), deal:deals(name)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  await db.from('activity_log').insert({
    admin_id: admin.id,
    action: `${status === 'approved' ? 'Approved' : 'Rejected'} application from ${(data as any).user?.email} for ${(data as any).deal?.name}`,
    entity_type: 'application',
    entity_id: params.id,
  })

  return NextResponse.json({ data })
}
