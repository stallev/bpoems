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
  // Валидация
  NAME_TOO_SHORT: 'Название категории должно содержать минимум 2 символа',
  NAME_TOO_LONG: 'Название категории не должно превышать 50 символов',
  NAME_REQUIRED: 'Название категории обязательно для заполнения',
  ORDER_INVALID: 'Порядковый номер должен быть от 0 до 1000',
  ORDER_REQUIRED: 'Порядковый номер обязателен для заполнения',

  // Уникальность
  NAME_EXISTS: 'Категория с таким названием уже существует',
  NAME_EXISTS_EN: 'Category with this name already exists',
  NAME_EXISTS_RU: 'Категория с таким названием уже существует',
  NAME_EXISTS_UA: 'Категорія з такою назвою вже існує',

  // Операции
  NOT_FOUND: 'Категория не найдена',
  CREATE_FAILED: 'Ошибка при создании категории',
  UPDATE_FAILED: 'Ошибка при обновлении категории',
  DELETE_FAILED: 'Ошибка при удалении категории',
  ACTIVATE_FAILED: 'Ошибка при активации категории',
  DEACTIVATE_FAILED: 'Ошибка при деактивации категории',
  ORDER_UPDATE_FAILED: 'Ошибка при обновлении порядка',

  // Права доступа
  ACCESS_DENIED: 'Недостаточно прав для выполнения операции',
  MODERATOR_REQUIRED: 'Требуются права модератора или администратора',

  // Системные ошибки
  DATABASE_ERROR: 'Ошибка базы данных',
  VALIDATION_ERROR: 'Ошибка валидации данных',
  UNKNOWN_ERROR: 'Неизвестная ошибка',
} as const;

// Category success messages
export const CATEGORY_SUCCESS = {
  CREATED: 'Категория успешно создана',
  UPDATED: 'Категория успешно обновлена',
  DELETED: 'Категория успешно удалена',
  ACTIVATED: 'Категория успешно активирована',
  DEACTIVATED: 'Категория успешно деактивирована',
  ORDER_UPDATED: 'Порядок категорий успешно обновлен',
  BULK_OPERATION_COMPLETED: 'Массовая операция выполнена успешно',
} as const;
