import { useSession } from 'next-auth/react';
import type { DashboardPermissions } from '../model/types';

export function useDashboardPermissions(): DashboardPermissions {
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  return {
    canAccessUsers: userRole === 'ADMIN',
    canAccessContent: ['ADMIN', 'MODERATOR'].includes(userRole || ''),
    canAccessAnalytics: userRole === 'ADMIN',
    canAccessSettings: userRole === 'ADMIN',
    canModerateContent: ['ADMIN', 'MODERATOR'].includes(userRole || ''),
    canManageRoles: userRole === 'ADMIN',
  };
}
