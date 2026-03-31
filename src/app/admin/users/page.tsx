import { AdminHeader } from '@/components/admin/AdminHeader'
import { requireAdmin } from '@/lib/admin-auth'
import { UsersManager } from '@/components/admin/UsersManager'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  await requireAdmin()
  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Users"
        description="Manage user accounts, plans, and subscriptions."
      />
      <UsersManager />
    </div>
  )
}
