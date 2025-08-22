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

### UpdateCategoryData
```typescript
interface UpdateCategoryData {
  isActive?: boolean;
  order?: number;
  translations?: TranslationValues;
}
```

### CategoryFilters
```typescript
interface CategoryFilters {
  isActive?: boolean;
  search?: string;
  orderBy?: 'name' | 'order' | 'createdAt' | 'updatedAt';
  orderDirection?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}
```

### CategoryStats
```typescript
interface CategoryStats {
  totalCategories: number;
  activeCategories: number;
  inactiveCategories: number;
  categoriesWithPoems: number;
  averagePoemsPerCategory: number;
}
```

## Репозиторий (categoryRepository)

### Основные методы

#### `findById(id: string)`
Находит категорию по ID с включенными связями.

#### `findAll(params?: CategoryFilters)`
Находит все категории с опциональной фильтрацией и пагинацией.

#### `findActive(params?: CategoryFilters)`
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

#### `findForDashboard(params?: CategoryFilters)`
Получает категории с данными переводов для dashboard.

**Параметры:**
```typescript
interface DashboardFilters {
  skip?: number;
  take?: number;
  filter?: 'all' | 'active' | 'inactive';
}
```

**Примеры использования:**
```typescript
// Получить все категории (активные и неактивные)
const allCategories = await categoryRepository.findForDashboard({ filter: 'all' });

// Получить только активные категории
const activeCategories = await categoryRepository.findForDashboard({ filter: 'active' });

// Получить только неактивные категории
const inactiveCategories = await categoryRepository.findForDashboard({ filter: 'inactive' });

// С пагинацией
const paginatedCategories = await categoryRepository.findForDashboard({
  filter: 'all',
  skip: 0,
  take: 10
});
```

#### `findByTranslationName(name: string, locale?: string)`
Находит категорию по названию на определенном языке.

#### `existsByName(name: string, locale?: string, excludeId?: string)`
Проверяет существование категории с таким названием.

#### `getNextOrder()`
Получает следующий порядковый номер для новой категории.

#### `getStats()`
Получает статистику по категориям.

#### `bulkUpdateOrder(updates: Array<{id: string, order: number}>)`
Массовое обновление порядка категорий.

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
```typescript
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
```

### CATEGORY_SUCCESS
```typescript
export const CATEGORY_SUCCESS = {
  CREATED: 'Категория успешно создана',
  UPDATED: 'Категория успешно обновлена',
  DELETED: 'Категория успешно удалена',
  ACTIVATED: 'Категория успешно активирована',
  DEACTIVATED: 'Категория успешно деактивирована',
  ORDER_UPDATED: 'Порядок категорий успешно обновлен',
  BULK_OPERATION_COMPLETED: 'Массовая операция выполнена успешно',
} as const;
```

### CATEGORY_STATUS
```typescript
export const CATEGORY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;
```

## Dashboard Integration

### Страница управления категориями

#### Структура страницы
```
src/app/dashboard/content/categories/
├── page.tsx                    # Список категорий
├── [id]/
│   └── page.tsx               # Редактирование категории
└── new/
    └── page.tsx               # Создание новой категории
```

#### Компоненты для Dashboard

##### CategoryList Component
```typescript
// src/features/dashboard/ui/components/ContentManagement/CategoryList.tsx
interface CategoryListProps {
  categories: CategoryWithTranslation[];
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
  onReorder: (updates: Array<{id: string, order: number}>) => void;
}
```

##### CategoryForm Component
```typescript
// src/features/dashboard/ui/components/ContentManagement/CategoryForm.tsx
interface CategoryFormProps {
  category?: CategoryWithTranslation;
  onSubmit: (data: CreateCategoryData | UpdateCategoryData) => void;
  onCancel: () => void;
  isLoading: boolean;
}
```

##### CategoryFilters Component
```typescript
// src/features/dashboard/ui/components/ContentManagement/CategoryFilters.tsx
interface CategoryFiltersProps {
  filters: CategoryFilters;
  onFiltersChange: (filters: CategoryFilters) => void;
  onReset: () => void;
}
```

##### CategoryStats Component
```typescript
// src/features/dashboard/ui/components/ContentManagement/CategoryStats.tsx
interface CategoryStatsProps {
  stats: CategoryStats;
  isLoading: boolean;
}
```

### Формы и валидация

