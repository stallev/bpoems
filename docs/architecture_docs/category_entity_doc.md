# Category Entity Documentation

## Overview

Entity `category` предназначен для управления категориями стихов с поддержкой многоязычности. Каждая категория имеет переводы на три языка (EN, RU, UA) и может быть активной или неактивной.

## Структура Entity

```
src/entities/category/
├── api/
│   ├── categoryRepository.ts    # Репозиторий для работы с БД
│   └── index.ts                 # Публичный API
├── constants/
│   ├── CategoryConstants.ts     # Константы и валидация
│   └── index.ts                 # Публичный API
├── model/
│   ├── types.ts                 # Типы TypeScript
│   └── index.ts                 # Публичный API
└── index.ts                     # Главный публичный API
```

## Основные типы

### TranslationValues
```typescript
interface TranslationValues {
  EN: string;
  RU: string;
  UA: string;
}
```

### CategoryWithTranslation
```typescript
interface CategoryWithTranslation {
  id: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  name: TranslationValues;
  poemCount?: number;
}
```

### CreateCategoryData
```typescript
interface CreateCategoryData {
  isActive?: boolean;
  order?: number;
  translations: TranslationValues;
}
```

## Репозиторий (categoryRepository)

### Основные методы

#### `findById(id: string)`
Находит категорию по ID с включенными связями.

#### `findAll(params?)`
Находит все категории с опциональной фильтрацией и пагинацией.

#### `findActive(params?)`
Находит только активные категории, отсортированные по полю `order`.

#### `create(data: CreateCategoryData)`
Создает новую категорию с переводами.

#### `update(id: string, data: UpdateCategoryData)`
Обновляет категорию с опциональным обновлением переводов.

#### `delete(id: string)`
Удаляет категорию (каскадное удаление связанного TranslatedItem).

#### `deactivate(id: string)`
Деактивирует категорию (мягкое удаление).

#### `activate(id: string)`
Активирует категорию.

#### `updateOrder(id: string, order: number)`
Обновляет порядок категории.

#### `findForDashboard(params?)`
Получает категории с данными переводов для dashboard.

#### `findByTranslationName(name: string, locale?)`
Находит категорию по названию на определенном языке.

#### `existsByName(name: string, locale?, excludeId?)`
Проверяет существование категории с таким названием.

#### `getNextOrder()`
Получает следующий порядковый номер для новой категории.

## Константы

### DEFAULT_CATEGORIES
Предустановленные категории для платформы:
- Spiritual Poetry / Духовная поэзия / Духовна поезія
- Biblical Poetry / Библейская поэзия / Біблійна поезія
- Prayer Poetry / Молитвенная поэзия / Молитовна поезія
- Worship Poetry / Хвалебная поэзия / Хвальна поезія
- Reflection Poetry / Размышления / Роздуми
- Testimony Poetry / Свидетельства / Свідчення

### CATEGORY_VALIDATION
Константы валидации:
- MIN_NAME_LENGTH: 2
- MAX_NAME_LENGTH: 50
- MIN_ORDER: 0
- MAX_ORDER: 1000

### CATEGORY_ERRORS
Сообщения об ошибках для валидации.

### CATEGORY_SUCCESS
Сообщения об успешных операциях.

## Использование

### Создание категории
```typescript
import { categoryRepository } from '@/entities/category';

const newCategory = await categoryRepository.create({
  translations: {
    EN: 'New Category',
    RU: 'Новая категория',
    UA: 'Нова категорія',
  },
  isActive: true,
  order: 1,
});
```

### Получение активных категорий
```typescript
const activeCategories = await categoryRepository.findActive();
```

### Обновление категории
```typescript
await categoryRepository.update(categoryId, {
  translations: {
    EN: 'Updated Category',
    RU: 'Обновленная категория',
    UA: 'Оновлена категорія',
  },
  isActive: false,
});
```

### Получение категорий для dashboard
```typescript
const dashboardCategories = await categoryRepository.findForDashboard({
  includeInactive: true,
});
```

## Связи с другими Entity

### Связь с Poem
- Категория может содержать множество стихов
- Стих может принадлежать одной категории (опционально)

### Связь с TranslatedItem
- Каждая категория имеет связанный TranslatedItem для хранения переводов
- Каскадное удаление при удалении категории

## Особенности реализации

### Многоязычность
- Все названия категорий хранятся в JSON формате в TranslatedItem
- Поддержка трех языков: EN, RU, UA
- Fallback на английский при отсутствии перевода

### Порядок сортировки
- Категории имеют поле `order` для управления порядком отображения
- Автоматическое назначение следующего номера при создании

### Мягкое удаление
- Категории не удаляются физически, а деактивируются
- Метод `deactivate()` для деактивации
- Метод `activate()` для повторной активации

### Валидация
- Проверка уникальности названий
- Валидация длины названий
- Проверка корректности порядковых номеров

## Интеграция с Dashboard

Entity `category` предоставляет специальные методы для интеграции с dashboard:

- `findForDashboard()` - оптимизированный запрос для отображения в админке
- `findWithStats()` - категории со статистикой использования
- `existsByName()` - проверка уникальности для форм создания/редактирования

## Безопасность

- Все операции с категориями должны проверять права доступа (роль MODERATOR или выше)
- Валидация входных данных на уровне репозитория
- Защита от SQL-инъекций через Prisma ORM
