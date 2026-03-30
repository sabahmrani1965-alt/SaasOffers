import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SEED_BLOG_POSTS } from '@/lib/seed-data'
import { BlogPost } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { ChevronRight, Clock, ArrowLeft } from 'lucide-react'

interface PageProps {
  params: { slug: string }
}

async function getPost(slug: string): Promise<BlogPost | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (data) return data as BlogPost
  return (SEED_BLOG_POSTS.find(p => p.slug === slug) as BlogPost) || null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPost(params.slug)
  if (!post) return { title: 'Post Not Found' }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.created_at,
      authors: post.author ? [post.author] : undefined,
      images: post.image ? [{ url: post.image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getPost(params.slug)
  if (!post) notFound()

  // Rough read time estimate
  const wordCount = post.content.split(/\s+/).length
  const readTime = Math.ceil(wordCount / 200)

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Back + breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
          <Link href="/blog" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Blog
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-zinc-400 truncate">{post.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {post.category && (
              <span className="text-xs font-medium text-accent-300 bg-accent/10 border border-accent/20 px-2.5 py-1 rounded-full">
                {post.category}
              </span>
            )}
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Clock className="w-3.5 h-3.5" />
              {readTime} min read
            </div>
            <span className="text-xs text-zinc-600">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl text-white leading-snug mb-4">
            {post.title}
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            {post.excerpt}
          </p>

          {post.author && (
            <div className="flex items-center gap-2 mt-6 pt-6 border-t border-white/5">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent-300">
                {post.author.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-sm text-zinc-400">{post.author}</span>
            </div>
          )}
        </header>

        {/* Content */}
        <article className="prose prose-sm max-w-none">
          {post.content.split('\n').map((line, i) => {
            if (line.startsWith('# ')) return <h1 key={i} className="font-display text-3xl text-white mt-8 mb-4">{line.replace(/^# /, '')}</h1>
            if (line.startsWith('## ')) return <h2 key={i} className="font-display text-2xl text-white mt-8 mb-3">{line.replace(/^## /, '')}</h2>
            if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-semibold text-white mt-6 mb-2">{line.replace(/^### /, '')}</h3>
            if (line.startsWith('- ')) return <li key={i} className="flex items-start gap-2 mb-1 text-zinc-300 text-sm list-none pl-0"><span className="text-accent-400 mt-1">–</span>{line.replace(/^- /, '')}</li>
            if (line.startsWith('**') && line.endsWith('**')) return <strong key={i} className="block text-white font-semibold mt-4 mb-1">{line.replace(/\*\*/g, '')}</strong>
            if (line.match(/^\|.+\|$/)) {
              return (
                <div key={i} className="overflow-x-auto">
                  <table className="min-w-full text-sm my-1">
                    <tbody>
                      <tr>
                        {line.split('|').filter(Boolean).map((cell, j) => (
                          <td key={j} className="px-3 py-2 border border-white/5 text-zinc-300">{cell.trim()}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )
            }
            if (!line.trim()) return <br key={i} />
            return <p key={i} className="text-zinc-400 text-sm leading-relaxed mb-3">{line}</p>
          })}
        </article>

        {/* CTA */}
        <div className="mt-16 bg-surface-50 border border-white/5 rounded-2xl p-8 text-center">
          <h3 className="font-display text-xl text-white mb-2">Ready to unlock these deals?</h3>
          <p className="text-zinc-400 text-sm mb-6">Create a free account and start saving today.</p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-600 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm shadow-lg shadow-accent/20"
          >
            Get Free Access
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
