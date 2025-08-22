import { Heart } from 'lucide-react';

export function DashboardFooter() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left side - Platform info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Christian Poetry Platform</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">Admin Dashboard</span>
          </div>

          {/* Center - Copyright */}
          <div className="text-sm text-muted-foreground text-center md:text-left">
            <span>© 2024 Christian Poetry Platform. Made with </span>
            <Heart className="inline h-3 w-3 text-red-500" />
            <span> for the community.</span>
          </div>

          {/* Right side - Version info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="hidden sm:inline">Version 1.0.0</span>
            <span className="hidden md:inline">•</span>
            <span>Admin Panel</span>
          </div>
        </div>

        {/* Mobile - Stacked layout */}
        <div className="md:hidden mt-4 pt-4 border-t border-border">
          <div className="text-center text-sm text-muted-foreground">
            <div>Version 1.0.0 • Admin Panel</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
