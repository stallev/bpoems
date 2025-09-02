/**
 * UI Constants for shared components
 * Centralized string literals for UI text to improve maintainability and prepare for i18n
 */

export const RICH_TEXT_EDITOR_LABELS = {
  PLACEHOLDER: 'Начните писать...',
  TOOLBAR: {
    HEADING_1: 'Заголовок 1',
    HEADING_2: 'Заголовок 2',
    HEADING_3: 'Заголовок 3',
    BOLD: 'Жирный',
    ITALIC: 'Курсив',
    UNDERLINE: 'Подчеркнутый',
    STRIKETHROUGH: 'Зачеркнутый',
    BULLET_LIST: 'Маркированный список',
    ORDERED_LIST: 'Нумерованный список',
  },
} as const;

export const AUTHOR_INFO_LABELS = {
  AUTHOR_BY: 'Автор:',
  PUBLISHED_ON: 'Опубликовано:',
  NO_BIO: 'Биография не указана',
} as const;

export const POEM_CONTENT_LABELS = {
  NO_CONTENT: 'Содержимое не найдено',
} as const;

export const COMMENT_SECTION_LABELS = {
  NO_COMMENTS_MESSAGE: 'Комментарии отсутствуют',
  ADD_COMMENT: 'Добавить комментарий',
  COMMENT_PLACEHOLDER: 'Напишите ваш комментарий...',
  SUBMIT_COMMENT: 'Отправить',
  CANCEL_COMMENT: 'Отмена',
  EDIT_COMMENT: 'Изменить',
} as const;

export const REVIEW_SECTION_LABELS = {
  NO_REVIEWS_MESSAGE: 'Отзывы отсутствуют',
  ADD_REVIEW: 'Добавить отзыв',
  REVIEW_TITLE_PLACEHOLDER: 'Заголовок отзыва...',
  REVIEW_CONTENT_PLACEHOLDER: 'Напишите ваш отзыв...',
  RATING_LABEL: 'Оценка:',
  SUBMIT_REVIEW: 'Отправить',
  CANCEL_REVIEW: 'Отмена',
  EDIT_REVIEW: 'Изменить',
} as const;

export const POEMS_HEADER_LABELS = {
  SHARE: 'Поделиться',
  EDIT: 'Редактировать',
  DELETE: 'Удалить',
  SHARE_TITLE: 'Поделиться стихотворением',
  SHARE_DESCRIPTION: 'Выберите платформу для публикации:',
  SHARE_COPIED: 'Ссылка скопирована!',
  DELETE_CONFIRMATION: 'Вы уверены, что хотите удалить это стихотворение?',
  DELETE_SUCCESS: 'Стихотворение успешно удалено',
  DELETE_ERROR: 'Ошибка при удалении стихотворения',
} as const;

export const POST_CLAIM_LABELS = {
  CLAIM: 'Пожаловаться',
  CLAIM_TITLE: 'Отправить жалобу',
  CLAIM_DESCRIPTION: 'Опишите причину жалобы:',
  CLAIM_PLACEHOLDER: 'Введите текст жалобы...',
  SUBMIT_CLAIM: 'Отправить',
  CANCEL_CLAIM: 'Отмена',
  CLAIM_SUCCESS: 'Жалоба отправлена',
  CLAIM_ERROR: 'Ошибка при отправке жалобы',
} as const;
