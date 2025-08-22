import { Home } from 'lucide-react';
import Link from 'next/link';
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
          <Link
            href="/dashboard"
            className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>

          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <>
              <BreadcrumbSeparator className="hidden md:block" />
              {breadcrumbs.map((crumb, index) => (
                <BreadcrumbItem key={index}>
                  {crumb.href ? (
                    <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  )}
                  {index < breadcrumbs.length - 1 && (
                    <BreadcrumbSeparator className="hidden md:block" />
                  )}
                </BreadcrumbItem>
              ))}
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
