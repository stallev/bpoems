import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { canDeleteCategories } from '@/features/dashboard/lib/permissions';
import { getCategories } from '@/features/dashboard/server-actions/categories';
import { CategoryList } from '@/features/dashboard/ui/components/ContentManagement/CategoryList';
import { DashboardBreadcrumbs } from '@/features/dashboard/ui/DashboardBreadcrumbs';
import { auth } from '@/shared/api/auth/auth';

async function CategoriesContent() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth');
  }

  if (!['ADMIN', 'MODERATOR'].includes(session.user.role)) {
    redirect('/dashboard');
  }

  // Get all categories for client-side filtering
  const result = await getCategories('all');

  if (!result.success || !result.data) {
    throw new Error(result.message || 'Error getting data');
  }

  const { categories, stats } = result.data;
  const canDelete = canDeleteCategories(session.user.role);

  return (
    <CategoryList categories={categories} stats={stats} isLoading={false} canDelete={canDelete} />
  );
}

export default function CategoriesPage() {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Content', href: '/dashboard/content' },
    { label: 'Categories' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Category Management</h1>
          <p className="text-muted-foreground">Create and manage categories for poems</p>
        </div>
      </div>

      {/* Breadcrumbs */}
      <DashboardBreadcrumbs breadcrumbs={breadcrumbs} />

      {/* Content */}
      <Suspense
        fallback={
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded animate-pulse" />
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        }
      >
        <CategoriesContent />
      </Suspense>
    </div>
  );
}
