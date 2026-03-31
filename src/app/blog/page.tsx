import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { SEED_BLOG_POSTS } from '@/lib/seed-data'
import { BlogPost } from '@/types'
import { BlogList } from '@/components/blog/BlogList'
import { BookOpen, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog — Startup SaaS Guides & Resources | SaaSOffers',
  description: 'Guides, case studies, and resources to help founders save money on their SaaS stack, unlock startup credits, and build smarter companies.',
  alternates: { canonical: 'https://saas-offers.vercel.app/blog' },
}

export default async function BlogPage() {
  const supabase = createClient()
  const { data: dbPosts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  const posts: BlogPost[] = (dbPosts && dbPosts.length > 0 ? dbPosts : SEED_BLOG_POSTS) as BlogPost[]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero header ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-12">
          <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-100 text-violet-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
            <BookOpen className="w-3.5 h-3.5" />
            {posts.length} articles published
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            The Startup SaaS Blog
          </h1>
          <p className="text-gray-700 text-lg max-w-xl leading-relaxed">
            Guides, case studies, and strategies to help founders save money, unlock credits, and build smarter companies.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-6 mt-8 pt-8 border-t border-gray-100">
            {[
              { icon: Zap, label: 'Guides & resources', value: posts.length.toString() },
              { icon: BookOpen, label: 'Avg. read time', value: '5 min' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">{value}</div>
                  <div className="text-xs text-gray-600">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Blog content ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 pb-20">
        <BlogList posts={posts} />
      </div>

    </div>
  )
}