#### Схема валидации (Zod)
```typescript
import { z } from 'zod';

export const categoryFormSchema = z.object({
  translations: z.object({
    EN: z.string()
      .min(2, 'Название должно содержать минимум 2 символа')
      .max(50, 'Название не должно превышать 50 символов'),
    RU: z.string()
      .min(2, 'Название должно содержать минимум 2 символа')
      .max(50, 'Название не должно превышать 50 символов'),
    UA: z.string()
      .min(2, 'Название должно содержать минимум 2 символа')
      .max(50, 'Название не должно превышать 50 символов'),
  }),
  isActive: z.boolean().default(true),
  order: z.number()
    .min(0, 'Порядковый номер должен быть от 0 до 1000')
    .max(1000, 'Порядковый номер должен быть от 0 до 1000')
    .optional(),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;
```

#### React Hook Form интеграция
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const form = useForm<CategoryFormData>({
  resolver: zodResolver(categoryFormSchema),
  defaultValues: {
    translations: {
      EN: '',
      RU: '',
      UA: '',
    },
    isActive: true,
  },
});
```

### Server Actions для работы с категориями

#### Структура Server Actions
```
src/features/dashboard/server-actions/
├── categories/
│   ├── createCategory.ts
│   ├── updateCategory.ts
│   ├── deleteCategory.ts
│   ├── toggleCategoryStatus.ts
│   ├── updateCategoryOrder.ts
│   ├── bulkUpdateCategoryOrder.ts
│   ├── getCategories.ts
│   ├── getCategory.ts
│   ├── getCategoryStats.ts
│   └── index.ts
└── index.ts
```

#### Server Action: Создание категории
```typescript
// src/features/dashboard/server-actions/categories/createCategory.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/shared/api/auth/auth';
import { categoryRepository } from '@/entities/category';
import { categoryFormSchema } from '@/features/dashboard/model/schemas';
import { CATEGORY_ERRORS, CATEGORY_SUCCESS } from '@/entities/category/constants';
import type { CreateCategoryData } from '@/entities/category/model/types';

export async function createCategory(formData: FormData) {
  try {
    // Проверка авторизации и прав доступа
    const session = await auth();
    if (!session?.user) {
      throw new Error(CATEGORY_ERRORS.ACCESS_DENIED);
    }

    if (!['ADMIN', 'MODERATOR'].includes(session.user.role)) {
      throw new Error(CATEGORY_ERRORS.MODERATOR_REQUIRED);
    }

    // Парсинг и валидация данных
    const rawData = {
      translations: {
        EN: formData.get('translations.EN') as string,
        RU: formData.get('translations.RU') as string,
        UA: formData.get('translations.UA') as string,
      },
      isActive: formData.get('isActive') === 'true',
      order: formData.get('order') ? Number(formData.get('order')) : undefined,
    };

    const validatedData = categoryFormSchema.parse(rawData);

    // Проверка уникальности названия
    const exists = await categoryRepository.existsByName(
      validatedData.translations.EN,
      'EN'
    );
    if (exists) {
      throw new Error(CATEGORY_ERRORS.NAME_EXISTS_EN);
    }

    // Создание категории
    const category = await categoryRepository.create(validatedData);

    // Ревалидация кэша
    revalidatePath('/dashboard/content/categories');
    revalidatePath('/dashboard');

    return {
      success: true,
      message: CATEGORY_SUCCESS.CREATED,
      data: category,
    };
  } catch (error) {
    console.error('Error creating category:', error);
    
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: CATEGORY_ERRORS.UNKNOWN_ERROR,
    };
  }
}
```

#### Server Action: Обновление категории
```typescript
// src/features/dashboard/server-actions/categories/updateCategory.ts
'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/shared/api/auth/auth';
import { categoryRepository } from '@/entities/category';
import { categoryFormSchema } from '@/features/dashboard/model/schemas';
import { CATEGORY_ERRORS, CATEGORY_SUCCESS } from '@/entities/category/constants';
import type { UpdateCategoryData } from '@/entities/category/model/types';

