import { AdminHeader } from '@/components/admin/AdminHeader'
import { requireAdmin } from '@/lib/admin-auth'
import { OffersManager } from '@/components/admin/OffersManager'

export const dynamic = 'force-dynamic'

export default async function AdminOffersPage() {
  await requireAdmin()
  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Offers"
        description="Create, edit, and manage all SaaS deals."
      />
      <OffersManager />
    </div>
  )
}
