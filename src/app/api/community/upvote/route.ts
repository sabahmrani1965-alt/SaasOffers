import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { post_id, reply_id } = body

  if (post_id) {
    // Check if already upvoted
    const { data: existing } = await supabase
      .from('community_upvotes')
      .select('id')
      .eq('user_id', user.id)
      .eq('post_id', post_id)
      .single()

    if (existing) {
      // Remove upvote
      await supabase.from('community_upvotes').delete().eq('id', existing.id)
      const { data: post } = await supabase.from('community_posts').select('upvotes').eq('id', post_id).single()
      if (post) await supabase.from('community_posts').update({ upvotes: Math.max(0, (post.upvotes || 0) - 1) }).eq('id', post_id)
      return NextResponse.json({ action: 'removed' })
    } else {
      // Add upvote
      await supabase.from('community_upvotes').insert({ user_id: user.id, post_id })
      const { data: post } = await supabase.from('community_posts').select('upvotes').eq('id', post_id).single()
      if (post) await supabase.from('community_posts').update({ upvotes: (post.upvotes || 0) + 1 }).eq('id', post_id)
      return NextResponse.json({ action: 'added' })
    }
  }

  if (reply_id) {
    const { data: existing } = await supabase
      .from('community_upvotes')
      .select('id')
      .eq('user_id', user.id)
      .eq('reply_id', reply_id)
      .single()

    if (existing) {
      await supabase.from('community_upvotes').delete().eq('id', existing.id)
      const { data: reply } = await supabase.from('community_replies').select('upvotes').eq('id', reply_id).single()
      if (reply) await supabase.from('community_replies').update({ upvotes: Math.max(0, (reply.upvotes || 0) - 1) }).eq('id', reply_id)
      return NextResponse.json({ action: 'removed' })
    } else {
      await supabase.from('community_upvotes').insert({ user_id: user.id, reply_id })
      const { data: reply } = await supabase.from('community_replies').select('upvotes').eq('id', reply_id).single()
      if (reply) await supabase.from('community_replies').update({ upvotes: (reply.upvotes || 0) + 1 }).eq('id', reply_id)
      return NextResponse.json({ action: 'added' })
    }
  }

  return NextResponse.json({ error: 'post_id or reply_id required' }, { status: 400 })
}
