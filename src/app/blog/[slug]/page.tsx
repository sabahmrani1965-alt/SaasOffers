import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SEED_BLOG_POSTS } from '@/lib/seed-data'
import { BlogPost } from '@/types'
import { format } from 'date-fns'
import { ChevronRight, Clock, ArrowLeft, ArrowRight, Twitter, Linkedin, Link2, Zap } from 'lucide-react'
import { ShareButtons } from '@/components/blog/ShareButtons'

interface PageProps {
  params: { slug: string }
}

const CATEGORY_COLORS: Record<string, string> = {
  'Guides':       'bg-violet-50 text-violet-600 border-violet-100',
  'Case Studies': 'bg-blue-50 text-blue-600 border-blue-100',
  'Comparisons':  'bg-amber-50 text-amber-600 border-amber-100',
  'News':         'bg-emerald-50 text-emerald-600 border-emerald-100',
  'default':      'bg-gray-100 text-gray-600 border-gray-200',
}

const COVER_GRADIENTS: Record<string, string> = {
  'Guides':       'from-violet-500 to-purple-600',
  'Case Studies': 'from-blue-500 to-cyan-600',
  'Comparisons':  'from-amber-400 to-orange-500',
  'default':      'from-violet-500 to-pink-500',
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

async function getRelatedPosts(current: BlogPost): Promise<BlogPost[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('id,title,slug,excerpt,category,created_at,content,published,author')
    .eq('published', true)
    .neq('slug', current.slug)
    .limit(3)
  if (data && data.length > 0) return data as BlogPost[]
  return SEED_BLOG_POSTS.filter(p => p.slug !== current.slug).slice(0, 3) as BlogPost[]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPost(params.slug)
  if (!post) return { title: 'Post Not Found' }
  return {
    title: `${post.title} | SaaSOffers Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.created_at,
      authors: post.author ? [post.author] : undefined,
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.excerpt },
    alternates: { canonical: `https://saasoffers.tech/blog/${params.slug}` },
  }
}

// ── Markdown renderer ────────────────────────────────────────────────────────
function renderContent(content: string) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0
  let listItems: string[] = []

  function flushList() {
    if (listItems.length === 0) return
    elements.push(
      <ul key={`ul-${i}`} className="my-4 space-y-1.5 pl-0">
        {listItems.map((item, j) => (
          <li key={j} className="flex items-start gap-2.5 text-gray-700 text-[17px] leading-relaxed">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
            <span dangerouslySetInnerHTML={{ __html: inlineMarkdown(item) }} />
          </li>
        ))}
      </ul>
    )
    listItems = []
  }

  while (i < lines.length) {
    const line = lines[i]

    // Headings
    if (line.startsWith('# ')) {
      flushList()
      elements.push(<h2 key={i} className="text-3xl font-bold text-gray-900 mt-10 mb-4 leading-tight">{line.slice(2)}</h2>)
      i++; continue
    }
    if (line.startsWith('## ')) {
      flushList()
      elements.push(<h3 key={i} className="text-2xl font-bold text-gray-900 mt-8 mb-3 leading-tight">{line.slice(3)}</h3>)
      i++; continue
    }
    if (line.startsWith('### ')) {
      flushList()
      elements.push(<h4 key={i} className="text-xl font-semibold text-gray-900 mt-6 mb-2">{line.slice(4)}</h4>)
      i++; continue
    }

    // Bullet list
    if (line.startsWith('- ')) {
      listItems.push(line.slice(2))
      i++; continue
    }

    // Numbered list
    if (/^\d+\. /.test(line)) {
      flushList()
      // collect all numbered items
      const numItems: string[] = []
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        numItems.push(lines[i].replace(/^\d+\. /, ''))
        i++
      }
      elements.push(
        <ol key={`ol-${i}`} className="my-4 space-y-1.5 pl-0 list-none">
          {numItems.map((item, j) => (
            <li key={j} className="flex items-start gap-3 text-gray-700 text-[17px] leading-relaxed">
              <span className="mt-0.5 w-6 h-6 rounded-lg bg-violet-100 text-violet-600 text-xs font-bold flex items-center justify-center flex-shrink-0">{j + 1}</span>
              <span dangerouslySetInnerHTML={{ __html: inlineMarkdown(item) }} />
            </li>
          ))}
        </ol>
      )
      continue
    }

    // Horizontal rule
    if (line.trim() === '---') {
      flushList()
      elements.push(<hr key={i} className="my-8 border-gray-100" />)
      i++; continue
    }

    // Table row
    if (line.match(/^\|.+\|$/)) {
      flushList()
      const rows: string[][] = []
      while (i < lines.length && lines[i].match(/^\|.+\|$/)) {
        if (!lines[i].match(/^\|[-|\s]+\|$/)) {
          rows.push(lines[i].split('|').filter(Boolean).map(c => c.trim()))
        }
        i++
      }
      elements.push(
        <div key={`table-${i}`} className="overflow-x-auto my-6 rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>{rows[0]?.map((h, j) => <th key={j} className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-100">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.slice(1).map((row, j) => (
                <tr key={j} className="hover:bg-gray-50/50">
                  {row.map((cell, k) => <td key={k} className="px-4 py-3 text-gray-600">{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      continue
    }

    // Blockquote
    if (line.startsWith('> ')) {
      flushList()
      elements.push(
        <blockquote key={i} className="border-l-4 border-violet-300 pl-5 py-1 my-5 bg-violet-50/50 rounded-r-lg">
          <p className="text-gray-700 text-[17px] leading-relaxed italic" dangerouslySetInnerHTML={{ __html: inlineMarkdown(line.slice(2)) }} />
        </blockquote>
      )
      i++; continue
    }

    // Empty line
    if (!line.trim()) {
      flushList()
      i++; continue
    }

    // Regular paragraph
    flushList()
    elements.push(
      <p key={i} className="text-gray-700 text-[17px] leading-[1.75] mb-5"
        dangerouslySetInnerHTML={{ __html: inlineMarkdown(line) }}
      />
    )
    i++
  }

  flushList()
  return elements
}

function inlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 rounded-md bg-gray-100 text-violet-600 font-mono text-[0.875em]">$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-violet-600 font-medium underline underline-offset-2 hover:text-violet-700" target="_blank" rel="noopener">$1</a>')
}

export default async function BlogPostPage({ params }: PageProps) {
  const [post, relatedPosts] = await Promise.all([
    getPost(params.slug),
    getPost(params.slug).then(p => p ? getRelatedPosts(p) : [])
  ])
  if (!post) notFound()

  const readTime = Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200))
  const categoryStyle = post.category
    ? (CATEGORY_COLORS[post.category] || CATEGORY_COLORS.default)
    : CATEGORY_COLORS.default
  const gradient = post.category
    ? (COVER_GRADIENTS[post.category] || COVER_GRADIENTS.default)
    : COVER_GRADIENTS.default

  const postUrl = `https://saasoffers.tech/blog/${post.slug}`

  return (
    <div className="min-h-screen bg-white">

      {/* ── Cover ── */}
      <div className={`bg-gradient-to-br ${gradient} pt-24 pb-0`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-8">
            <Link href="/blog" className="flex items-center gap-1.5 hover:text-white transition-colors font-medium">
              <ArrowLeft className="w-3.5 h-3.5" /> Blog
            </Link>
            <ChevronRight className="w-4 h-4 opacity-50" />
            {post.category && <span className="text-white/70 truncate max-w-xs">{post.category}</span>}
          </nav>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            {post.category && (
              <span className="inline-flex items-center text-xs font-semibold px-3 py-1 bg-white/20 text-white border border-white/30 rounded-full backdrop-blur-sm">
                {post.category}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-xs text-white/80">
              <Clock className="w-3.5 h-3.5" /> {readTime} min read
            </span>
            <span className="text-xs text-white/60">
              {format(new Date(post.created_at), 'MMMM d, yyyy')}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-white/80 text-lg leading-relaxed max-w-2xl">
            {post.excerpt}
          </p>

          {/* Author */}
          {post.author && (
            <div className="flex items-center gap-3 mt-8">
              <div className="w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-xs font-bold text-white">
                {post.author.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{post.author}</div>
                <div className="text-xs text-white/60">SaaSOffers</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Article body ── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex gap-10 items-start">

          {/* Main content */}
          <article className="flex-1 min-w-0">
            {renderContent(post.content)}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-gray-100">
                {post.tags.map(tag => (
                  <span key={tag} className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share */}
            <div className="flex items-center justify-between flex-wrap gap-4 mt-8 pt-8 border-t border-gray-100">
              <p className="text-sm text-gray-500 font-medium">Share this article</p>
              <ShareButtons url={postUrl} title={post.title} />
            </div>

            {/* Author card */}
            {post.author && (
              <div className="mt-10 bg-gray-50 border border-gray-100 rounded-2xl p-6 flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                  {post.author.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 mb-0.5">{post.author}</div>
                  <div className="text-xs text-gray-400 mb-2">SaaSOffers Team · {format(new Date(post.created_at), 'MMMM yyyy')}</div>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Helping startups unlock exclusive SaaS deals and save thousands on their software stack.
                  </p>
                </div>
              </div>
            )}
          </article>

          {/* ── Sticky sidebar (desktop only) ── */}
          <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-24 space-y-5">
            {/* CTA */}
            <div className="bg-gradient-to-br from-violet-600 to-pink-500 rounded-2xl p-5 text-white text-center">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                <Zap className="w-5 h-5 text-white" fill="white" />
              </div>
              <p className="font-bold text-sm mb-1">Get free SaaS deals</p>
              <p className="text-white/75 text-xs mb-4 leading-relaxed">$500,000+ in startup credits</p>
              <Link href="/signup" className="block bg-white text-violet-600 font-bold text-xs py-2.5 rounded-xl hover:bg-violet-50 transition-colors">
                Get free access →
              </Link>
            </div>

            {/* Article meta */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3">
              <div>
                <div className="text-xs text-gray-400 mb-0.5">Read time</div>
                <div className="text-sm font-semibold text-gray-800">{readTime} minutes</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-0.5">Published</div>
                <div className="text-sm font-semibold text-gray-800">{format(new Date(post.created_at), 'MMM d, yyyy')}</div>
              </div>
              {post.category && (
                <div>
                  <div className="text-xs text-gray-400 mb-1">Category</div>
                  <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full border ${categoryStyle}`}>
                    {post.category}
                  </span>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* ── In-article CTA ── */}
        <div className="mt-14 bg-gradient-to-br from-violet-50 to-pink-50 border border-violet-100 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Ready to unlock these deals?</h3>
            <p className="text-gray-500 text-sm">Create a free account and start saving today. No credit card required.</p>
          </div>
          <Link
            href="/signup"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm shadow-sm shadow-violet-200 hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap"
          >
            Get free access <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* ── Related posts ── */}
        {relatedPosts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">More articles</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {relatedPosts.map(rp => (
                <Link
                  key={rp.slug}
                  href={`/blog/${rp.slug}`}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                >
                  <div className={`h-24 bg-gradient-to-br ${rp.category ? (COVER_GRADIENTS[rp.category] || COVER_GRADIENTS.default) : COVER_GRADIENTS.default}`} />
                  <div className="p-4">
                    {rp.category && (
                      <span className={`inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full border mb-2 ${CATEGORY_COLORS[rp.category] || CATEGORY_COLORS.default}`}>
                        {rp.category}
                      </span>
                    )}
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-violet-600 transition-colors leading-snug">
                      {rp.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-2">{format(new Date(rp.created_at), 'MMM d, yyyy')}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
