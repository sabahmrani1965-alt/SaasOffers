import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SEED_BLOG_POSTS } from '@/lib/seed-data'
import { BlogPost } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { ArrowRight, BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog — Startup SaaS Guides & Resources',
  description: 'Guides, case studies, and resources to help founders save money on their SaaS stack and build smarter startups.',
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
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-2 text-accent-300 text-sm font-medium mb-3">
            <BookOpen className="w-4 h-4" />
            Resources
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-white mb-3">
            The Startup SaaS Blog
          </h1>
          <p className="text-zinc-400 text-lg">
            Guides and strategies to help you save money and build smarter.
          </p>
        </div>

        {/* Featured post */}
        {posts[0] && (
          <Link
            href={`/blog/${posts[0].slug}`}
            className="group block bg-surface-50 hover:bg-surface-200 border border-white/5 hover:border-white/10 rounded-2xl p-8 mb-6 transition-all duration-200 hover:shadow-xl hover:shadow-black/20"
          >
            <div className="flex items-center gap-2 mb-4">
              {posts[0].category && (
                <span className="text-xs font-medium text-accent-300 bg-accent/10 border border-accent/20 px-2.5 py-1 rounded-full">
                  {posts[0].category}
                </span>
              )}
              <span className="text-xs text-zinc-500">
                {formatDistanceToNow(new Date(posts[0].created_at), { addSuffix: true })}
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl text-white mb-3 group-hover:text-accent-200 transition-colors">
              {posts[0].title}
            </h2>
            <p className="text-zinc-400 leading-relaxed mb-4 line-clamp-2">
              {posts[0].excerpt}
            </p>
            <div className="flex items-center gap-1.5 text-sm text-accent-300 font-medium">
              Read article <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        )}

        {/* Remaining posts */}
        <div className="space-y-4">
          {posts.slice(1).map(post => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex items-start gap-6 bg-surface-50 hover:bg-surface-200 border border-white/5 hover:border-white/10 rounded-xl p-6 transition-all duration-200"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {post.category && (
                    <span className="text-xs font-medium text-zinc-400">{post.category}</span>
                  )}
                  <span className="text-xs text-zinc-600">·</span>
                  <span className="text-xs text-zinc-500">
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                  </span>
                </div>
                <h2 className="font-semibold text-white text-base mb-1 group-hover:text-accent-200 transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-accent-300 transition-colors flex-shrink-0 mt-1" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
