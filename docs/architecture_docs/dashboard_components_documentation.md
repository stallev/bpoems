# Dashboard Components Documentation

## Overview

Создана полная система компонентов для административного dashboard согласно принципам FSD архитектуры. Все компоненты адаптивны и поддерживают мобильные устройства.

## Структура компонентов

```
src/features/dashboard/
├── ui/
│   ├── DashboardLayout.tsx      # Main dashboard layout component
│   ├── DashboardHeader.tsx      # Adaptive header with breadcrumbs
│   ├── DashboardSidebar.tsx     # Adaptive navigation panel
│   ├── DashboardFooter.tsx      # Adaptive footer
│   ├── DashboardBreadcrumbs.tsx # Reusable breadcrumbs component
│   └── index.ts                 # UI components export
├── model/
│   ├── types.ts                 # TypeScript types
│   ├── constants.ts             # Navigation constants
│   └── index.ts                 # Model export
├── lib/
│   ├── permissions.ts           # Permission checking hook
│   └── index.ts                 # Lib export
└── index.ts                     # Main feature export
```

## Components

### 1. DashboardLayout

**File:** `src/features/dashboard/ui/DashboardLayout.tsx`

**Description:** Main layout component that combines all dashboard elements.

**Functionality:**
- Mobile menu state management
- Integration of all dashboard components
- Adaptive structure
- Support for breadcrumbs navigation

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

**File:** `src/features/dashboard/ui/DashboardHeader.tsx`

**Description:** Adaptive header with mobile menu button, breadcrumbs and improved navigation.

**Functionality:**
- Mobile menu button (hidden on desktop)
- Adaptive breadcrumbs navigation
- Sticky positioning for better UX
- Adaptive page title
- Support for actions in the right section

**UX Features:**
- **Sticky Header:** Header remains visible when scrolling
- **Adaptability:** Different behavior on mobile and desktop devices
- **Visual Hierarchy:** Clear separation of navigation elements
- **Backdrop Blur:** Modern background blur effect

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

### 3. DashboardBreadcrumbs

**File:** `src/features/dashboard/ui/DashboardBreadcrumbs.tsx`

**Description:** Reusable breadcrumbs component for dashboard pages.

**Functionality:**
- Home link with icon for quick navigation
- Adaptive breadcrumbs navigation
- Support for clickable and non-clickable items
- Proper visual hierarchy

**Features:**
- **Home Link:** Quick navigation to dashboard with icon
- **Adaptive Design:** Hidden on mobile devices
- **Visual Hierarchy:** Current page is highlighted
- **Accessibility:** Keyboard navigation support

**Props:**
```typescript
interface DashboardBreadcrumbsProps {
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}
```

**Usage Examples:**
```typescript
// Simple breadcrumbs
<DashboardBreadcrumbs breadcrumbs={[
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Content', href: '/dashboard/content' },
  { label: 'Categories' }
]} />

// Single page breadcrumbs
<DashboardBreadcrumbs breadcrumbs={[
  { label: 'Dashboard' }
]} />
```

### 4. DashboardSidebar

**File:** `src/features/dashboard/ui/DashboardSidebar.tsx`

**Description:** Адаптивная навигационная панель с группированными ссылками.

**Functionality:**
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

### 5. DashboardFooter

**File:** `src/features/dashboard/ui/DashboardFooter.tsx`

**Description:** Адаптивный footer с информацией о платформе.

**Functionality:**
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

## Лучшие практики Breadcrumbs

### Структура Breadcrumbs

**Рекомендуемая иерархия:**
```typescript
// Главная страница dashboard
const breadcrumbs = [{ label: 'Dashboard' }];

// Страница управления контентом
const breadcrumbs = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Content' }
];

// Страница категорий
const breadcrumbs = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Content', href: '/dashboard/content' },
  { label: 'Categories' }
];

// Детальная страница категории
const breadcrumbs = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Content', href: '/dashboard/content' },
  { label: 'Categories', href: '/dashboard/content/categories' },
  { label: 'Category Name' }
];
```

### Правила именования

1. **Краткость:** Используйте короткие, понятные названия
2. **Консистентность:** Соблюдайте единый стиль именования
3. **Локализация:** Поддерживайте многоязычность
4. **Контекст:** Названия должны отражать текущий контекст

### UX принципы

1. **Всегда показывать путь:** Пользователь должен понимать, где он находится
2. **Кликабельность:** Все элементы кроме последнего должны быть ссылками
3. **Визуальная иерархия:** Последний элемент выделяется как текущая страница
4. **Адаптивность:** На мобильных устройствах breadcrumbs могут скрываться
5. **Доступность:** Поддержка клавиатурной навигации и screen readers

### Техническая реализация

```typescript
// Типизация breadcrumbs
interface BreadcrumbItem {
  label: string;
  href?: string; // undefined для текущей страницы
}

// Использование в компонентах
const breadcrumbs: BreadcrumbItem[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Content', href: '/dashboard/content' },
  { label: 'Categories' } // Текущая страница
];

// Передача в layout
<DashboardLayout 
  title="Управление категориями"
  breadcrumbs={breadcrumbs}
>
  {/* Content */}
</DashboardLayout>
```

## Адаптивность

### Мобильная версия (< 768px):
- Sidebar скрыт по умолчанию
- Кнопка меню в header
- Overlay при открытом меню
- Вертикальная компоновка footer
- Breadcrumbs скрыты, показывается только заголовок страницы
- Sticky header для лучшей навигации

### Desktop версия (≥ 768px):
- Sidebar всегда видим
- Горизонтальная компоновка footer
- Полные breadcrumbs с навигацией
- Кнопка "Home" для быстрой навигации
- Расширенная область для действий в header

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
