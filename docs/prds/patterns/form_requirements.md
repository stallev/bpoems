# Требования к разработке форм в Christian Poetry Platform

## 1. Общие принципы разработки форм

### 1.1 Архитектурные требования
- Строгое соблюдение архитектуры Feature-Sliced Desgin (FSD)
- Разделение логики формы на сегменты:
  - `ui/`: Компоненты формы
  - `model/`: Схемы валидации, типы
  - `lib/`: Утилиты и хуки (при необходимости)
  - `server-actions/`: Серверные действия

### 1.2 Технологический стек
- React Hook Form v7.61.1
- Zod v4.0.10 для валидации
- Next.js Server Actions
- TypeScript с строгой типизацией

## 2. Структура компонента формы

### 2.1 Обязательные компоненты
```typescript
'use client';

import { useActionState, startTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

// Компоненты shadcn/ui
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/ui/shadcnComponents/form';
import { Button } from '@/shared/ui/shadcnComponents/button';

// Локальные импорты
import { formSchema, type FormData } from '../model/schemas';
import { submitForm } from '../server-actions/submitForm';
```

### 2.2 Требования к компоненту формы
- Использование `'use client'` директивы
- Применение `useActionState` для управления состоянием формы
- Использование `startTransition` для недублирующихся обновлений
- Мемоизация обработчиков с помощью `useCallback`
- Предотвращение множественных отправок с помощью реф или состояния

### 2.3 Пример реализации компонента
```typescript
export function MyForm({ 
  defaultValues, 
  onSuccess, 
  onCancel 
}: MyFormProps) {
  // Предотвращение множественных отправок
  const isSubmittingRef = useRef(false);

  // Состояние для управления visibility формы
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Состояние формы с помощью useActionState
  const [state, formAction] = useActionState(submitForm, { 
    success: false, 
    message: '' 
  });

  // Форма с валидацией через Zod
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Обработчик submit с оптимистичным обновлением
  const onSubmit = useCallback((data: FormData) => {
    // Предотвращение множественных отправок
    if (isSubmittingRef.current) return;

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    startTransition(() => {
      isSubmittingRef.current = true;
      formAction(formData);
    });
  }, [formAction]);

  // Обработка результатов отправки
  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
        onSuccess?.();
        setIsFormVisible(false);
      } else {
        toast.error(state.message);
      }
    }
  }, [state, onSuccess]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Поля формы */}
        <SubmitButton />
      </form>
    </Form>
  );
}
```

## 3. Серверные действия (Server Actions)

### 3.1 Требования к реализации
- Использование `'use server'` директивы
- Полная валидация входящих данных с помощью Zod
- Проверка аутентификации и авторизации
- Обработка ошибок с информативными сообщениями
- Использование `revalidatePath()` для обновления кэша

### 3.2 Пример серверного действия
```typescript
'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/shared/api/auth/auth';
import { formSchema } from '../model/schemas';
import { repository } from '@/entities/{entity-name}';

export async function submitForm(formData: FormData) {
  try {
    // Проверка аутентификации
    const session = await auth();
    if (!session?.user) {
      throw new Error('Unauthorized');
    }

    // Валидация данных
    const rawData = {
      // Извлечение данных из FormData
      fieldName: formData.get('fieldName') as string,
    };

    const validatedData = formSchema.parse(rawData);
    
    // Бизнес-логика
    const result = await repository.create(validatedData);

    // Инвалидация кэша
    revalidatePath('/relevant/path');

    return {
      success: true,
      message: 'Форма успешно отправлена',
      data: result,
    };
  } catch (error) {
    console.error('Ошибка отправки формы:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    };
  }
}
```

## 4. Пользовательские хуки

### 4.1 Критерии создания пользовательских хуков
Создавайте пользовательский хук, если выполняются ОДНОВРЕМЕННО следующие условия:
1. Логика формы сложнее простой валидации и отправки
2. Логика переиспользуется более чем в одном компоненте
3. Логика требует сложной предобработки данных
4. Необходимо вынести сложную бизнес-логику за пределы компонента

### 4.2 Пример пользовательского хука
```typescript
export const useMyForm = ({ onSuccess }: UseMyFormProps) => {
  const handleSubmit = useCallback((data: FormData) => {
    // Предобработка данных
    const processedData = prepareFormData(data);
    
    if (onSuccess) {
      onSuccess(processedData);
    }
    
    return processedData;
  }, [onSuccess]);

  return { handleSubmit };
};
```

## 5. Оптимизация и производительность

### 5.1 Оптимистичные обновления
- Использовать `useOptimistic` для мгновенного обновления UI
- Добавлять элементы в списки до получения ответа от сервера
- Откатывать изменения при ошибке

### 5.2 Предотвращение множественных отправок
- Использовать `useRef` для отслеживания статуса отправки
- Блокировать повторные отправки во время активной отправки
- Сбрасывать флаг отправки в `finally` блоке

## 6. Обработка состояний формы

### 6.1 Управление visibility
- Использовать отдельное состояние `isFormVisible`
- Скрывать форму после успешной отправки
- Возвращать форму в исходное состояние при отмене

### 6.2 Уведомления
- Использовать библиотеку `sonner` для toast-уведомлений
- Показывать только одно уведомление за операцию
- Различать успешные и ошибочные состояния

## 7. Accessibility и UX

### 7.1 Требования к доступности
- Использовать семантическую разметку
- Добавлять ARIA-атрибуты
- Поддерживать навигацию с клавиатуры
- Показывать состояние загрузки
- Предоставлять информативные сообщения об ошибках

### 7.2 Анимация и переходы
- Использовать плавные переходы для появления/скрытия форм
- Применять CSS-классы для анимации
- Использовать `transition` и `opacity` для мягких эффектов

## 8. Безопасность

### 8.1 Валидация данных
- Всегда использовать Zod для валидации на клиенте и сервере
- Санитизировать пользовательский ввода
- Проверять права доступа на сервере

### 8.2 Защита от атак
- Использовать CSRF-токены
- Ограничивать размер и тип загружаемых данных
- Логировать подозрительные действия

## 11. Документация

### 11.1 Требования к документации
- Комментарии на английском языке
- Описание назначения формы
- Документация нестандартной логики
- Указание зависимостей и ограничений

---

**Версия документа:** 1.1
**Последнее обновление:** [Текущая дата]
**Следующий пересмотр:** [Дата + 2 недели]