export async function updateCategory(id: string, formData: FormData) {
  try {
    // Проверка авторизации и прав доступа
    const session = await auth();
    if (!session?.user) {
      throw new Error(CATEGORY_ERRORS.ACCESS_DENIED);
    }

    if (!['ADMIN', 'MODERATOR'].includes(session.user.role)) {
      throw new Error(CATEGORY_ERRORS.MODERATOR_REQUIRED);
    }

    // Проверка существования категории
    const existingCategory = await categoryRepository.findById(id);
    if (!existingCategory) {
      throw new Error(CATEGORY_ERRORS.NOT_FOUND);
    }

    // Парсинг и валидация данных
    const rawData = {
      translations: {
        EN: formData.get('translations.EN') as string,
        RU: formData.get('translations.RU') as string,
        UA: formData.get('translations.UA') as string,
      },
      isActive: formData.get('isActive') === 'true',
      order: formData.get('order') ? Number(formData.get('order')) : undefined,
    };

    const validatedData = categoryFormSchema.parse(rawData);

    // Проверка уникальности названия (исключая текущую категорию)
    const exists = await categoryRepository.existsByName(
      validatedData.translations.EN,
      'EN',
      id
    );
    if (exists) {
      throw new Error(CATEGORY_ERRORS.NAME_EXISTS_EN);
    }

    // Обновление категории
    const category = await categoryRepository.update(id, validatedData);

    // Ревалидация кэша
    revalidatePath('/dashboard/content/categories');
    revalidatePath(`/dashboard/content/categories/${id}`);
    revalidatePath('/dashboard');

    return {
      success: true,
      message: CATEGORY_SUCCESS.UPDATED,
      data: category,
    };
  } catch (error) {
    console.error('Error updating category:', error);
    
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: CATEGORY_ERRORS.UNKNOWN_ERROR,
    };
  }
}
```

#### Server Action: Удаление категории
```typescript
// src/features/dashboard/server-actions/categories/deleteCategory.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/shared/api/auth/auth';
import { categoryRepository } from '@/entities/category';
import { CATEGORY_ERRORS, CATEGORY_SUCCESS } from '@/entities/category/constants';

export async function deleteCategory(id: string) {
  try {
    // Проверка авторизации и прав доступа
    const session = await auth();
    if (!session?.user) {
      throw new Error(CATEGORY_ERRORS.ACCESS_DENIED);
    }

    if (session.user.role !== 'ADMIN') {
      throw new Error(CATEGORY_ERRORS.ACCESS_DENIED);
    }

    // Проверка существования категории
    const existingCategory = await categoryRepository.findById(id);
    if (!existingCategory) {
      throw new Error(CATEGORY_ERRORS.NOT_FOUND);
    }

    // Удаление категории
    await categoryRepository.delete(id);

    // Ревалидация кэша
    revalidatePath('/dashboard/content/categories');
    revalidatePath('/dashboard');

    return {
      success: true,
      message: CATEGORY_SUCCESS.DELETED,
    };
  } catch (error) {
    console.error('Error deleting category:', error);
    
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: CATEGORY_ERRORS.UNKNOWN_ERROR,
    };
  }
}
```

#### Server Action: Изменение статуса категории
```typescript
// src/features/dashboard/server-actions/categories/toggleCategoryStatus.ts
'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/shared/api/auth/auth';
import { categoryRepository } from '@/entities/category';
import { CATEGORY_ERRORS, CATEGORY_SUCCESS } from '@/entities/category/constants';

export async function toggleCategoryStatus(id: string, isActive: boolean) {
  try {
    // Проверка авторизации и прав доступа
    const session = await auth();
    if (!session?.user) {
      throw new Error(CATEGORY_ERRORS.ACCESS_DENIED);
    }

    if (!['ADMIN', 'MODERATOR'].includes(session.user.role)) {
      throw new Error(CATEGORY_ERRORS.MODERATOR_REQUIRED);
    }

    // Проверка существования категории
    const existingCategory = await categoryRepository.findById(id);
    if (!existingCategory) {
      throw new Error(CATEGORY_ERRORS.NOT_FOUND);
    }

    // Изменение статуса
    if (isActive) {
      await categoryRepository.activate(id);
    } else {
      await categoryRepository.deactivate(id);
    }

    // Ревалидация кэша
    revalidatePath('/dashboard/content/categories');
    revalidatePath('/dashboard');

    return {
      success: true,
      message: isActive ? CATEGORY_SUCCESS.ACTIVATED : CATEGORY_SUCCESS.DEACTIVATED,
    };
  } catch (error) {
    console.error('Error toggling category status:', error);
    
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: CATEGORY_ERRORS.UNKNOWN_ERROR,
    };
  }
}
```

#### Server Action: Получение списка категорий
```typescript
// src/features/dashboard/server-actions/categories/getCategories.ts
'use server';

