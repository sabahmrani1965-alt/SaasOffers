'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Bookmark, BookmarkCheck, ExternalLink, Clock, MapPin, DollarSign,
  Filter, SortAsc, Lock, Zap, ArrowRight, ChevronDown, X, Search,
  Rocket, CheckCircle2, XCircle, Send, Star,
} from 'lucide-react'
import Link from 'next/link'

interface Accelerator {
  id: string
  name: string
  description: string
  logo_bg: string
  funding_amount: string
  funding_value: number
  equity: string
  deadline: string | null
  duration: string
  location: string
  is_remote: boolean
  industry: string[]
  stage: string[]
  website_url: string
  apply_url: string
  batch: string | null
  featured: boolean
}

interface Status {
  accelerator_id: string
  status: string
}

interface Saved {
  accelerator_id: string
}

interface Props {
  accelerators: Accelerator[]
  statuses: Status[]
  saved: Saved[]
  isPremium: boolean
  userId: string
}

const STATUS_OPTIONS = [
  { value: 'interested', label: 'Interested', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  { value: 'applied', label: 'Applied', icon: Send, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  { value: 'accepted', label: 'Accepted', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { value: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
]

const ALL_INDUSTRIES = ['SaaS', 'AI', 'Fintech', 'Healthcare', 'Climate', 'B2B', 'Consumer', 'Deep Tech', 'Biotech', 'E-commerce', 'Hardware', 'Developer Tools']
const ALL_STAGES = ['Pre-idea', 'Pre-seed', 'Seed', 'Series A']
const SORT_OPTIONS = [
  { value: 'deadline', label: 'Deadline (soonest)' },
  { value: 'funding', label: 'Funding (highest)' },
  { value: 'newest', label: 'Newest added' },
]

function daysUntil(deadline: string | null): number | null {
  if (!deadline) return null
  const diff = new Date(deadline).getTime() - new Date().getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function DeadlineBadge({ deadline }: { deadline: string | null }) {
  const days = daysUntil(deadline)
  if (days === null) return <span className="text-xs text-gray-400">Rolling</span>
  if (days < 0) return <span className="text-xs text-red-500 font-medium">Closed</span>
  if (days <= 7) return <span className="text-xs text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded-full">{days}d left</span>
  if (days <= 30) return <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">{days}d left</span>
  return <span className="text-xs text-gray-500">{days}d left</span>
}

export function AcceleratorsClient({ accelerators, statuses: initialStatuses, saved: initialSaved, isPremium, userId }: Props) {
  const [statusMap, setStatusMap] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {}
    initialStatuses.forEach(s => { map[s.accelerator_id] = s.status })
    return map
  })
  const [savedSet, setSavedSet] = useState<Set<string>>(() => new Set(initialSaved.map(s => s.accelerator_id)))
  const [tab, setTab] = useState<'all' | 'saved' | 'tracker'>('all')
  const [industryFilter, setIndustryFilter] = useState<string>('')
  const [stageFilter, setStageFilter] = useState<string>('')
  const [remoteFilter, setRemoteFilter] = useState<boolean>(false)
  const [sortBy, setSortBy] = useState<string>('deadline')
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const FREE_LIMIT = 5

  const supabase = createClient()

  const toggleSave = async (accId: string) => {
    if (savedSet.has(accId)) {
      setSavedSet(prev => { const n = new Set(prev); n.delete(accId); return n })
      await supabase.from('user_saved_accelerators').delete().eq('user_id', userId).eq('accelerator_id', accId)
    } else {
      setSavedSet(prev => new Set(prev).add(accId))
      await supabase.from('user_saved_accelerators').insert({ user_id: userId, accelerator_id: accId })
    }
  }

  const setStatus = async (accId: string, status: string) => {
    const current = statusMap[accId]
    if (current === status) {
      // Remove status
      setStatusMap(prev => { const n = { ...prev }; delete n[accId]; return n })
      await supabase.from('user_accelerator_status').delete().eq('user_id', userId).eq('accelerator_id', accId)
    } else {
      setStatusMap(prev => ({ ...prev, [accId]: status }))
      await supabase.from('user_accelerator_status').upsert(
        { user_id: userId, accelerator_id: accId, status, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,accelerator_id' }
      )
    }
  }

  // Filter and sort
  let filtered = [...accelerators]

  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(a => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q))
  }
  if (industryFilter) filtered = filtered.filter(a => a.industry.includes(industryFilter))
  if (stageFilter) filtered = filtered.filter(a => a.stage.includes(stageFilter))
  if (remoteFilter) filtered = filtered.filter(a => a.is_remote)

  if (tab === 'saved') filtered = filtered.filter(a => savedSet.has(a.id))
  if (tab === 'tracker') filtered = filtered.filter(a => statusMap[a.id])

  filtered.sort((a, b) => {
    if (sortBy === 'deadline') {
      const da = a.deadline ? new Date(a.deadline).getTime() : Infinity
      const db = b.deadline ? new Date(b.deadline).getTime() : Infinity
      return da - db
    }
    if (sortBy === 'funding') return b.funding_value - a.funding_value
    return 0 // newest = default order
  })

  const trackerCounts = {
    interested: Object.values(statusMap).filter(s => s === 'interested').length,
    applied: Object.values(statusMap).filter(s => s === 'applied').length,
    accepted: Object.values(statusMap).filter(s => s === 'accepted').length,
    rejected: Object.values(statusMap).filter(s => s === 'rejected').length,
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 mb-6">
        {([
          { key: 'all', label: `All (${accelerators.length})`, icon: Rocket },
          { key: 'saved', label: `Saved (${savedSet.size})`, icon: Bookmark },
          { key: 'tracker', label: `Tracker (${Object.keys(statusMap).length})`, icon: Send },
        ] as const).map(t => {
          const Icon = t.icon
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all flex-1 justify-center ${
                tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Tracker summary */}
      {tab === 'tracker' && (
        <div className="grid grid-cols-4 gap-3 mb-6">
          {STATUS_OPTIONS.map(s => {
            const Icon = s.icon
            return (
              <div key={s.value} className={`${s.bg} border ${s.border} rounded-xl p-3 text-center`}>
                <Icon className={`w-4 h-4 ${s.color} mx-auto mb-1`} />
                <div className={`text-lg font-bold ${s.color}`}>{trackerCounts[s.value as keyof typeof trackerCounts]}</div>
                <div className="text-xs text-gray-600">{s.label}</div>
              </div>
            )
          })}
        </div>
      )}

      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search accelerators..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
            showFilters || industryFilter || stageFilter || remoteFilter
              ? 'border-violet-300 bg-violet-50 text-violet-700'
              : 'border-gray-200 text-gray-600 hover:border-gray-300'
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
          {(industryFilter || stageFilter || remoteFilter) && (
            <span className="w-2 h-2 rounded-full bg-violet-500" />
          )}
        </button>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 font-medium focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          {SORT_OPTIONS.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6 shadow-sm">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[180px]">
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Industry</label>
              <select
                value={industryFilter}
                onChange={e => setIndustryFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
              >
                <option value="">All industries</option>
                {ALL_INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Stage</label>
              <select
                value={stageFilter}
                onChange={e => setStageFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
              >
                <option value="">All stages</option>
                {ALL_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remoteFilter}
                  onChange={e => setRemoteFilter(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                />
                <span className="text-sm font-medium text-gray-700">Remote only</span>
              </label>
            </div>
            {(industryFilter || stageFilter || remoteFilter) && (
              <div className="flex items-end">
                <button
                  onClick={() => { setIndustryFilter(''); setStageFilter(''); setRemoteFilter(false) }}
                  className="text-xs text-violet-600 font-semibold hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results count */}
      <p className="text-xs text-gray-500 mb-4">{filtered.length} accelerator{filtered.length !== 1 ? 's' : ''}</p>

      {/* Accelerator cards */}
      <div className="space-y-4">
        {filtered.map((acc, index) => {
          const isLocked = !isPremium && index >= FREE_LIMIT && tab === 'all'
          const isSaved = savedSet.has(acc.id)
          const currentStatus = statusMap[acc.id]

          if (isLocked) {
            return (
              <div key={acc.id} className="relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm overflow-hidden">
                <div className="absolute inset-0 backdrop-blur-sm bg-white/70 z-10 flex flex-col items-center justify-center">
                  <Lock className="w-6 h-6 text-gray-400 mb-2" />
                  <p className="text-sm font-semibold text-gray-700 mb-1">Premium accelerator</p>
                  <p className="text-xs text-gray-500 mb-3">Upgrade to view all {accelerators.length} accelerators</p>
                  <Link
                    href="/api/stripe/checkout"
                    className="flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-pink-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md"
                  >
                    <Zap className="w-3 h-3" fill="white" />
                    Upgrade — $79/yr
                  </Link>
                </div>
                <div className="opacity-30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-200" />
                    <div>
                      <div className="h-4 w-32 bg-gray-200 rounded" />
                      <div className="h-3 w-48 bg-gray-100 rounded mt-1" />
                    </div>
                  </div>
                </div>
              </div>
            )
          }

          return (
            <div
              key={acc.id}
              className={`bg-white border rounded-2xl p-6 shadow-sm transition-all hover:shadow-md ${
                acc.featured ? 'border-violet-200 ring-1 ring-violet-100' : 'border-gray-100'
              }`}
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: acc.logo_bg }}
                  >
                    {acc.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 text-sm">{acc.name}</h3>
                      {acc.featured && (
                        <span className="text-[10px] font-semibold bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded-full">Featured</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{acc.location}</span>
                      {acc.is_remote && <span className="text-emerald-600 font-medium">Remote OK</span>}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleSave(acc.id)}
                  className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  title={isSaved ? 'Remove bookmark' : 'Bookmark'}
                >
                  {isSaved
                    ? <BookmarkCheck className="w-5 h-5 text-violet-600 fill-violet-600" />
                    : <Bookmark className="w-5 h-5 text-gray-300 hover:text-gray-500" />
                  }
                </button>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">{acc.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {acc.industry.slice(0, 4).map(tag => (
                  <span key={tag} className="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tag}</span>
                ))}
                {acc.stage.map(tag => (
                  <span key={tag} className="text-[10px] font-medium bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full">{tag}</span>
                ))}
                {acc.industry.length > 4 && (
                  <span className="text-[10px] text-gray-400">+{acc.industry.length - 4} more</span>
                )}
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-4 text-xs text-gray-600 mb-4 flex-wrap">
                <span className="flex items-center gap-1 font-semibold text-emerald-600">
                  <DollarSign className="w-3 h-3" />{acc.funding_amount}
                </span>
                <span>{acc.equity} equity</span>
                {acc.duration && <span>{acc.duration}</span>}
                {acc.batch && <span className="text-gray-400">{acc.batch}</span>}
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <DeadlineBadge deadline={acc.deadline} />
                </span>
              </div>

              {/* Action row */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Status buttons */}
                {STATUS_OPTIONS.map(s => {
                  const Icon = s.icon
                  const isActive = currentStatus === s.value
                  return (
                    <button
                      key={s.value}
                      onClick={() => setStatus(acc.id, s.value)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        isActive
                          ? `${s.bg} ${s.border} ${s.color}`
                          : 'border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      {s.label}
                    </button>
                  )
                })}

                <div className="flex-1" />

                {/* Apply button */}
                <a
                  href={acc.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-pink-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  Apply <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty states */}
      {filtered.length === 0 && tab === 'saved' && (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
          <Bookmark className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-700 mb-1">No saved accelerators</p>
          <p className="text-xs text-gray-500">Bookmark accelerators to track them here.</p>
        </div>
      )}

      {filtered.length === 0 && tab === 'tracker' && (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
          <Send className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-700 mb-1">No tracked applications</p>
          <p className="text-xs text-gray-500">Mark accelerators as Interested, Applied, Accepted, or Rejected to track them.</p>
        </div>
      )}

      {filtered.length === 0 && tab === 'all' && search && (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
          <Search className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-700 mb-1">No accelerators match your search</p>
          <p className="text-xs text-gray-500">Try different keywords or clear filters.</p>
        </div>
      )}
    </div>
  )
}
