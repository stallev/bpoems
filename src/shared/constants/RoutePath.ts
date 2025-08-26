/**
 * Route Path Constants
 *
 * Centralized route paths for the application to ensure consistency
 * and maintainability. All route paths should be imported from this file.
 */

export const RoutePath = {
  // Public routes
  HOME: {
    path: '/',
    name: 'Главная',
    type: 'public',
    role: 'all',
  },
  ABOUT: {
    path: '/about',
    name: 'about',
    type: 'public',
    role: 'all',
  },
  LOGIN: {
    path: '/auth',
    name: 'Войти',
    type: 'public',
    role: 'all',
  },

  // Poem routes
  POEMS_LIST: {
    path: '/poems',
    name: 'Стихи',
    type: 'public',
    role: 'all',
  },
  POEM_DETAIL: {
    path: '/poems/[slug]',
    name: 'poemDetail',
    type: 'public',
    role: 'all',
  },

  // Profile routes
  PROFILE: {
    path: '/profile',
    name: 'Профиль',
    type: 'private',
    role: 'subscriber',
  },
  PROFILE_SETTINGS: {
    path: '/profile',
    name: 'profileSettings',
    type: 'private',
    role: 'subscriber',
  },
  PROFILE_MY_POEMS: {
    path: '/profile/my-poems',
    name: 'profileMyPoems',
    type: 'private',
    role: 'author',
  },
  PROFILE_ADD_POEM: {
    path: '/profile/add-poem',
    name: 'profileAddPoem',
    type: 'private',
    role: 'author',
  },
  PROFILE_EDIT_POEM: {
    path: '/profile/edit-poem/[slug]',
    name: 'profileEditPoem',
    type: 'private',
    role: 'author',
  },

  // Category and tag routes
  CATEGORY: {
    path: '/poems/category/[slug]',
    name: 'category',
    type: 'public',
    role: 'all',
  },
  TAG: {
    path: '/tags/[slug]',
    name: 'tag',
    type: 'public',
    role: 'all',
  },

  // Search route
  SEARCH: {
    path: '/search',
    name: 'search',
    type: 'public',
    role: 'all',
  },

  // Dashboard routes
  DASHBOARD: {
    path: '/dashboard',
    name: 'dashboard',
    type: 'private',
    role: 'admin',
  },
  ADMIN_CATEGORIES: {
    path: '/dashboard/content/categories',
    name: 'adminCategories',
    type: 'private',
    role: 'moderator',
  },
  ADMIN_USERS: {
    path: '/admin/users',
    name: 'adminUsers',
    type: 'private',
    role: 'admin',
  },
  POEMS: {
    path: '/poems',
    name: 'Стихотворения',
    type: 'public',
    role: 'all',
  },
  CLAIM_REPORTS: {
    path: '/dashboard/claim-reports',
    name: 'Жалобы',
    type: 'private',
    role: 'moderator',
  },
} as const;
