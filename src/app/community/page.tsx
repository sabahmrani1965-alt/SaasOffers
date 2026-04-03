import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { CommunityClient } from '@/components/community/CommunityClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Founder Community — SaaSOffers',
  description: 'A private community for startup founders — share advice, ask questions, and connect with 2,000+ founders building in 2026.',
}

export default async function CommunityPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isPremium = false
  if (user) {
    const adminDb = createAdminClient()
    const { data: profile } = await adminDb.from('users').select('is_premium').eq('id', user.id).single()
    isPremium = profile?.is_premium ?? false
  }

  // Fetch user's upvotes for highlighting
  let userUpvotes: string[] = []
  if (user) {
    const { data: upvotes } = await supabase
      .from('community_upvotes')
      .select('post_id')
      .eq('user_id', user.id)
      .not('post_id', 'is', null)
    userUpvotes = (upvotes || []).map((u: any) => u.post_id)
  }

  return (
    <CommunityClient
      user={user}
      isPremium={isPremium}
      userUpvotes={userUpvotes}
    />
  )
}
