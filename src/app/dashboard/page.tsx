import { DashboardBreadcrumbs } from '@/features/dashboard/ui/DashboardBreadcrumbs';

const DashboardPage = () => {
  const breadcrumbs = [{ label: 'Dashboard' }];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Platform management panel</p>
        </div>
      </div>

      {/* Breadcrumbs */}
      <DashboardBreadcrumbs breadcrumbs={breadcrumbs} />

      {/* Dashboard Content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Statistics</h3>
          <p className="text-muted-foreground">Platform statistics will be displayed here</p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Activity</h3>
          <p className="text-muted-foreground">Recent user activity</p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Notifications</h3>
          <p className="text-muted-foreground">New notifications and events</p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
          <p className="text-muted-foreground">Access to main functions</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