import { auth } from '@/shared/api/auth/auth';
import { categoryRepository } from '@/entities/category';
import { CATEGORY_ERRORS } from '@/entities/category/constants';
import type { CategoryFilters } from '@/entities/category/model/types';

export async function getCategories(filters?: CategoryFilters) {
  try {
    // Проверка авторизации и прав доступа
    const session = await auth();
    if (!session?.user) {
      throw new Error(CATEGORY_ERRORS.ACCESS_DENIED);
    }

    if (!['ADMIN', 'MODERATOR'].includes(session.user.role)) {
      throw new Error(CATEGORY_ERRORS.MODERATOR_REQUIRED);
    }

    // Получение категорий
    const categories = await categoryRepository.findForDashboard(filters);
    const stats = await categoryRepository.getStats();

    return {
      success: true,
      data: {
        categories,
        stats,
      },
    };
  } catch (error) {
    console.error('Error getting categories:', error);
    
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: CATEGORY_ERRORS.UNKNOWN_ERROR,
    };
  }
}
```

#### Server Action: Массовое обновление порядка
```typescript
// src/features/dashboard/server-actions/categories/bulkUpdateCategoryOrder.ts
'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/shared/api/auth/auth';
import { categoryRepository } from '@/entities/category';
import { CATEGORY_ERRORS, CATEGORY_SUCCESS } from '@/entities/category/constants';

interface OrderUpdate {
  id: string;
  order: number;
}

export async function bulkUpdateCategoryOrder(updates: OrderUpdate[]) {
  try {
    // Проверка авторизации и прав доступа
    const session = await auth();
    if (!session?.user) {
      throw new Error(CATEGORY_ERRORS.ACCESS_DENIED);
    }

    if (!['ADMIN', 'MODERATOR'].includes(session.user.role)) {
      throw new Error(CATEGORY_ERRORS.MODERATOR_REQUIRED);
    }

    // Валидация данных
    if (!Array.isArray(updates) || updates.length === 0) {
      throw new Error('Invalid updates data');
    }

    // Массовое обновление порядка
    await categoryRepository.bulkUpdateOrder(updates);

    // Ревалидация кэша
    revalidatePath('/dashboard/content/categories');
    revalidatePath('/dashboard');

    return {
      success: true,
      message: CATEGORY_SUCCESS.ORDER_UPDATED,
    };
  } catch (error) {
    console.error('Error updating category order:', error);
    
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: CATEGORY_ERRORS.UNKNOWN_ERROR,
    };
  }
}
```

#### Экспорт Server Actions
```typescript
// src/features/dashboard/server-actions/categories/index.ts
export { createCategory } from './createCategory';
export { updateCategory } from './updateCategory';
export { deleteCategory } from './deleteCategory';
export { toggleCategoryStatus } from './toggleCategoryStatus';
export { updateCategoryOrder } from './updateCategoryOrder';
export { bulkUpdateCategoryOrder } from './bulkUpdateCategoryOrder';
export { getCategories } from './getCategories';
export { getCategory } from './getCategory';
export { getCategoryStats } from './getCategoryStats';
```

### Интеграция Server Actions с компонентами

#### Использование в форме создания/редактирования
```typescript
// src/features/dashboard/ui/components/ContentManagement/CategoryForm.tsx
'use client';

import { useFormState } from 'react-dom';
import { useFormStatus } from 'react-dom';
import { createCategory, updateCategory } from '../../server-actions/categories';

interface CategoryFormProps {
  category?: CategoryWithTranslation;
  mode: 'create' | 'edit';
}

export function CategoryForm({ category, mode }: CategoryFormProps) {
  const [state, formAction] = useFormState(
    mode === 'create' ? createCategory : (prevState, formData) => 
      updateCategory(category!.id, formData),
    { success: false, message: '' }
  );

  return (
    <form action={formAction}>
      {/* Поля формы */}
      <input name="translations.EN" defaultValue={category?.name.EN} />
      <input name="translations.RU" defaultValue={category?.name.RU} />
      <input name="translations.UA" defaultValue={category?.name.UA} />
      <input 
        type="checkbox" 
        name="isActive" 
        defaultChecked={category?.isActive ?? true} 
      />
      <input 
        type="number" 
        name="order" 
        defaultValue={category?.order} 
      />
      
      <SubmitButton />
      
      {state.message && (
        <div className={state.success ? 'text-green-600' : 'text-red-600'}>
          {state.message}
        </div>
      )}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Сохранение...' : 'Сохранить'}
    </button>
  );
}
```

#### Использование в списке категорий
```typescript
// src/features/dashboard/ui/components/ContentManagement/CategoryList.tsx
'use client';

