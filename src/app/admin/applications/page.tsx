import { AdminHeader } from '@/components/admin/AdminHeader'
import { requireAdmin } from '@/lib/admin-auth'
import { ApplicationsManager } from '@/components/admin/ApplicationsManager'

export const dynamic = 'force-dynamic'

export default async function AdminApplicationsPage() {
  await requireAdmin()
  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Applications"
        description="Review and approve apply-type deal applications."
      />
      <ApplicationsManager />
    </div>
  )
}
