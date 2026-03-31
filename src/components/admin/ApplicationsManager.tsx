'use client'

import { useState, useEffect, useCallback } from 'react'
import { Check, X, Clock, Building2, Globe, Mail, Users, ChevronDown, ChevronUp } from 'lucide-react'
import { Badge } from './Badge'
import { Table, Thead, Th, Tbody, Tr, Td } from './AdminTable'
import { DealLogo } from '@/components/ui/DealLogo'

interface Application {
  id: string
  company_name: string
  website: string
  company_email: string
  funding_stage: string
  team_size: string
  use_case?: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  user: { email: string }
  deal: { name: string; slug: string; logo_bg: string; logo_url?: string }
}

export function ApplicationsManager() {
  const [apps, setApps] = useState<Application[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  const fetch_ = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), status: statusFilter })
    const res = await fetch(`/api/admin/applications?${params}`)
    const json = await res.json()
    setApps(json.data ?? [])
    setTotal(json.count ?? 0)
    setLoading(false)
  }, [page, statusFilter])

  useEffect(() => { fetch_() }, [fetch_])

  async function updateStatus(id: string, status: 'approved' | 'rejected') {
    setUpdating(id)
    await fetch(`/api/admin/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setUpdating(null)
    fetch_()
  }

  const totalPages = Math.ceil(total / 20)

  const statusVariant = (s: string) =>
    s === 'approved' ? 'green' : s === 'rejected' ? 'red' : 'amber'

  return (
    <div className="px-8 py-6 space-y-5">
      {/* Filters */}
      <div className="flex items-center gap-2">
        {[
          { v: 'pending', l: 'Pending' },
          { v: 'approved', l: 'Approved' },
          { v: 'rejected', l: 'Rejected' },
          { v: '', l: 'All' },
        ].map(opt => (
          <button key={opt.v} onClick={() => { setStatusFilter(opt.v); setPage(1) }}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${statusFilter === opt.v ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-gray-200'}`}>
            {opt.l}
          </button>
        ))}
        <span className="text-xs text-gray-600 ml-2">{total} total</span>
      </div>

      <div className="bg-gray-900 border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-5 h-5 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          </div>
        ) : apps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-gray-600" />
            </div>
            <p className="text-gray-400 font-medium">No {statusFilter || ''} applications</p>
          </div>
        ) : (
          <Table>
            <Thead>
              <Th>Company</Th>
              <Th>Deal</Th>
              <Th>Stage</Th>
              <Th>Status</Th>
              <Th>Applied</Th>
              <Th className="text-right">Actions</Th>
            </Thead>
            <Tbody>
              {apps.map(app => (
                <>
                  <Tr key={app.id} className="cursor-pointer" onClick={() => setExpanded(expanded === app.id ? null : app.id)}>
                    <Td>
                      <div>
                        <div className="text-gray-100 font-semibold text-sm">{app.company_name}</div>
                        <div className="text-gray-500 text-xs">{app.user?.email}</div>
                      </div>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <DealLogo name={app.deal?.name || ''} logo_url={app.deal?.logo_url} logo_bg={app.deal?.logo_bg} size="sm" />
                        <span className="text-gray-300 text-sm">{app.deal?.name}</span>
                      </div>
                    </Td>
                    <Td>
                      <span className="text-gray-400 text-xs capitalize">{app.funding_stage?.replace('-', ' ')}</span>
                    </Td>
                    <Td>
                      <Badge variant={statusVariant(app.status) as any}>
                        {app.status}
                      </Badge>
                    </Td>
                    <Td>
                      <span className="text-gray-600 text-xs">{new Date(app.created_at).toLocaleDateString()}</span>
                    </Td>
                    <Td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {app.status === 'pending' && (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); updateStatus(app.id, 'approved') }}
                              disabled={updating === app.id}
                              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all disabled:opacity-40"
                            >
                              <Check className="w-3 h-3" /> Approve
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); updateStatus(app.id, 'rejected') }}
                              disabled={updating === app.id}
                              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-40"
                            >
                              <X className="w-3 h-3" /> Reject
                            </button>
                          </>
                        )}
                        {expanded === app.id
                          ? <ChevronUp className="w-4 h-4 text-gray-500" />
                          : <ChevronDown className="w-4 h-4 text-gray-500" />
                        }
                      </div>
                    </Td>
                  </Tr>

                  {/* Expanded details row */}
                  {expanded === app.id && (
                    <tr key={`${app.id}-detail`} className="bg-white/[0.02]">
                      <td colSpan={6} className="px-4 py-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-start gap-2">
                            <Globe className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="text-xs text-gray-600 mb-0.5">Website</div>
                              <a href={app.website} target="_blank" rel="noreferrer" className="text-violet-400 hover:underline text-xs">{app.website}</a>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Mail className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="text-xs text-gray-600 mb-0.5">Business Email</div>
                              <div className="text-gray-300 text-xs">{app.company_email}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Users className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="text-xs text-gray-600 mb-0.5">Team Size</div>
                              <div className="text-gray-300 text-xs">{app.team_size}</div>
                            </div>
                          </div>
                          {app.use_case && (
                            <div className="flex items-start gap-2 col-span-2 sm:col-span-4">
                              <Building2 className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <div className="text-xs text-gray-600 mb-0.5">Use Case</div>
                                <div className="text-gray-300 text-xs leading-relaxed">{app.use_case}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
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
    </div>
  )
}
