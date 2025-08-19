import type { TranslationValues } from '../model/types';

// Default categories for the platform
export const DEFAULT_CATEGORIES: Array<{
  translations: TranslationValues;
  order: number;
}> = [
  {
    translations: {
      EN: 'Spiritual Poetry',
      RU: 'Духовная поэзия',
      UA: 'Духовна поезія',
    },
    order: 1,
  },
  {
    translations: {
      EN: 'Biblical Poetry',
      RU: 'Библейская поэзия',
      UA: 'Біблійна поезія',
    },
    order: 2,
  },
  {
    translations: {
      EN: 'Prayer Poetry',
      RU: 'Молитвенная поэзия',
      UA: 'Молитовна поезія',
    },
    order: 3,
  },
  {
    translations: {
      EN: 'Worship Poetry',
      RU: 'Хвалебная поэзия',
      UA: 'Хвальна поезія',
    },
    order: 4,
  },
  {
    translations: {
      EN: 'Reflection Poetry',
      RU: 'Размышления',
      UA: 'Роздуми',
    },
    order: 5,
  },
  {
    translations: {
      EN: 'Testimony Poetry',
      RU: 'Свидетельства',
      UA: 'Свідчення',
    },
    order: 6,
  },
];

// Category status constants
export const CATEGORY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export type CategoryStatus = (typeof CATEGORY_STATUS)[keyof typeof CATEGORY_STATUS];

// Category validation constants
export const CATEGORY_VALIDATION = {
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MIN_ORDER: 0,
  MAX_ORDER: 1000,
} as const;

// Category error messages
export const CATEGORY_ERRORS = {
  NAME_REQUIRED: 'Category name is required',
  NAME_TOO_SHORT: `Category name must be at least ${CATEGORY_VALIDATION.MIN_NAME_LENGTH} characters`,
  NAME_TOO_LONG: `Category name must be no more than ${CATEGORY_VALIDATION.MAX_NAME_LENGTH} characters`,
  NAME_ALREADY_EXISTS: 'Category with this name already exists',
  ORDER_INVALID: `Order must be between ${CATEGORY_VALIDATION.MIN_ORDER} and ${CATEGORY_VALIDATION.MAX_ORDER}`,
  TRANSLATIONS_REQUIRED: 'Translations are required for all languages',
  CATEGORY_NOT_FOUND: 'Category not found',
  CATEGORY_IN_USE: 'Cannot delete category that has poems',
} as const;

// Category success messages
export const CATEGORY_SUCCESS = {
  CREATED: 'Category created successfully',
  UPDATED: 'Category updated successfully',
  DELETED: 'Category deleted successfully',
  ACTIVATED: 'Category activated successfully',
  DEACTIVATED: 'Category deactivated successfully',
  ORDER_UPDATED: 'Category order updated successfully',
} as const;
