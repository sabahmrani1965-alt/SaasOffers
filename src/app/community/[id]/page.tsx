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
  const { data: profile } = await adminDb.from('users').select('is_premium, premium_until').eq('id', user.id).single()
  const isPremium = profile?.is_premium || (profile?.premium_until && new Date(profile.premium_until) > new Date())
  if (!isPremium) redirect('/community')

  const { data: postData } = await adminDb
    .from('community_posts')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!postData) notFound()

  // Fetch post author email
  const { data: postAuthor } = await adminDb.from('users').select('id, email').eq('id', postData.user_id).single()
  const post = { ...postData, user: postAuthor ? { id: postAuthor.id, email: postAuthor.email } : { id: postData.user_id, email: 'anonymous' } }

  // Get user's upvotes for this thread
  const { data: upvotes } = await adminDb
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
