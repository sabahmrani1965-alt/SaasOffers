import { AdminHeader } from '@/components/admin/AdminHeader'
import { requireAdmin } from '@/lib/admin-auth'
import { BlogManager } from '@/components/admin/BlogManager'

export const dynamic = 'force-dynamic'

export default async function AdminBlogPage() {
  await requireAdmin()
  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Blog"
        description="Create and manage blog posts and SEO content."
      />
      <BlogManager />
    </div>
  )
}
