'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Crown, ToggleLeft, ToggleRight } from 'lucide-react'
import { Badge } from './Badge'
import { Table, Thead, Th, Tbody, Tr, Td } from './AdminTable'

interface User {
  id: string
  email: string
  is_premium: boolean
  is_admin: boolean
  created_at: string
}

export function UsersManager() {
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const [planFilter, setPlanFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  const fetch_ = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), q, plan: planFilter })
    const res = await fetch(`/api/admin/users?${params}`)
    const json = await res.json()
    setUsers(json.data ?? [])
    setTotal(json.count ?? 0)
    setLoading(false)
  }, [page, q, planFilter])

  useEffect(() => { fetch_() }, [fetch_])

  async function togglePremium(user: User) {
    setUpdating(user.id)
    await fetch(`/api/admin/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_premium: !user.is_premium }),
    })
    setUpdating(null)
    fetch_()
  }

  const totalPages = Math.ceil(total / 20)
  const premiumCount = users.filter(u => u.is_premium).length

  return (
    <div className="px-8 py-6 space-y-5">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <input
            value={q}
            onChange={e => { setQ(e.target.value); setPage(1) }}
            placeholder="Search by email…"
            className="w-full bg-gray-900 border border-white/10 text-gray-200 placeholder-gray-600 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {[{ v: '', l: 'All' }, { v: 'premium', l: 'Premium' }, { v: 'free', l: 'Free' }].map(opt => (
            <button key={opt.v} onClick={() => { setPlanFilter(opt.v); setPage(1) }}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${planFilter === opt.v ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-gray-200'}`}>
              {opt.l}
            </button>
          ))}
        </div>
        <div className="ml-auto text-xs text-gray-600">
          {premiumCount} premium on this page
        </div>
      </div>

      <p className="text-xs text-gray-600">{total} user{total !== 1 ? 's' : ''} total</p>

      {/* Table */}
      <div className="bg-gray-900 border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-5 h-5 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-gray-600" />
            </div>
            <p className="text-gray-400 font-medium">No users found</p>
          </div>
        ) : (
          <Table>
            <Thead>
              <Th>User</Th>
              <Th>Plan</Th>
              <Th>Role</Th>
              <Th>Joined</Th>
              <Th className="text-right">Actions</Th>
            </Thead>
            <Tbody>
              {users.map(user => (
                <Tr key={user.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {user.email.slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-gray-100 font-medium text-sm">{user.email}</div>
                        <div className="text-gray-600 text-xs font-mono">{user.id.slice(0, 8)}…</div>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <Badge variant={user.is_premium ? 'amber' : 'gray'}>
                      {user.is_premium ? <><Crown className="w-3 h-3" /> Premium</> : 'Free'}
                    </Badge>
                  </Td>
                  <Td>
                    {user.is_admin ? (
                      <Badge variant="violet">Admin</Badge>
                    ) : (
                      <span className="text-gray-600 text-xs">User</span>
                    )}
                  </Td>
                  <Td>
                    <span className="text-gray-500 text-xs">{new Date(user.created_at).toLocaleDateString()}</span>
                  </Td>
                  <Td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => togglePremium(user)}
                        disabled={updating === user.id}
                        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-violet-500/50 transition-all disabled:opacity-40"
                        title={user.is_premium ? 'Downgrade to Free' : 'Upgrade to Premium'}
                      >
                        {updating === user.id ? (
                          <div className="w-3 h-3 border border-gray-500 border-t-gray-300 rounded-full animate-spin" />
                        ) : user.is_premium ? (
                          <><ToggleRight className="w-3.5 h-3.5 text-amber-400" /> Downgrade</>
                        ) : (
                          <><ToggleLeft className="w-3.5 h-3.5" /> Upgrade</>
                        )}
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
    </div>
  )
}
