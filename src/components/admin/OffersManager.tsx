'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Pencil, Trash2, Star, ToggleLeft, ToggleRight, ExternalLink, Filter, RefreshCw } from 'lucide-react'
import { Modal } from './Modal'
import { ConfirmModal } from './ConfirmModal'
import { Badge } from './Badge'
import { Table, Thead, Th, Tbody, Tr, Td } from './AdminTable'
import { Field, inputClass, selectClass, textareaClass } from './FormField'
import { MarkdownEditor, DEFAULT_TEMPLATE } from './MarkdownEditor'
import { ImageUploadField } from './ImageUploadField'
import { DealLogo } from '@/components/ui/DealLogo'

interface Offer {
  id: string
  name: string
  slug: string
  description: string
  long_description?: string
  value: number
  value_label: string
  type: 'free' | 'premium' | 'apply'
  category?: string
  logo_bg?: string
  logo_url?: string
  cover_image?: string
  requirements?: string
  affiliate_link?: string
  featured?: boolean
  expires_at?: string
  created_at: string
}

const EMPTY: Partial<Offer> = {
  name: '', slug: '', description: '', long_description: DEFAULT_TEMPLATE, value: 0,
  value_label: '', type: 'free', category: '', logo_bg: '#7C3AED', logo_url: '',
  cover_image: '', requirements: '', affiliate_link: '', featured: false,
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function OffersManager() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState<string>('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Offer>>(EMPTY)
  const [deleteTarget, setDeleteTarget] = useState<Offer | null>(null)
  const [error, setError] = useState('')

  const fetch_ = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), q, type: typeFilter })
    const res = await fetch(`/api/admin/offers?${params}`)
    const json = await res.json()
    setOffers(json.data ?? [])
    setTotal(json.count ?? 0)
    setLoading(false)
  }, [page, q, typeFilter])

  useEffect(() => { fetch_() }, [fetch_])

  function openCreate() {
    setEditId(null)
    setForm(EMPTY)
    setError('')
    setModalOpen(true)
  }

  function openEdit(offer: Offer) {
    setEditId(offer.id)
    setForm({ ...offer })
    setError('')
    setModalOpen(true)
  }

  function handleFieldChange(field: keyof Offer, value: any) {
    setForm(prev => {
      const next = { ...prev, [field]: value }
      if (field === 'name' && !editId) next.slug = slugify(value)
      return next
    })
  }

  async function handleSave() {
    if (!form.name || !form.slug || !form.value_label) {
      setError('Name, slug, and value label are required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const url = editId ? `/api/admin/offers/${editId}` : '/api/admin/offers'
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

  async function handleSync() {
    setSyncing(true)
    setSyncResult('')
    try {
      const res = await fetch('/api/admin/sync-partnerstack', { method: 'POST' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setSyncResult(`✓ Synced ${json.total} active deals — ${json.inserted} new, ${json.updated} updated`)
      fetch_()
    } catch (e: any) {
      setSyncResult(`✗ Sync failed: ${e.message}`)
    } finally {
      setSyncing(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    await fetch(`/api/admin/offers/${deleteTarget.id}`, { method: 'DELETE' })
    setDeleting(false)
    setDeleteTarget(null)
    fetch_()
  }

  async function toggleFeatured(offer: Offer) {
    await fetch(`/api/admin/offers/${offer.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: !offer.featured }),
    })
    fetch_()
  }

  async function toggleType(offer: Offer) {
    const next = offer.type === 'premium' ? 'free' : 'premium'
    await fetch(`/api/admin/offers/${offer.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: next }),
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
            placeholder="Search offers…"
            className="w-full bg-gray-900 border border-white/10 text-gray-200 placeholder-gray-600 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
          />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <Filter className="w-3.5 h-3.5" />
        </div>
        {['', 'free', 'premium', 'apply'].map(t => (
          <button
            key={t}
            onClick={() => { setTypeFilter(t); setPage(1) }}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${typeFilter === t ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-gray-200'}`}
          >
            {t === '' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-white/10 text-gray-300 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing…' : 'Sync PartnerStack'}
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-violet-500/20"
          >
            <Plus className="w-4 h-4" /> New Offer
          </button>
        </div>
      </div>

      {/* Stats */}
      {syncResult && (
        <p className={`text-xs px-4 py-2 rounded-xl border ${syncResult.startsWith('✓') ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'}`}>
          {syncResult}
        </p>
      )}
      <p className="text-xs text-gray-600">{total} offer{total !== 1 ? 's' : ''} total</p>

      {/* Table */}
      <div className="bg-gray-900 border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-5 h-5 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          </div>
        ) : offers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-gray-600" />
            </div>
            <p className="text-gray-400 font-medium">No offers found</p>
            <p className="text-gray-600 text-sm mt-1">Try a different search or create a new offer.</p>
            <button onClick={openCreate} className="mt-4 text-sm text-violet-400 hover:text-violet-300 font-semibold">
              + Create first offer
            </button>
          </div>
        ) : (
          <Table>
            <Thead>
              <Th>Offer</Th>
              <Th>Type</Th>
              <Th>Value</Th>
              <Th>Category</Th>
              <Th>Featured</Th>
              <Th>Created</Th>
              <Th className="text-right">Actions</Th>
            </Thead>
            <Tbody>
              {offers.map(offer => (
                <Tr key={offer.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <DealLogo name={offer.name} logo_url={offer.logo_url} logo_bg={offer.logo_bg} size="sm" />
                      <div>
                        <div className="text-gray-100 font-semibold text-sm">{offer.name}</div>
                        <div className="text-gray-600 text-xs font-mono">{offer.slug}</div>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <button onClick={() => toggleType(offer)} title="Click to toggle">
                      <Badge variant={offer.type === 'premium' ? 'violet' : offer.type === 'apply' ? 'amber' : 'green'}>
                        {offer.type}
                      </Badge>
                    </button>
                  </Td>
                  <Td>
                    <span className="text-emerald-400 font-semibold text-sm">{offer.value_label}</span>
                  </Td>
                  <Td>
                    <span className="text-gray-500 text-xs">{offer.category || '—'}</span>
                  </Td>
                  <Td>
                    <button
                      onClick={() => toggleFeatured(offer)}
                      className={`transition-colors ${offer.featured ? 'text-amber-400 hover:text-amber-500' : 'text-gray-700 hover:text-amber-400'}`}
                      title={offer.featured ? 'Unfeature' : 'Feature'}
                    >
                      <Star className={`w-4 h-4 ${offer.featured ? 'fill-current' : ''}`} />
                    </button>
                  </Td>
                  <Td>
                    <span className="text-gray-600 text-xs">{new Date(offer.created_at).toLocaleDateString()}</span>
                  </Td>
                  <Td className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {offer.affiliate_link && (
                        <a href={offer.affiliate_link} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg text-gray-600 hover:text-gray-300 hover:bg-white/5 transition-all">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button onClick={() => openEdit(offer)} className="p-1.5 rounded-lg text-gray-600 hover:text-gray-200 hover:bg-white/5 transition-all">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteTarget(offer)} className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all">
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-gray-200 disabled:opacity-30 hover:bg-white/5 transition-all">
            ← Prev
          </button>
          <span className="text-xs text-gray-600">Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-gray-200 disabled:opacity-30 hover:bg-white/5 transition-all">
            Next →
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Offer' : 'New Offer'} size="2xl">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Name" required>
            <input value={form.name || ''} onChange={e => handleFieldChange('name', e.target.value)} placeholder="e.g. AWS Activate" className={inputClass} />
          </Field>
          <Field label="Slug" required hint="Auto-generated from name">
            <input value={form.slug || ''} onChange={e => handleFieldChange('slug', e.target.value)} placeholder="aws-activate" className={inputClass} />
          </Field>
          <Field label="Value Label" required>
            <input value={form.value_label || ''} onChange={e => handleFieldChange('value_label', e.target.value)} placeholder="$5,000 Credits" className={inputClass} />
          </Field>
          <Field label="Value (number)" required>
            <input type="number" value={form.value || 0} onChange={e => handleFieldChange('value', parseInt(e.target.value) || 0)} className={inputClass} />
          </Field>
          <Field label="Type" required>
            <select value={form.type || 'free'} onChange={e => handleFieldChange('type', e.target.value)} className={selectClass}>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
              <option value="apply">Apply</option>
            </select>
          </Field>
          <Field label="Category">
            <input value={form.category || ''} onChange={e => handleFieldChange('category', e.target.value)} placeholder="Cloud Infrastructure" className={inputClass} />
          </Field>
          <Field label="Logo URL" hint="Leave blank to use colored initials">
            <div className="flex items-center gap-2">
              <input value={form.logo_url || ''} onChange={e => handleFieldChange('logo_url', e.target.value)} placeholder="https://logo.clearbit.com/company.com" className={`${inputClass} flex-1`} />
              <ImageUploadField
                value={form.logo_url || ''}
                onChange={v => handleFieldChange('logo_url', v)}
                folder="offer-logos"
                inline
              />
              {form.logo_url && (
                <img src={form.logo_url} alt="" className="w-8 h-8 rounded-lg object-contain bg-white p-0.5 border border-white/10 flex-shrink-0" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
              )}
            </div>
          </Field>
          <Field label="Logo Background Color" hint="Used as fallback when no Logo URL is set">
            <div className="flex items-center gap-2">
              <input type="color" value={form.logo_bg || '#7C3AED'} onChange={e => handleFieldChange('logo_bg', e.target.value)} className="w-10 h-10 rounded-lg bg-gray-800 border border-white/10 cursor-pointer p-1" />
              <input value={form.logo_bg || ''} onChange={e => handleFieldChange('logo_bg', e.target.value)} placeholder="#7C3AED" className={`${inputClass} flex-1`} />
            </div>
          </Field>
          <Field label="Affiliate / Redirect Link">
            <input value={form.affiliate_link || ''} onChange={e => handleFieldChange('affiliate_link', e.target.value)} placeholder="https://aws.amazon.com/activate" className={inputClass} />
          </Field>
          <Field label="Expiry Date" hint="Leave blank for no expiry">
            <input type="datetime-local" value={form.expires_at ? form.expires_at.slice(0, 16) : ''} onChange={e => handleFieldChange('expires_at', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Featured" hint="Show on homepage">
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                className={`w-10 h-6 rounded-full transition-colors flex items-center ${form.featured ? 'bg-violet-600' : 'bg-gray-700'}`}
                onClick={() => handleFieldChange('featured', !form.featured)}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-1 ${form.featured ? 'translate-x-4' : ''}`} />
              </div>
              <span className="text-sm text-gray-400">{form.featured ? 'Featured' : 'Not featured'}</span>
            </label>
          </Field>
          <Field label="Short Description" required className="col-span-2">
            <textarea value={form.description || ''} onChange={e => handleFieldChange('description', e.target.value)} placeholder="One line description…" rows={2} className={textareaClass} />
          </Field>
          <Field label="Full Description" className="col-span-2">
            <MarkdownEditor
              value={form.long_description || ''}
              onChange={v => handleFieldChange('long_description', v)}
            />
          </Field>
          <Field label="Requirements" className="col-span-2">
            <textarea value={form.requirements || ''} onChange={e => handleFieldChange('requirements', e.target.value)} placeholder="Eligibility requirements…" rows={2} className={textareaClass} />
          </Field>
        </div>

        {error && <p className="mt-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{error}</p>}

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/5">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2.5 rounded-xl border border-white/10 text-gray-300 text-sm font-medium hover:bg-white/5 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 min-w-[100px]">
            {saving ? 'Saving…' : editId ? 'Save Changes' : 'Create Offer'}
          </button>
        </div>
      </Modal>

      {/* Delete confirm */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title={`Delete "${deleteTarget?.name}"?`}
        description="This will permanently delete the offer and all associated unlocked deals. This action cannot be undone."
      />
    </div>
  )
}
