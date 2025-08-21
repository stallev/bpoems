'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/shadcnComponents/badge';
import { Button } from '@/shared/ui/shadcnComponents/button';
import { useDashboardPermissions } from '../lib/permissions';
import { dashboardNavigation } from '../model/constants';

interface DashboardSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function DashboardSidebar({ isOpen = false, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const permissions = useDashboardPermissions();

  // Filter navigation based on permissions
  const filteredNavigation = dashboardNavigation
    .map(group => ({
      ...group,
      items: group.items.filter(item => {
        // Check permissions based on route
        if (item.href.includes('/users') && !permissions.canAccessUsers) return false;
        if (item.href.includes('/content') && !permissions.canAccessContent) return false;
        if (item.href.includes('/analytics') && !permissions.canAccessAnalytics) return false;
        if (item.href.includes('/settings') && !permissions.canAccessSettings) return false;
        if (item.href.includes('/moderation') && !permissions.canModerateContent) return false;
        return true;
      }),
    }))
    .filter(group => group.items.length > 0);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-300 ease-in-out md:relative md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">CP</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Dashboard</h2>
                <p className="text-sm text-muted-foreground">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-4">
            <div className="space-y-6">
              {filteredNavigation.map(group => (
                <div key={group.title}>
                  <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {group.title}
                  </h3>
                  <div className="mt-2 space-y-1">
                    {group.items.map(item => {
                      const isActive = pathname === item.href;
                      const Icon = item.icon;

                      return (
                        <Link key={item.href} href={item.href}>
                          <Button
                            variant={isActive ? 'secondary' : 'ghost'}
                            className={cn(
                              'w-full justify-start gap-3 h-auto py-3 px-3',
                              isActive && 'bg-secondary text-secondary-foreground'
                            )}
                            disabled={item.disabled}
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            <div className="flex-1 text-left">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{item.title}</span>
                                {item.badge && (
                                  <Badge variant="secondary" className="text-xs">
                                    {item.badge}
                                  </Badge>
                                )}
                              </div>
                              {item.description && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </Button>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t px-4 py-4">
            <div className="text-xs text-muted-foreground text-center">
              <p>Christian Poetry Platform</p>
              <p>Admin Dashboard v1.0.0</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
