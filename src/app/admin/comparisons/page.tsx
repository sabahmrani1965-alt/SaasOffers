'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Star, StarOff, ArrowLeftRight, Save, X, ExternalLink } from 'lucide-react'

interface Comparison {
  id: string
  deal_a_slug: string
  deal_b_slug: string
  label: string
  category: string
  featured: boolean
  sort_order: number
}

const CATEGORIES = [
  'Cloud & Infrastructure',
  'AI & Developer Tools',
  'Analytics',
  'Productivity',
  'Sales & CRM',
  'Email & Marketing',
  'Customer Support',
  'Finance & Billing',
  'HR & Payroll',
  'Developer Tools',
  'Design',
  'General',
]

export default function AdminComparisonsPage() {
  const [comparisons, setComparisons] = useState<Comparison[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({
    deal_a_slug: '',
    deal_b_slug: '',
    label: '',
    category: 'General',
    featured: false,
    sort_order: 0,
  })
  const [filter, setFilter] = useState('')

  const fetchData = async () => {
    const res = await fetch('/api/admin/comparisons')
    const data = await res.json()
    setComparisons(data)
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const resetForm = () => {
    setForm({ deal_a_slug: '', deal_b_slug: '', label: '', category: 'General', featured: false, sort_order: 0 })
    setShowForm(false)
    setEditId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editId) {
      await fetch(`/api/admin/comparisons/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    } else {
      await fetch('/api/admin/comparisons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    }
    resetForm()
    fetchData()
  }

  const handleEdit = (c: Comparison) => {
    setForm({
      deal_a_slug: c.deal_a_slug,
      deal_b_slug: c.deal_b_slug,
      label: c.label,
      category: c.category,
      featured: c.featured,
      sort_order: c.sort_order,
    })
    setEditId(c.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this comparison?')) return
    await fetch(`/api/admin/comparisons/${id}`, { method: 'DELETE' })
    fetchData()
  }

  const toggleFeatured = async (c: Comparison) => {
    await fetch(`/api/admin/comparisons/${c.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: !c.featured }),
    })
    fetchData()
  }

  const grouped = comparisons.reduce<Record<string, Comparison[]>>((acc, c) => {
    if (filter && c.category !== filter) return acc
    if (!acc[c.category]) acc[c.category] = []
    acc[c.category].push(c)
    return acc
  }, {})

  return (
    <div className="p-6 sm:p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Comparisons</h1>
          <p className="text-gray-400 text-sm mt-1">{comparisons.length} tool comparisons</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/compare"
            target="_blank"
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View live
          </a>
          <button
            onClick={() => { resetForm(); setShowForm(true) }}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Comparison
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="bg-gray-900 border border-white/10 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value="">All categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">{editId ? 'Edit' : 'Add'} Comparison</h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-1 block">Tool A slug *</label>
              <input
                type="text"
                required
                value={form.deal_a_slug}
                onChange={e => setForm({ ...form, deal_a_slug: e.target.value })}
                placeholder="e.g. aws-activate"
                className="w-full bg-gray-800 border border-white/10 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-1 block">Tool B slug *</label>
              <input
                type="text"
                required
                value={form.deal_b_slug}
                onChange={e => setForm({ ...form, deal_b_slug: e.target.value })}
                placeholder="e.g. google-cloud"
                className="w-full bg-gray-800 border border-white/10 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-1 block">Label *</label>
              <input
                type="text"
                required
                value={form.label}
                onChange={e => setForm({ ...form, label: e.target.value })}
                placeholder="e.g. AWS vs Google Cloud"
                className="w-full bg-gray-800 border border-white/10 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-1 block">Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full bg-gray-800 border border-white/10 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-1 block">Sort order</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                className="w-full bg-gray-800 border border-white/10 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={e => setForm({ ...form, featured: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-600 text-violet-600 focus:ring-violet-500 bg-gray-800"
                />
                <span className="text-sm text-gray-300">Featured</span>
              </label>
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
              >
                <Save className="w-4 h-4" /> {editId ? 'Update' : 'Create'} Comparison
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Comparisons list */}
      {loading ? (
        <div className="text-gray-400 text-sm">Loading...</div>
      ) : (
        Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="mb-8">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">{category} ({items.length})</h3>
            <div className="space-y-2">
              {items.map(c => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 bg-gray-900 border border-white/5 rounded-xl px-4 py-3 group hover:border-white/10 transition-colors"
                >
                  <ArrowLeftRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{c.label}</p>
                    <p className="text-xs text-gray-500">{c.deal_a_slug} vs {c.deal_b_slug}</p>
                  </div>
                  {c.featured && (
                    <span className="text-[10px] font-semibold bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full">Featured</span>
                  )}
                  <span className="text-xs text-gray-600">#{c.sort_order}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => toggleFeatured(c)}
                      className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-amber-400 transition-colors"
                      title={c.featured ? 'Unfeature' : 'Feature'}
                    >
                      {c.featured ? <StarOff className="w-3.5 h-3.5" /> : <Star className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleEdit(c)}
                      className="px-2 py-1 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white text-xs transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={`/compare/${c.deal_a_slug}-vs-${c.deal_b_slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {!loading && comparisons.length === 0 && (
        <div className="text-center py-12">
          <ArrowLeftRight className="w-8 h-8 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No comparisons yet. Add your first one.</p>
        </div>
      )}
    </div>
  )
}
