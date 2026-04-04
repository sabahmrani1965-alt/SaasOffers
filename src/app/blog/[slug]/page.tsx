import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SEED_BLOG_POSTS } from '@/lib/seed-data'
import { BlogPost } from '@/types'
import { format } from 'date-fns'
import { ChevronRight, Clock, ArrowLeft, ArrowRight, Zap } from 'lucide-react'
import { ShareButtons } from '@/components/blog/ShareButtons'

interface PageProps {
  params: { slug: string }
}

const CATEGORY_COLORS: Record<string, string> = {
  'Guides':       'bg-violet-50 text-violet-600 border-violet-100',
  'Case Studies': 'bg-blue-50 text-blue-600 border-blue-100',
  'Comparisons':  'bg-amber-50 text-amber-600 border-amber-100',
  'News':         'bg-emerald-50 text-emerald-600 border-emerald-100',
  'default':      'bg-gray-100 text-gray-700 border-gray-200',
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
              <tr>{rows[0]?.map((h, j) => <th key={j} className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-100" dangerouslySetInnerHTML={{ __html: inlineMarkdown(h) }} />)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.slice(1).map((row, j) => (
                <tr key={j} className="hover:bg-gray-50/50">
                  {row.map((cell, k) => <td key={k} className="px-4 py-3 text-gray-700" dangerouslySetInnerHTML={{ __html: inlineMarkdown(cell) }} />)}
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

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function inlineMarkdown(text: string): string {
  // Extract markdown links first, replace with placeholders, then escape HTML, then restore links
  const links: string[] = []

  // Extract external links [text](https://...)
  let processed = text.replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, (_m, label, url) => {
    const safeLabel = escapeHtml(label)
    const safeUrl = escapeHtml(url)
    links.push(`<a href="${safeUrl}" class="text-violet-600 font-medium underline underline-offset-2 hover:text-violet-700" target="_blank" rel="noopener noreferrer">${safeLabel}</a>`)
    return `%%LINK${links.length - 1}%%`
  })

  // Extract internal links [text](/path)
  processed = processed.replace(/\[(.+?)\]\((\/[^\s)]+)\)/g, (_m, label, url) => {
    const safeLabel = escapeHtml(label)
    const safeUrl = escapeHtml(url)
    links.push(`<a href="${safeUrl}" class="text-violet-600 font-medium underline underline-offset-2 hover:text-violet-700">${safeLabel}</a>`)
    return `%%LINK${links.length - 1}%%`
  })

  // Now escape HTML on the remaining text
  processed = escapeHtml(processed)

  // Apply markdown formatting
  processed = processed
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 rounded-md bg-gray-100 text-violet-600 font-mono text-[0.875em]">$1</code>')

  // Restore links
  links.forEach((link, i) => {
    processed = processed.replace(`%%LINK${i}%%`, link)
  })

  return processed
}

// Extract FAQ items from blog content (### heading followed by paragraph answer)
function extractFAQ(content: string): { question: string; answer: string }[] {
  const items: { question: string; answer: string }[] = []
  const lines = content.split('\n')
  let inFaqSection = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    // Detect FAQ section start
    if (line.match(/^##\s.*FAQ|^##\s.*Frequently Asked/i)) {
      inFaqSection = true
      continue
    }
    // Stop at next H2 that isn't FAQ
    if (inFaqSection && line.match(/^##\s/) && !line.match(/FAQ|Frequently Asked/i)) {
      break
    }
    // Capture H3 questions inside FAQ section
    if (inFaqSection && line.startsWith('### ')) {
      const question = line.slice(4).trim()
      // Collect answer lines until next heading or empty section
      const answerLines: string[] = []
      let j = i + 1
      while (j < lines.length && !lines[j].trim().startsWith('#')) {
        if (lines[j].trim()) answerLines.push(lines[j].trim())
        j++
      }
      if (answerLines.length > 0) {
        items.push({ question, answer: answerLines.join(' ') })
      }
    }
  }
  return items
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
  const publishedDate = new Date(post.created_at).toISOString()

  // JSON-LD: Article schema
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Organization',
      name: post.author || 'SaaSOffers',
      url: 'https://saasoffers.tech',
    },
    publisher: {
      '@type': 'Organization',
      name: 'SaaSOffers',
      url: 'https://saasoffers.tech',
      logo: { '@type': 'ImageObject', url: 'https://saasoffers.tech/icon.png' },
    },
    datePublished: publishedDate,
    dateModified: publishedDate,
    mainEntityOfPage: postUrl,
    ...(post.image ? { image: post.image } : {}),
  }

  // JSON-LD: FAQ schema (extracted from content)
  const faqItems = extractFAQ(post.content)
  const faqJsonLd = faqItems.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  } : null

  // JSON-LD: Breadcrumb schema
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://saasoffers.tech' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://saasoffers.tech/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: postUrl },
    ],
  }

  return (
    <div className="min-h-screen bg-white">
      {/* JSON-LD Structured Data — rendered server-side */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* ── Hero — moderate height, not full screen ── */}
      <div className={`bg-gradient-to-br ${gradient} pt-20`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-6">
            <Link href="/blog" className="flex items-center gap-1.5 hover:text-white transition-colors font-medium">
              <ArrowLeft className="w-3.5 h-3.5" /> Blog
            </Link>
            <ChevronRight className="w-4 h-4 opacity-50" />
            {post.category && <span className="text-white/70">{post.category}</span>}
          </nav>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {post.category && (
              <span className="text-xs font-semibold px-3 py-1 bg-white/20 text-white border border-white/30 rounded-full">
                {post.category}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-xs text-white/75">
              <Clock className="w-3.5 h-3.5" /> {readTime} min read
            </span>
            <span className="text-xs text-white/60">
              {format(new Date(post.created_at), 'MMMM d, yyyy')}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 max-w-3xl">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-white/75 text-base sm:text-lg leading-relaxed max-w-2xl mb-6">
            {post.excerpt}
          </p>

          {/* Author */}
          {post.author && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                {post.author.slice(0, 2).toUpperCase()}
              </div>
              <div className="text-sm font-medium text-white">{post.author}
                <span className="text-white/50 font-normal"> · SaaSOffers</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Body: 2-col grid ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ── Article: 2/3 width ── */}
          <article className="lg:col-span-2 min-w-0">
            <div className="text-[17px] leading-7 text-gray-700">
              {renderContent(post.content)}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-gray-100">
                {post.tags.map(tag => (
                  <span key={tag} className="text-xs font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share */}
            <div className="flex items-center justify-between flex-wrap gap-4 mt-8 pt-6 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-700">Share this article</p>
              <ShareButtons url={postUrl} title={post.title} />
            </div>

            {/* Author card */}
            {post.author && (
              <div className="mt-8 bg-gray-50 border border-gray-100 rounded-2xl p-5 flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {post.author.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{post.author}</div>
                  <div className="text-xs text-gray-600 mb-2">SaaSOffers Team · {format(new Date(post.created_at), 'MMMM yyyy')}</div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Helping startups unlock exclusive SaaS deals and save thousands on their software stack.
                  </p>
                </div>
              </div>
            )}

            {/* In-article CTA */}
            <div className="mt-10 bg-gradient-to-br from-violet-50 to-pink-50 border border-violet-100 rounded-2xl p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Ready to unlock these deals?</h3>
                <p className="text-gray-700 text-sm">Free account. No credit card required.</p>
              </div>
              <Link
                href="/signup"
                className="flex-shrink-0 inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm shadow-sm shadow-violet-200 hover:-translate-y-0.5 whitespace-nowrap"
              >
                Get free access <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </article>

          {/* ── Sidebar: 1/3 width, sticky ── */}
          <aside className="lg:col-span-1 lg:sticky lg:top-24 space-y-4">

            {/* CTA widget */}
            <div className="bg-gradient-to-br from-violet-600 to-pink-500 rounded-2xl p-5 text-white text-center">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                <Zap className="w-4 h-4 text-white" fill="white" />
              </div>
              <p className="font-bold text-sm mb-1">Get free SaaS deals</p>
              <p className="text-white/70 text-xs mb-4 leading-relaxed">$500,000+ in startup credits waiting for you</p>
              <Link href="/signup" className="block bg-white text-violet-600 font-bold text-xs py-2.5 rounded-xl hover:bg-violet-50 transition-colors">
                Get free access →
              </Link>
            </div>

            {/* Article meta */}
            <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Read time</span>
                <span className="text-sm font-semibold text-gray-800">{readTime} min</span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-50 pt-3">
                <span className="text-xs text-gray-600">Published</span>
                <span className="text-sm font-semibold text-gray-800">{format(new Date(post.created_at), 'MMM d, yyyy')}</span>
              </div>
              {post.category && (
                <div className="flex justify-between items-center border-t border-gray-50 pt-3">
                  <span className="text-xs text-gray-600">Category</span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${categoryStyle}`}>
                    {post.category}
                  </span>
                </div>
              )}
            </div>

            {/* Share — sidebar version */}
            <div className="bg-white border border-gray-100 rounded-xl p-4">
              <p className="text-xs text-gray-600 font-medium mb-3">Share</p>
              <div className="flex flex-col gap-2">
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(postUrl)}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors border border-gray-100">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  Share on X
                </a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors border border-blue-100">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  Share on LinkedIn
                </a>
              </div>
            </div>
          </aside>
        </div>

        {/* ── Related posts — full width below grid ── */}
        {relatedPosts.length > 0 && (
          <section className="mt-14 pt-10 border-t border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">More articles</h2>
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
                    <p className="text-xs text-gray-600 mt-2">{format(new Date(rp.created_at), 'MMM d, yyyy')}</p>
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
