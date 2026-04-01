'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Pencil, Trash2, Eye, EyeOff, Filter } from 'lucide-react'
import { Modal } from './Modal'
import { ConfirmModal } from './ConfirmModal'
import { Badge } from './Badge'
import { Table, Thead, Th, Tbody, Tr, Td } from './AdminTable'
import { Field, inputClass, selectClass, textareaClass } from './FormField'
import { MarkdownEditor } from './MarkdownEditor'
import { ImageUploadField } from './ImageUploadField'

const BLOG_TEMPLATE = `## Introduction

Give a brief overview of what this article covers and why it matters to startup founders.

## The Problem

Describe the challenge or pain point this post addresses.

## Key Takeaways

- Point 1
- Point 2
- Point 3

## Deep Dive

### Section 1

Explain in detail...

### Section 2

Continue with more insights...

## How to Get Started

1. Step 1
2. Step 2
3. Step 3

## Conclusion

Summarize the key points and add a clear call to action.

👉 [Browse all SaaS deals on SaaSOffers](https://saasoffers.tech/offers)
`

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  content?: string
  category?: string
  author?: string
  published: boolean
  cover_image?: string
  meta_title?: string
  meta_description?: string
  created_at: string
}

const EMPTY: Partial<Post> = {
  title: '', slug: '', excerpt: '', content: BLOG_TEMPLATE, category: '',
  author: 'SaaSOffers Team', published: false, cover_image: '', meta_title: '', meta_description: '',
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function BlogManager() {
  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [tab, setTab] = useState<'content' | 'seo'>('content')

  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Post>>(EMPTY)
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null)
  const [error, setError] = useState('')

  const fetch_ = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), q, published: statusFilter })
    const res = await fetch(`/api/admin/blog?${params}`)
    const json = await res.json()
    setPosts(json.data ?? [])
    setTotal(json.count ?? 0)
    setLoading(false)
  }, [page, q, statusFilter])

  useEffect(() => { fetch_() }, [fetch_])

  async function openEdit(post: Post) {
    setEditId(post.id)
    setError('')
    setTab('content')
    // Fetch full post content
    const res = await fetch(`/api/admin/blog/${post.id}`)
    const json = await res.json()
    setForm({ ...json.data })
    setModalOpen(true)
  }

  function openCreate() {
    setEditId(null)
    setForm(EMPTY)
    setError('')
    setTab('content')
    setModalOpen(true)
  }

  function handleFieldChange(field: keyof Post, value: any) {
    setForm(prev => {
      const next = { ...prev, [field]: value }
      if (field === 'title' && !editId) next.slug = slugify(value)
      return next
    })
  }

  async function handleSave() {
    if (!form.title || !form.slug) {
      setError('Title and slug are required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const url = editId ? `/api/admin/blog/${editId}` : '/api/admin/blog'
      const method = editId ? 'PATCH' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setModalOpen(false)
      fetch_()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    await fetch(`/api/admin/blog/${deleteTarget.id}`, { method: 'DELETE' })
    setDeleting(false)
    setDeleteTarget(null)
    fetch_()
  }

  async function togglePublished(post: Post) {
    await fetch(`/api/admin/blog/${post.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !post.published }),
    })
    fetch_()
  }

  const totalPages = Math.ceil(total / 20)

  return (
    <div className="px-8 py-6 space-y-5">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <input
            value={q}
            onChange={e => { setQ(e.target.value); setPage(1) }}
            placeholder="Search posts…"
            className="w-full bg-gray-900 border border-white/10 text-gray-200 placeholder-gray-600 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {[{ v: '', l: 'All' }, { v: 'true', l: 'Published' }, { v: 'false', l: 'Draft' }].map(opt => (
            <button key={opt.v} onClick={() => { setStatusFilter(opt.v); setPage(1) }}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${statusFilter === opt.v ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-gray-200'}`}>
              {opt.l}
            </button>
          ))}
        </div>
        <button onClick={openCreate} className="ml-auto flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-violet-500/20">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      <p className="text-xs text-gray-600">{total} post{total !== 1 ? 's' : ''} total</p>

      {/* Table */}
      <div className="bg-gray-900 border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-5 h-5 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-gray-600" />
            </div>
            <p className="text-gray-400 font-medium">No posts found</p>
            <button onClick={openCreate} className="mt-4 text-sm text-violet-400 hover:text-violet-300 font-semibold">
              + Write first post
            </button>
          </div>
        ) : (
          <Table>
            <Thead>
              <Th>Title</Th>
              <Th>Category</Th>
              <Th>Author</Th>
              <Th>Status</Th>
              <Th>Date</Th>
              <Th className="text-right">Actions</Th>
            </Thead>
            <Tbody>
              {posts.map(post => (
                <Tr key={post.id}>
                  <Td>
                    <div>
                      <div className="text-gray-100 font-semibold text-sm max-w-[280px] truncate">{post.title}</div>
                      <div className="text-gray-600 text-xs font-mono">{post.slug}</div>
                    </div>
                  </Td>
                  <Td><span className="text-gray-500 text-xs">{post.category || '—'}</span></Td>
                  <Td><span className="text-gray-400 text-sm">{post.author || '—'}</span></Td>
                  <Td>
                    <button onClick={() => togglePublished(post)} title="Click to toggle">
                      <Badge variant={post.published ? 'green' : 'gray'}>
                        {post.published ? 'Published' : 'Draft'}
                      </Badge>
                    </button>
                  </Td>
                  <Td><span className="text-gray-600 text-xs">{new Date(post.created_at).toLocaleDateString()}</span></Td>
                  <Td className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => togglePublished(post)} className="p-1.5 rounded-lg text-gray-600 hover:text-gray-200 hover:bg-white/5 transition-all" title={post.published ? 'Unpublish' : 'Publish'}>
                        {post.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => openEdit(post)} className="p-1.5 rounded-lg text-gray-600 hover:text-gray-200 hover:bg-white/5 transition-all">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteTarget(post)} className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-gray-200 disabled:opacity-30 hover:bg-white/5 transition-all">← Prev</button>
          <span className="text-xs text-gray-600">Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-gray-200 disabled:opacity-30 hover:bg-white/5 transition-all">Next →</button>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Post' : 'New Post'} size="2xl">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-800/50 rounded-xl p-1">
          {(['content', 'seo'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors capitalize ${tab === t ? 'bg-gray-700 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}>
              {t === 'seo' ? 'SEO' : 'Content'}
            </button>
          ))}
        </div>

        {tab === 'content' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Title" required className="col-span-2">
                <input value={form.title || ''} onChange={e => handleFieldChange('title', e.target.value)} placeholder="Post title…" className={inputClass} />
              </Field>
              <Field label="Slug" required>
                <input value={form.slug || ''} onChange={e => handleFieldChange('slug', e.target.value)} placeholder="post-slug" className={inputClass} />
              </Field>
              <Field label="Category">
                <input value={form.category || ''} onChange={e => handleFieldChange('category', e.target.value)} placeholder="Guides, News…" className={inputClass} />
              </Field>
              <Field label="Author">
                <input value={form.author || ''} onChange={e => handleFieldChange('author', e.target.value)} placeholder="SaaSOffers Team" className={inputClass} />
              </Field>
              <Field label="Status">
                <label className="flex items-center gap-2 cursor-pointer mt-2">
                  <div
                    className={`w-10 h-6 rounded-full transition-colors flex items-center ${form.published ? 'bg-emerald-600' : 'bg-gray-700'}`}
                    onClick={() => handleFieldChange('published', !form.published)}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-1 ${form.published ? 'translate-x-4' : ''}`} />
                  </div>
                  <span className="text-sm text-gray-400">{form.published ? 'Published' : 'Draft'}</span>
                </label>
              </Field>
            </div>
            <Field label="Excerpt / Summary">
              <textarea value={form.excerpt || ''} onChange={e => handleFieldChange('excerpt', e.target.value)} placeholder="Short summary for listings…" rows={2} className={textareaClass} />
            </Field>
            <ImageUploadField
              label="Cover Image"
              value={form.cover_image || ''}
              onChange={v => handleFieldChange('cover_image', v)}
              folder="blog-covers"
              hint="Recommended: 1200×630px — used as the post hero and social preview image"
            />
            <Field label="Content">
              <MarkdownEditor
                value={form.content || ''}
                onChange={v => handleFieldChange('content', v)}
              />
            </Field>
          </div>
        )}

        {tab === 'seo' && (
          <div className="space-y-4">
            <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 text-sm text-blue-400">
              SEO fields override the default title/excerpt for search engines and social sharing.
            </div>
            <Field label="Meta Title" hint="Recommended: 50–60 characters">
              <input value={form.meta_title || ''} onChange={e => handleFieldChange('meta_title', e.target.value)} placeholder="SEO title for this post…" className={inputClass} />
              <div className="text-xs text-gray-600 mt-1">{(form.meta_title || '').length}/60 chars</div>
            </Field>
            <Field label="Meta Description" hint="Recommended: 120–160 characters">
              <textarea value={form.meta_description || ''} onChange={e => handleFieldChange('meta_description', e.target.value)} placeholder="Brief description for search results…" rows={3} className={textareaClass} />
              <div className="text-xs text-gray-600 mt-1">{(form.meta_description || '').length}/160 chars</div>
            </Field>
            {/* Preview */}
            <div className="bg-gray-800/50 rounded-xl p-4 space-y-1">
              <p className="text-xs text-gray-600 mb-3 font-medium uppercase tracking-wider">Search Preview</p>
              <div className="text-blue-400 text-sm font-medium">{form.meta_title || form.title || 'Post title'}</div>
              <div className="text-emerald-600 text-xs">saasoffers.tech/blog/{form.slug || 'post-slug'}</div>
              <div className="text-gray-400 text-xs leading-relaxed">{form.meta_description || form.excerpt || 'Post description will appear here…'}</div>
            </div>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{error}</p>}

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/5">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2.5 rounded-xl border border-white/10 text-gray-300 text-sm font-medium hover:bg-white/5 transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 min-w-[120px]">
            {saving ? 'Saving…' : editId ? 'Save Changes' : 'Create Post'}
          </button>
        </div>
      </Modal>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title={`Delete "${deleteTarget?.title}"?`}
        description="This will permanently delete the post and it will no longer be accessible. This action cannot be undone."
      />
    </div>
  )
}
