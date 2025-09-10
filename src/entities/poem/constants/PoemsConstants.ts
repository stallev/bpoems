export const PoemsCategories = [
  {
    id: 1,
    name: 'Хвала и благодарение',
  },
  {
    id: 2,
    name: 'Следование за Христом',
  },
  {
    id: 3,
    name: 'Пасхальные',
  },
  {
    id: 4,
    name: 'Для детей',
  },
  {
    id: 5,
    name: 'О вере',
  },
];

export const POEMS_UI_CONSTANTS = {
  SHARE_DIALOG_TITLE: 'Поделиться стихотворением',
  SHARE_DIALOG_DESCRIPTION: 'Выберите платформу для публикации ссылки на стихотворение',
  DELETE_DIALOG_TITLE: 'Удалить стихотворение',
  DELETE_DIALOG_DESCRIPTION:
    'Вы уверены, что хотите удалить это стихотворение? Это действие нельзя отменить.',
  CANCEL_BUTTON: 'Отмена',
  DELETE_BUTTON: 'Удалить',
  SHARE_TEXT: 'Читайте стихотворение на нашей платформе',
  BUTTON_TITLES: {
    SHARE: 'Поделиться',
    EDIT: 'Редактировать',
    DELETE: 'Удалить',
  },
  PLATFORMS: {
    FACEBOOK: 'Facebook',
    VKONTAKTE: 'VKontakte',
    WHATSAPP: 'WhatsApp',
    TELEGRAM: 'Telegram',
  },
} as const;
