# Dashboard Components Documentation

## Overview

Создана полная система компонентов для административного dashboard согласно принципам FSD архитектуры. Все компоненты адаптивны и поддерживают мобильные устройства.

## Структура компонентов

```
src/features/dashboard/
├── ui/
│   ├── DashboardLayout.tsx      # Главный layout компонент
│   ├── DashboardHeader.tsx      # Адаптивный header с breadcrumbs
│   ├── DashboardSidebar.tsx     # Адаптивная навигационная панель
│   ├── DashboardFooter.tsx      # Адаптивный footer
│   └── index.ts                 # Экспорт UI компонентов
├── model/
│   ├── types.ts                 # TypeScript типы
│   ├── constants.ts             # Константы навигации
│   └── index.ts                 # Экспорт model
├── lib/
│   ├── permissions.ts           # Хук для проверки разрешений
│   └── index.ts                 # Экспорт lib
└── index.ts                     # Главный экспорт feature
```

## Компоненты

### 1. DashboardLayout

**Файл:** `src/features/dashboard/ui/DashboardLayout.tsx`

**Описание:** Главный layout компонент, объединяющий все элементы dashboard.

**Функциональность:**
- Управление состоянием мобильного меню
- Интеграция всех компонентов dashboard
- Адаптивная структура

**Props:**
```typescript
interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}
```

### 2. DashboardHeader

**Файл:** `src/features/dashboard/ui/DashboardHeader.tsx`

**Описание:** Адаптивный header с кнопкой мобильного меню и breadcrumbs.

**Функциональность:**
- Кнопка мобильного меню (скрыта на desktop)
- Breadcrumbs навигация
- Адаптивный заголовок страницы
- Поддержка действий в правой части

**Props:**
```typescript
interface DashboardHeaderProps {
  title?: string;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}
```

### 3. DashboardSidebar

**Файл:** `src/features/dashboard/ui/DashboardSidebar.tsx`

**Описание:** Адаптивная навигационная панель с группированными ссылками.

**Функциональность:**
- Мобильное меню с overlay
- Группированная навигация по разделам
- Проверка разрешений пользователя
- Активные состояния ссылок
- Иконки и описания для каждого пункта

**Особенности:**
- На экранах < 768px выезжает слева
- Закрывается по клику на overlay
- Фильтрация пунктов по разрешениям пользователя

**Props:**
```typescript
interface DashboardSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}
```

### 4. DashboardFooter

**Файл:** `src/features/dashboard/ui/DashboardFooter.tsx`

**Описание:** Адаптивный footer с информацией о платформе.

**Функциональность:**
- Информация о платформе
- Версия dashboard
- Адаптивная компоновка
- Copyright информация

## Навигационная структура

### Группы навигации:

1. **Overview**
   - Dashboard (главная страница)

2. **Management**
   - User Management (управление пользователями)
   - Content Management (управление контентом)
   - Categories (категории)
   - Tags (теги)

3. **Moderation**
   - Moderation Queue (очередь модерации)
   - Reports (жалобы)
   - Author Requests (запросы на роль автора)

4. **Analytics**
   - Analytics Overview (обзор аналитики)
   - User Analytics (аналитика пользователей)
   - Content Analytics (аналитика контента)
   - Platform Analytics (аналитика платформы)

5. **Settings**
   - Settings Overview (обзор настроек)
   - System Settings (системные настройки)
   - Security Settings (настройки безопасности)
   - Content Settings (настройки контента)

## Система разрешений

### Хук useDashboardPermissions

**Файл:** `src/features/dashboard/lib/permissions.ts`

**Функциональность:**
- Проверка роли пользователя
- Фильтрация навигации по разрешениям
- Динамическое отображение пунктов меню

**Разрешения:**
- `canAccessUsers` - доступ к управлению пользователями (ADMIN)
- `canAccessContent` - доступ к управлению контентом (ADMIN, MODERATOR)
- `canAccessAnalytics` - доступ к аналитике (ADMIN)
- `canAccessSettings` - доступ к настройкам (ADMIN)
- `canModerateContent` - доступ к модерации (ADMIN, MODERATOR)
- `canManageRoles` - управление ролями (ADMIN)

## Адаптивность

### Мобильная версия (< 768px):
- Sidebar скрыт по умолчанию
- Кнопка меню в header
- Overlay при открытом меню
- Вертикальная компоновка footer

### Desktop версия (≥ 768px):
- Sidebar всегда видим
- Горизонтальная компоновка footer
- Полные breadcrumbs

## Интеграция с существующей системой

### Обновленный layout:
**Файл:** `src/app/dashboard/layout.tsx`

- Проверка авторизации и роли ADMIN
- Интеграция с новым DashboardLayout
- Сохранение существующей логики безопасности

## Использование

### Базовое использование:
```typescript
import { DashboardLayout } from '@/features/dashboard';

export default function DashboardPage() {
  return (
    <DashboardLayout
      title="User Management"
      breadcrumbs={[
        { label: 'Users', href: '/dashboard/users' },
        { label: 'User Details' }
      ]}
    >
      {/* Content */}
    </DashboardLayout>
  );
}
```

### Кастомные breadcrumbs:
```typescript
const breadcrumbs = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Content', href: '/dashboard/content' },
  { label: 'Poems' }
];
```

## Технические детали

### Зависимости:
- `lucide-react` - иконки
- `next/navigation` - навигация
- `@/shared/ui/shadcnComponents/*` - UI компоненты
- `@/shared/lib/utils` - утилиты

### Состояние:
- Локальное состояние мобильного меню
- Активные состояния навигации
- Динамическая фильтрация по разрешениям

### Производительность:
- Ленивая загрузка компонентов
- Оптимизированные рендеры
- Минимальные ре-рендеры

## Соответствие FSD

✅ **Feature-Sliced Design:**
- Четкое разделение на слои (ui, model, lib)
- Правильная структура импортов
- Изолированные компоненты
- Переиспользуемые части

✅ **Типизация:**
- Полная TypeScript поддержка
- Интерфейсы для всех props
- Типы для навигации и разрешений

✅ **Адаптивность:**
- Мобильная и desktop версии
- Плавные анимации
- Доступность (aria-labels)

## Заключение

Созданная система компонентов dashboard обеспечивает:
- Полную адаптивность
- Соответствие FSD принципам
- Гибкую систему разрешений
- Простоту использования и расширения
- Современный UI/UX
