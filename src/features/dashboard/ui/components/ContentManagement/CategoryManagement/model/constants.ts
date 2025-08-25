export const CATEGORY_FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export const CATEGORY_ACTIONS = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  TOGGLE_STATUS: 'toggle_status',
} as const;

export const CATEGORY_MESSAGES = {
  DELETE_CONFIRMATION: 'Вы уверены, что хотите удалить эту категорию?',
  DELETE_SUCCESS: 'Категория успешно удалена',
  UPDATE_SUCCESS: 'Категория успешно обновлена',
  CREATE_SUCCESS: 'Категория успешно создана',
} as const;

export const CATEGORY_LABELS = {
  ORDER: 'Порядок',
  ACTIVE: 'Активна',
  NAME_EN: 'Название (EN)',
  NAME_RU: 'Название (RU)',
  NAME_UA: 'Название (UA)',
  PLACEHOLDER_EN: 'English name',
  PLACEHOLDER_RU: 'Русское название',
  PLACEHOLDER_UA: 'Українська назва',
  PLACEHOLDER_ORDER: '0',
} as const;
