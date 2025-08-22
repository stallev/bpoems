import type { LucideIcon } from 'lucide-react';

export interface DashboardNavigationItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  badge?: string;
  disabled?: boolean;
}

export interface DashboardNavigationGroup {
  title: string;
  items: DashboardNavigationItem[];
}

export interface DashboardPermissions {
  canAccessUsers: boolean;
  canAccessContent: boolean;
  canAccessAnalytics: boolean;
  canAccessSettings: boolean;
  canModerateContent: boolean;
  canManageRoles: boolean;
}

export interface DashboardStats {
  totalUsers: number;
  totalPoems: number;
  activeCategories: number;
  pendingModeration: number;
  userGrowth: number;
  poemGrowth: number;
  categoryGrowth: number;
  moderationChange: number;
}
