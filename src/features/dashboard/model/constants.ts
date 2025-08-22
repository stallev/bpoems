import {
  Home,
  Users,
  FileText,
  Shield,
  BarChart3,
  Settings,
  Folder,
  Tag,
  Flag,
  UserCheck,
  Activity,
  Cog,
  Lock,
  Palette,
} from 'lucide-react';

import type { DashboardNavigationGroup } from './types';

export const dashboardNavigation: DashboardNavigationGroup[] = [
  {
    title: 'Overview',
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: Home,
        description: 'Platform overview and statistics',
      },
    ],
  },
  {
    title: 'Management',
    items: [
      {
        title: 'User Management',
        href: '/dashboard/users',
        icon: Users,
        description: 'Manage user accounts and roles',
      },
      {
        title: 'Content Management',
        href: '/dashboard/content',
        icon: FileText,
        description: 'Manage poems and content',
      },
      {
        title: 'Categories',
        href: '/dashboard/content/categories',
        icon: Folder,
        description: 'Manage poem categories',
      },
      {
        title: 'Tags',
        href: '/dashboard/content/tags',
        icon: Tag,
        description: 'Manage content tags',
      },
    ],
  },
  {
    title: 'Moderation',
    items: [
      {
        title: 'Moderation Queue',
        href: '/dashboard/moderation',
        icon: Shield,
        description: 'Review pending content',
      },
      {
        title: 'Reports',
        href: '/dashboard/moderation/reports',
        icon: Flag,
        description: 'Handle user reports',
      },
      {
        title: 'Author Requests',
        href: '/dashboard/moderation/requests',
        icon: UserCheck,
        description: 'Review author role requests',
      },
    ],
  },
  {
    title: 'Analytics',
    items: [
      {
        title: 'Analytics Overview',
        href: '/dashboard/analytics',
        icon: BarChart3,
        description: 'Platform analytics dashboard',
      },
      {
        title: 'User Analytics',
        href: '/dashboard/analytics/users',
        icon: Users,
        description: 'User behavior and statistics',
      },
      {
        title: 'Content Analytics',
        href: '/dashboard/analytics/content',
        icon: FileText,
        description: 'Content performance metrics',
      },
      {
        title: 'Platform Analytics',
        href: '/dashboard/analytics/platform',
        icon: Activity,
        description: 'Platform-wide statistics',
      },
    ],
  },
  {
    title: 'Settings',
    items: [
      {
        title: 'Settings Overview',
        href: '/dashboard/settings',
        icon: Settings,
        description: 'Platform configuration',
      },
      {
        title: 'System Settings',
        href: '/dashboard/settings/system',
        icon: Cog,
        description: 'System configuration',
      },
      {
        title: 'Security Settings',
        href: '/dashboard/settings/security',
        icon: Lock,
        description: 'Security and access control',
      },
      {
        title: 'Content Settings',
        href: '/dashboard/settings/content',
        icon: Palette,
        description: 'Content management settings',
      },
    ],
  },
];
