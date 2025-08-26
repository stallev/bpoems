/**
 * User Role Constants
 *
 * These constants define the hierarchical role-based access control system.
 * Roles are ordered from lowest to highest privileges.
 */

export enum UserRole {
  READER = 'READER', // Unauthenticated user privileges
  SUBSCRIBER = 'SUBSCRIBER', // Base authenticated role
  AUTHOR = 'AUTHOR', // Can publish poems immediately
  MODERATOR = 'MODERATOR', // Can manage categories, moderate content, approve author requests
  ADMIN = 'ADMIN', // Full system access
}

/**
 * Role hierarchy for permission checking
 */
export const ROLE_HIERARCHY = {
  [UserRole.READER]: 0,
  [UserRole.SUBSCRIBER]: 1,
  [UserRole.AUTHOR]: 2,
  [UserRole.MODERATOR]: 3,
  [UserRole.ADMIN]: 4,
} as const;

/**
 * Role labels for UI display
 */
export const ROLE_LABELS = {
  [UserRole.READER]: {
    RU: 'Читатель',
    EN: 'Reader',
    UA: 'Читач',
  },
  [UserRole.SUBSCRIBER]: {
    RU: 'Подписчик',
    EN: 'Subscriber',
    UA: 'Підписник',
  },
  [UserRole.AUTHOR]: {
    RU: 'Автор',
    EN: 'Author',
    UA: 'Автор',
  },
  [UserRole.MODERATOR]: {
    RU: 'Модератор',
    EN: 'Moderator',
    UA: 'Модератор',
  },
  [UserRole.ADMIN]: {
    RU: 'Администратор',
    EN: 'Administrator',
    UA: 'Адміністратор',
  },
} as const;

/**
 * Roles that can create content (poems, comments, etc.)
 */
export const CONTENT_CREATION_ROLES = [
  UserRole.SUBSCRIBER,
  UserRole.AUTHOR,
  UserRole.MODERATOR,
  UserRole.ADMIN,
] as const;

/**
 * Roles that can publish content immediately without moderation
 */
export const IMMEDIATE_PUBLISH_ROLES = [
  UserRole.AUTHOR,
  UserRole.MODERATOR,
  UserRole.ADMIN,
] as const;

/**
 * Roles that can moderate content
 */
export const MODERATION_ROLES = [UserRole.MODERATOR, UserRole.ADMIN] as const;

/**
 * Roles that can manage user accounts and roles
 */
export const ADMINISTRATION_ROLES = [UserRole.ADMIN] as const;
