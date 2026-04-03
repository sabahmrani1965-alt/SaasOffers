import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { ThreadClient } from '@/components/community/ThreadClient'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: { id: string }
}

export default async function ThreadPage({ params }: PageProps) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirect=/community')

  const adminDb = createAdminClient()
  const { data: profile } = await adminDb.from('users').select('is_premium').eq('id', user.id).single()
  if (!profile?.is_premium) redirect('/community')

  const { data: post } = await supabase
    .from('community_posts')
    .select('*, user:users(id, email)')
    .eq('id', params.id)
    .single()

  if (!post) notFound()

  // Get user's upvotes for this thread
  const { data: upvotes } = await supabase
    .from('community_upvotes')
    .select('post_id, reply_id')
    .eq('user_id', user.id)

  const upvotedPostIds = (upvotes || []).filter((u: any) => u.post_id).map((u: any) => u.post_id)
  const upvotedReplyIds = (upvotes || []).filter((u: any) => u.reply_id).map((u: any) => u.reply_id)

  return (
    <ThreadClient
      post={post}
      user={user}
      upvotedPostIds={upvotedPostIds}
      upvotedReplyIds={upvotedReplyIds}
    />
  )
}
