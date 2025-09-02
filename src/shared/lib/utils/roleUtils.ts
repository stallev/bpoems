import {
  UserRole,
  ROLE_HIERARCHY,
  CONTENT_CREATION_ROLES,
  IMMEDIATE_PUBLISH_ROLES,
  MODERATION_ROLES,
  ADMINISTRATION_ROLES,
} from '@/shared/constants/Roles';

/**
 * Helper function to check if a user has a specific role or higher
 */
export const hasRoleOrHigher = (userRole: string, requiredRole: UserRole): boolean => {
  const userLevel = ROLE_HIERARCHY[userRole as UserRole] ?? -1;
  const requiredLevel = ROLE_HIERARCHY[requiredRole];
  return userLevel >= requiredLevel;
};

/**
 * Helper function to check if a user can create content
 */
export const canCreateContent = (userRole: string): boolean => {
  return CONTENT_CREATION_ROLES.includes(
    userRole as UserRole.SUBSCRIBER | UserRole.AUTHOR | UserRole.MODERATOR | UserRole.ADMIN
  );
};

/**
 * Helper function to check if a user can publish content immediately
 */
export const canPublishImmediately = (userRole: string): boolean => {
  return IMMEDIATE_PUBLISH_ROLES.includes(
    userRole as UserRole.AUTHOR | UserRole.MODERATOR | UserRole.ADMIN
  );
};

/**
 * Helper function to check if a user can moderate content
 */
export const canModerateContent = (userRole: string): boolean => {
  return MODERATION_ROLES.includes(userRole as UserRole.MODERATOR | UserRole.ADMIN);
};

/**
 * Helper function to check if a user has administrative privileges
 */
export const hasAdministrativePrivileges = (userRole: string): boolean => {
  return ADMINISTRATION_ROLES.includes(userRole as UserRole.ADMIN);
};
