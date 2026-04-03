'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { ArrowBigUp, MessageSquare, ArrowLeft, Clock, Send, Pin } from 'lucide-react'

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

interface Reply {
  id: string
  user_id: string
  body: string
  upvotes: number
  created_at: string
  user?: { id: string; email: string }
}

interface Props {
  post: Post
  user: User
  upvotedPostIds: string[]
  upvotedReplyIds: string[]
}

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

export function ThreadClient({ post, user, upvotedPostIds, upvotedReplyIds }: Props) {
  const [replies, setReplies] = useState<Reply[]>([])
  const [loading, setLoading] = useState(true)
  const [replyBody, setReplyBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [postUpvotes, setPostUpvotes] = useState(post.upvotes)
  const [isPostUpvoted, setIsPostUpvoted] = useState(upvotedPostIds.includes(post.id))
  const [upvotedReplies, setUpvotedReplies] = useState<Set<string>>(new Set(upvotedReplyIds))

  const fetchReplies = async () => {
    const res = await fetch(`/api/community/replies?post_id=${post.id}`)
    const data = await res.json()
    if (Array.isArray(data)) setReplies(data)
    setLoading(false)
  }

  useEffect(() => { fetchReplies() }, [])

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyBody.trim()) return
    setSubmitting(true)
    await fetch('/api/community/replies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ post_id: post.id, body: replyBody }),
    })
    setReplyBody('')
    setSubmitting(false)
    fetchReplies()
  }

  const handleUpvotePost = async () => {
    const res = await fetch('/api/community/upvote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ post_id: post.id }),
    })
    const { action } = await res.json()
    setIsPostUpvoted(action === 'added')
    setPostUpvotes(prev => action === 'added' ? prev + 1 : Math.max(0, prev - 1))
  }

  const handleUpvoteReply = async (replyId: string) => {
    const res = await fetch('/api/community/upvote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply_id: replyId }),
    })
    const { action } = await res.json()
    setUpvotedReplies(prev => {
      const next = new Set(prev)
      if (action === 'added') next.add(replyId)
      else next.delete(replyId)
      return next
    })
    setReplies(prev => prev.map(r =>
      r.id === replyId
        ? { ...r, upvotes: action === 'added' ? r.upvotes + 1 : Math.max(0, r.upvotes - 1) }
        : r
    ))
  }

  const postEmail = post.user?.email || 'anonymous@user.com'

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">

        {/* Back */}
        <Link href="/community" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 font-medium mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to community
        </Link>

        {/* Post */}
        <div className={`bg-white border rounded-2xl p-6 shadow-sm mb-6 ${post.pinned ? 'border-violet-200' : 'border-gray-100'}`}>
          <div className="flex items-start gap-3">
            {/* Upvote */}
            <button
              onClick={handleUpvotePost}
              className={`flex flex-col items-center gap-0.5 pt-1 flex-shrink-0 ${
                isPostUpvoted ? 'text-violet-600' : 'text-gray-300 hover:text-gray-500'
              } transition-colors`}
            >
              <ArrowBigUp className={`w-6 h-6 ${isPostUpvoted ? 'fill-violet-600' : ''}`} />
              <span className={`text-sm font-bold ${isPostUpvoted ? 'text-violet-600' : 'text-gray-500'}`}>{postUpvotes}</span>
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {post.pinned && <Pin className="w-3.5 h-3.5 text-violet-500" />}
                <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-[10px] font-medium">{post.category}</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h1>
              <div className="text-[15px] text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">{post.body}</div>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                    style={{ backgroundColor: getAvatarColor(postEmail) }}
                  >
                    {getInitials(postEmail)}
                  </div>
                  <span className="font-medium text-gray-600">{postEmail.split('@')[0]}</span>
                </div>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(post.created_at)}</span>
                <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{replies.length} {replies.length === 1 ? 'reply' : 'replies'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reply form */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-6">
          <form onSubmit={handleSubmitReply} className="flex gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0 mt-1"
              style={{ backgroundColor: getAvatarColor(user.email || '') }}
            >
              {getInitials(user.email || '')}
            </div>
            <div className="flex-1">
              <textarea
                required
                value={replyBody}
                onChange={e => setReplyBody(e.target.value)}
                placeholder="Write a reply..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Send className="w-3 h-3" /> {submitting ? 'Posting...' : 'Reply'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Replies */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-8 text-gray-400 text-sm">Loading replies...</div>
          ) : replies.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">No replies yet. Be the first to respond!</div>
          ) : (
            replies.map(reply => {
              const replyEmail = reply.user?.email || 'anonymous@user.com'
              const isReplyUpvoted = upvotedReplies.has(reply.id)

              return (
                <div key={reply.id} className="bg-white border border-gray-100 rounded-xl px-5 py-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    {/* Upvote */}
                    <button
                      onClick={() => handleUpvoteReply(reply.id)}
                      className={`flex flex-col items-center gap-0.5 pt-1 flex-shrink-0 ${
                        isReplyUpvoted ? 'text-violet-600' : 'text-gray-300 hover:text-gray-500'
                      } transition-colors`}
                    >
                      <ArrowBigUp className={`w-4 h-4 ${isReplyUpvoted ? 'fill-violet-600' : ''}`} />
                      <span className={`text-[10px] font-bold ${isReplyUpvoted ? 'text-violet-600' : 'text-gray-500'}`}>{reply.upvotes}</span>
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px] font-bold"
                          style={{ backgroundColor: getAvatarColor(replyEmail) }}
                        >
                          {getInitials(replyEmail)}
                        </div>
                        <span className="text-xs font-medium text-gray-700">{replyEmail.split('@')[0]}</span>
                        <span className="text-xs text-gray-400">{timeAgo(reply.created_at)}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{reply.body}</p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
