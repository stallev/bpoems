/**
 * Error Messages Constants
 *
 * Centralized error messages for the application to ensure consistency
 * and maintainability. All error messages should be imported from this file.
 */

export const ErrorMessages = {
  // Authentication errors
  ACCESS_DENIED: 'Доступ запрещен. Необходима авторизация.',
  INSUFFICIENT_PERMISSIONS: 'Недостаточно прав для выполнения операции.',
  MODERATOR_REQUIRED: 'Требуются права модератора или администратора.',
  AUTHOR_NOT_FOUND: 'Автор не найден.',
  PAGE_LOAD_FAILED: 'Ошибка загрузки страницы.',

  // Poem-related errors
  GET_CATEGORIES_FAILED: 'Ошибка получения категорий для стихотворения',
  CREATE_POEM_FAILED: 'Ошибка создания стихотворения',
  UPDATE_POEM_FAILED: 'Ошибка обновления стихотворения',
  POEM_NOT_FOUND: 'Стихотворение не найдено.',
  OWNERSHIP_REQUIRED: 'Вы можете редактировать только свои стихотворения.',
  VALIDATION_ERROR: 'Ошибка валидации данных.',
  CONTENT_REQUIRED: 'Содержимое стихотворения обязательно.',
  TITLE_REQUIRED: 'Заголовок стихотворения обязателен.',
  CATEGORY_REQUIRED: 'Категория обязательна.',

  // Category-related errors
  CATEGORY_NOT_FOUND: 'Категория не найдена.',
  CATEGORY_CREATE_FAILED: 'Ошибка создания категории.',
  CATEGORY_UPDATE_FAILED: 'Ошибка обновления категории.',
  CATEGORY_DELETE_FAILED: 'Ошибка удаления категории.',

  // User-related errors
  USER_NOT_FOUND: 'Пользователь не найден.',
  USER_UPDATE_FAILED: 'Ошибка обновления профиля пользователя.',

  // General errors
  UNKNOWN_ERROR: 'Произошла неизвестная ошибка.',
  NETWORK_ERROR: 'Ошибка сети. Проверьте подключение к интернету.',
  SERVER_ERROR: 'Ошибка сервера. Попробуйте позже.',

  // Form validation errors
  REQUIRED_FIELD: 'Это поле обязательно для заполнения.',
  INVALID_EMAIL: 'Введите корректный email адрес.',
  PASSWORD_TOO_SHORT: 'Пароль должен содержать минимум 8 символов.',
  PASSWORDS_DONT_MATCH: 'Пароли не совпадают.',

  // File upload errors
  FILE_TOO_LARGE: 'Файл слишком большой.',
  INVALID_FILE_TYPE: 'Неподдерживаемый тип файла.',
  UPLOAD_FAILED: 'Ошибка загрузки файла.',

  // Moderation error messages
  INVALID_REJECTION_REASON: 'Неверная причина отклонения жалобы.',
  REJECTION_REASON_REQUIRED: 'Причина отклонения обязательна при отклонении жалобы.',
  UNAUTHORIZED: 'Неавторизованный доступ.',
  CLAIM_NOT_FOUND: 'Жалоба не найдена.',
  HANDLE_CLAIM_REPORT_FAILED: 'Ошибка обработки жалобы.',
  LOG_MODERATION_ACTIVITY_FAILED: 'Ошибка логирования действия модерации.',
} as const;

export type ErrorMessageKey = keyof typeof ErrorMessages;