import { useTransition } from 'react';
import { deleteCategory, toggleCategoryStatus } from '../../server-actions/categories';

interface CategoryListProps {
  categories: CategoryWithTranslation[];
}

export function CategoryList({ categories }: CategoryListProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteCategory(id);
      if (result.success) {
        // Показать уведомление об успехе
        toast.success(result.message);
      } else {
        // Показать уведомление об ошибке
        toast.error(result.message);
      }
    });
  };

  const handleToggleStatus = (id: string, isActive: boolean) => {
    startTransition(async () => {
      const result = await toggleCategoryStatus(id, isActive);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div>
      {categories.map(category => (
        <div key={category.id}>
          <span>{category.name.EN}</span>
          <button 
            onClick={() => handleToggleStatus(category.id, !category.isActive)}
            disabled={isPending}
          >
            {category.isActive ? 'Деактивировать' : 'Активировать'}
          </button>
          <button 
            onClick={() => handleDelete(category.id)}
            disabled={isPending}
          >
            Удалить
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Уведомления и обработка ошибок

#### Типы уведомлений
```typescript
export type CategoryNotificationType = 
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

export interface CategoryNotification {
  id: string;
  type: CategoryNotificationType;
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

#### Toast уведомления
```typescript
import { toast } from 'sonner';

// Успешные операции
toast.success('Категория успешно создана');
toast.success('Категория успешно обновлена');
toast.success('Категория успешно удалена');

// Ошибки
toast.error('Ошибка при создании категории');
toast.error('Категория с таким названием уже существует');

// Предупреждения
toast.warning('Вы уверены, что хотите удалить эту категорию?');
toast.warning('При деактивации категории связанные стихи останутся без категории');
```

### Состояние и управление данными

#### Хуки для работы с категориями
```typescript
// src/features/dashboard/lib/hooks/useCategories.ts
'use client';

import { useTransition } from 'react';
import { getCategories } from '../../server-actions/categories';
import type { CategoryFilters } from '@/entities/category/model/types';

export function useCategories(filters?: CategoryFilters) {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<{
    categories: CategoryWithTranslation[];
    stats: CategoryStats;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(() => {
    startTransition(async () => {
      try {
        const result = await getCategories(filters);
        if (result.success) {
          setData(result.data);
          setError(null);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError('Произошла ошибка при загрузке категорий');
      }
    });
  }, [filters]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories: data?.categories ?? [],
    stats: data?.stats,
    isLoading: isPending,
    error,
    refetch: fetchCategories,
  };
}
```

### Права доступа и безопасность

#### Проверка прав доступа
```typescript
// src/features/dashboard/lib/permissions.ts
export function canManageCategories(userRole?: string): boolean {
  return ['ADMIN', 'MODERATOR'].includes(userRole || '');
}

export function canDeleteCategories(userRole?: string): boolean {
  return userRole === 'ADMIN';
}
```

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

### Массовое обновление порядка
```typescript
await categoryRepository.bulkUpdateOrder([
  { id: '1', order: 1 },
  { id: '2', order: 2 },
  { id: '3', order: 3 },
]);
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
- Drag & Drop интерфейс для изменения порядка

### Мягкое удаление
- Категории не удаляются физически, а деактивируются
- Метод `deactivate()` для деактивации
- Метод `activate()` для повторной активации

### Валидация
- Проверка уникальности названий
- Валидация длины названий
- Проверка корректности порядковых номеров
- Валидация на клиенте и сервере

### Оптимизация производительности
- Пагинация для больших списков
- Кэширование часто используемых данных
- Ленивая загрузка компонентов
- Оптимизированные запросы к БД

## Безопасность

- Все операции с категориями должны проверять права доступа (роль MODERATOR или выше)
- Валидация входных данных на уровне репозитория
- Защита от SQL-инъекций через Prisma ORM
- CSRF защита для форм
- Rate limiting для API endpoints

## Тестирование

### Unit тесты
- Тестирование методов репозитория
- Тестирование валидации
- Тестирование бизнес-логики

### Integration тесты
- Тестирование server actions
- Тестирование интеграции с базой данных
- Тестирование прав доступа

### E2E тесты
- Тестирование полного workflow создания/редактирования/удаления
- Тестирование UI компонентов
- Тестирование пользовательских сценариев
