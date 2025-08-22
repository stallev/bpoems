import { Menu, X } from 'lucide-react';
import { Button } from '@/shared/ui/shadcnComponents/button';
import { Separator } from '@/shared/ui/shadcnComponents/separator';
import { DashboardBreadcrumbs } from './DashboardBreadcrumbs';

interface DashboardHeaderProps {
  title?: string;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

export function DashboardHeader({
  title = 'Dashboard',
  breadcrumbs = [],
  onMenuToggle,
  isMenuOpen = false,
}: DashboardHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="flex items-center gap-2 px-4 w-full">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuToggle}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>

        <Separator orientation="vertical" className="mr-2 h-4 hidden md:block" />

        {/* Breadcrumbs */}
        <DashboardBreadcrumbs breadcrumbs={breadcrumbs} />

        {/* Page Title - Mobile */}
        <div className="md:hidden flex-1 text-center">
          <h1 className="text-lg font-semibold truncate">{title}</h1>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Add any header actions here */}
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            {/* User info or other actions can go here */}
          </div>
        </div>
      </div>
    </header>
  );
}
