// Form labels and messages in Russian (MVP) with infrastructure for EN support
export const POEM_FORM_LABELS = {
  RU: {
    TITLE: 'Заголовок стихотворения',
    TITLE_PLACEHOLDER: 'Введите заголовок стихотворения',
    CATEGORY: 'Категория',
    CATEGORY_PLACEHOLDER: 'Выберите категорию',
    CONTENT: 'Содержимое стихотворения',
    CONTENT_PLACEHOLDER: 'Начните писать ваше стихотворение...',
    SUBMIT: 'Сохранить стихотворение',
    SUBMIT_CREATING: 'Создание...',
    SUBMIT_UPDATING: 'Обновление...',
    CANCEL: 'Отмена',
    CREATE_TITLE: 'Создать новое стихотворение',
    EDIT_TITLE: 'Редактировать стихотворение',
  },
  EN: {
    TITLE: 'Poem Title',
    TITLE_PLACEHOLDER: 'Enter poem title',
    CATEGORY: 'Category',
    CATEGORY_PLACEHOLDER: 'Select category',
    CONTENT: 'Poem Content',
    CONTENT_PLACEHOLDER: 'Start writing your poem...',
    SUBMIT: 'Save Poem',
    SUBMIT_CREATING: 'Creating...',
    SUBMIT_UPDATING: 'Updating...',
    CANCEL: 'Cancel',
    CREATE_TITLE: 'Create New Poem',
    EDIT_TITLE: 'Edit Poem',
  },
} as const;

// Error messages
export const POEM_ERRORS = {
  ACCESS_DENIED: 'Доступ запрещен. Необходима авторизация.',
  INSUFFICIENT_PERMISSIONS: 'Недостаточно прав для создания стихотворений.',
  OWNERSHIP_REQUIRED: 'Вы можете редактировать только свои стихотворения.',
  POEM_NOT_FOUND: 'Стихотворение не найдено.',
  VALIDATION_ERROR: 'Ошибка валидации данных.',
  CONTENT_REQUIRED: 'Содержимое стихотворения обязательно.',
  TITLE_REQUIRED: 'Заголовок стихотворения обязателен.',
  CATEGORY_REQUIRED: 'Категория обязательна.',
  UNKNOWN_ERROR: 'Произошла неизвестная ошибка.',
} as const;

// Success messages
export const POEM_SUCCESS = {
  CREATED_APPROVED: 'Стихотворение успешно создано и опубликовано.',
  CREATED_PENDING: 'Стихотворение успешно создано и отправлено на модерацию.',
  UPDATED_APPROVED: 'Стихотворение успешно обновлено и опубликовано.',
  UPDATED_PENDING: 'Стихотворение успешно обновлено и отправлено на модерацию.',
} as const;

// Quill editor configuration
export const QUILL_MODULES = {
  toolbar: [['bold', 'italic', 'underline']],
} as const;

export const QUILL_FORMATS = ['bold', 'italic', 'underline'] as const;
