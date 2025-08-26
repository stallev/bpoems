import { RoutePath } from '@/shared/constants/RoutePath';

/**
 * Helper function to get path string from route object
 */
export const getRoutePath = (route: keyof typeof RoutePath): string => {
  return RoutePath[route].path;
};

/**
 * Helper function to check if route requires authentication
 */
export const isPrivateRoute = (route: keyof typeof RoutePath): boolean => {
  return RoutePath[route].type === 'private';
};

/**
 * Helper function to check if user role has access to route
 */
export const hasRouteAccess = (route: keyof typeof RoutePath, userRole: string): boolean => {
  const routeConfig = RoutePath[route];
  if (routeConfig.type === 'public') return true;
  if (routeConfig.role === 'subscriber')
    return ['subscriber', 'author', 'moderator', 'admin'].includes(userRole);
  if (routeConfig.role === 'author') return ['author', 'moderator', 'admin'].includes(userRole);
  if (routeConfig.role === 'moderator') return ['moderator', 'admin'].includes(userRole);
  if (routeConfig.role === 'admin') return userRole === 'admin';
  return false;
};
