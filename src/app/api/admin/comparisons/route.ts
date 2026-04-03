import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

async function checkAdmin() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const db = createAdminClient()
  const { data: profile } = await db.from('users').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) return null
  return user
}

export async function GET() {
  const admin = await checkAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createAdminClient()
  const { data, error } = await db
    .from('comparisons')
    .select('*')
    .order('category')
    .order('sort_order')
  if (error) return NextResponse.json({ error: 'Failed to fetch comparisons' }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const admin = await checkAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createAdminClient()
  const body = await req.json()
  const { data, error } = await db
    .from('comparisons')
    .insert(body)
    .select()
    .single()
  if (error) return NextResponse.json({ error: 'Failed to create comparison' }, { status: 500 })
  return NextResponse.json(data)
}
