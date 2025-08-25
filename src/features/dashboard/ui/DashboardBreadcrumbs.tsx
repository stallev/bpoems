import { Home } from 'lucide-react';
import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/ui/shadcnComponents/breadcrumb';

interface DashboardBreadcrumbsProps {
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}

export function DashboardBreadcrumbs({ breadcrumbs = [] }: DashboardBreadcrumbsProps) {
  return (
    <div className="flex-1 min-w-0">
      <Breadcrumb>
        <BreadcrumbList>
          {/* Home Link */}
          <BreadcrumbItem className="hidden md:flex">
            <BreadcrumbLink
              href="/dashboard"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <>
              <BreadcrumbSeparator className="hidden md:block" />
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    {crumb.href ? (
                      <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && (
                    <BreadcrumbSeparator className="hidden md:block" />
                  )}
                </React.Fragment>
              ))}
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
