'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import {
  MessageSquare, ArrowBigUp, Plus, X, Send, Filter,
  Lock, Zap, Crown, Clock, Users, Sparkles, Pin,
} from 'lucide-react'

interface Post {
  id: string
  user_id: string
  title: string
  body: string
  category: string
  upvotes: number
  reply_count: number
  pinned: boolean
  created_at: string
  user?: { id: string; email: string }
}

interface Props {
  user: User | null
  isPremium: boolean
  userUpvotes: string[]
}

const CATEGORIES = ['All', 'General', 'Introductions', 'Ask the Community', 'Tools & Stack', 'Fundraising', 'Growth & Marketing', 'Hiring', 'Show & Tell', 'Deals & Credits']

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getInitials(email: string): string {
  const parts = email.split('@')[0].split(/[._-]/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return email.slice(0, 2).toUpperCase()
}

function getAvatarColor(email: string): string {
  let hash = 0
  for (let i = 0; i < email.length; i++) hash = email.charCodeAt(i) + ((hash << 5) - hash)
  const colors = ['#7C3AED', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316', '#6366F1']
  return colors[Math.abs(hash) % colors.length]
}

export function CommunityClient({ user, isPremium, userUpvotes: initialUpvotes }: Props) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState<'newest' | 'top'>('newest')
  const [showNewPost, setShowNewPost] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newBody, setNewBody] = useState('')
  const [newCategory, setNewCategory] = useState('General')
  const [submitting, setSubmitting] = useState(false)
  const [upvotedPosts, setUpvotedPosts] = useState<Set<string>>(new Set(initialUpvotes))

  const fetchPosts = async () => {
    const params = new URLSearchParams({ category, sort })
    const res = await fetch(`/api/community/posts?${params}`)
    const data = await res.json()
    if (Array.isArray(data)) setPosts(data)
    setLoading(false)
  }

  useEffect(() => { fetchPosts() }, [category, sort])

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newBody.trim()) return
    setSubmitting(true)
    await fetch('/api/community/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle, body: newBody, category: newCategory }),
    })
    setNewTitle('')
    setNewBody('')
    setNewCategory('General')
    setShowNewPost(false)
    setSubmitting(false)
    fetchPosts()
  }

  const handleUpvote = async (postId: string) => {
    if (!user || !isPremium) return
    const res = await fetch('/api/community/upvote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ post_id: postId }),
    })
    const { action } = await res.json()
    setUpvotedPosts(prev => {
      const next = new Set(prev)
      if (action === 'added') next.add(postId)
      else next.delete(postId)
      return next
    })
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, upvotes: action === 'added' ? p.upvotes + 1 : Math.max(0, p.upvotes - 1) }
        : p
    ))
  }

  // Not logged in — show gate
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-violet-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Founder Community</h1>
          <p className="text-gray-600 text-lg mb-8">A private space for startup founders to share advice, ask questions, and connect with 2,000+ founders building in 2026.</p>
          <Link href="/signup?redirect=/community" className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-pink-500 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all text-base">
            Sign up to join <Sparkles className="w-4 h-4" />
          </Link>
          <p className="text-sm text-gray-500 mt-4">Already have an account? <Link href="/login?redirect=/community" className="text-violet-600 font-semibold hover:underline">Log in</Link></p>
        </div>
      </div>
    )
  }

  // Logged in but not premium — show upgrade gate
  if (!isPremium) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-violet-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Premium Founder Community</h1>
          <p className="text-gray-600 text-lg mb-4">The community is exclusive to SaaSOffers Premium members — a private space for serious founders.</p>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-8 text-left max-w-md mx-auto">
            <h3 className="font-bold text-gray-900 mb-3">What you get:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {['Ask questions to experienced founders', 'Share your stack and get feedback', 'Find co-founders and early hires', 'Get advice on fundraising and growth', 'Access to all 199+ premium deals'].map(t => (
                <li key={t} className="flex items-start gap-2">
                  <Zap className="w-3.5 h-3.5 text-violet-500 flex-shrink-0 mt-0.5" />{t}
                </li>
              ))}
            </ul>
          </div>
          <Link href="/api/stripe/checkout" className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-pink-500 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all text-base">
            <Crown className="w-4 h-4" /> Upgrade to Premium — $79/yr
          </Link>
        </div>
      </div>
    )
  }

  // Premium user — show community
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-violet-600" />
              Founder Community
            </h1>
            <p className="text-gray-500 text-sm mt-1">Private forum for SaaSOffers Premium founders</p>
          </div>
          <button
            onClick={() => setShowNewPost(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-pink-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" /> New Post
          </button>
        </div>

        {/* New post form */}
        {showNewPost && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Create a post</h2>
              <button onClick={() => setShowNewPost(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmitPost} className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Post title..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <textarea
                  required
                  value={newBody}
                  onChange={e => setNewBody(e.target.value)}
                  placeholder="Share your thoughts, questions, or advice..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
                >
                  {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="flex-1" />
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" /> {submitting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Category filter + sort */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  category === c
                    ? 'bg-violet-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <select
            value={sort}
            onChange={e => setSort(e.target.value as 'newest' | 'top')}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 flex-shrink-0"
          >
            <option value="newest">Newest</option>
            <option value="top">Top</option>
          </select>
        </div>

        {/* Posts list */}
        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Loading discussions...</div>
        ) : posts.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
            <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="font-semibold text-gray-700 mb-1">No posts yet</p>
            <p className="text-sm text-gray-500">Be the first to start a discussion!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map(post => {
              const email = post.user?.email || 'anonymous@user.com'
              const isUpvoted = upvotedPosts.has(post.id)

              return (
                <div
                  key={post.id}
                  className={`bg-white border rounded-xl px-5 py-4 shadow-sm hover:shadow-md transition-all ${
                    post.pinned ? 'border-violet-200 bg-violet-50/30' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Upvote */}
                    <button
                      onClick={() => handleUpvote(post.id)}
                      className={`flex flex-col items-center gap-0.5 pt-1 flex-shrink-0 ${
                        isUpvoted ? 'text-violet-600' : 'text-gray-300 hover:text-gray-500'
                      } transition-colors`}
                    >
                      <ArrowBigUp className={`w-5 h-5 ${isUpvoted ? 'fill-violet-600' : ''}`} />
                      <span className={`text-xs font-bold ${isUpvoted ? 'text-violet-600' : 'text-gray-500'}`}>
                        {post.upvotes}
                      </span>
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {post.pinned && <Pin className="w-3 h-3 text-violet-500" />}
                        <Link href={`/community/${post.id}`} className="font-semibold text-gray-900 text-sm hover:text-violet-600 transition-colors line-clamp-1">
                          {post.title}
                        </Link>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{post.body}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px] font-bold"
                            style={{ backgroundColor: getAvatarColor(email) }}
                          >
                            {getInitials(email)}
                          </div>
                          <span>{email.split('@')[0]}</span>
                        </div>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(post.created_at)}</span>
                        <Link href={`/community/${post.id}`} className="flex items-center gap-1 hover:text-violet-600 transition-colors">
                          <MessageSquare className="w-3 h-3" />{post.reply_count} {post.reply_count === 1 ? 'reply' : 'replies'}
                        </Link>
                        <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-[10px] font-medium">{post.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
