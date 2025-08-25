# Pages Structure PRD

## Current Project Pages Structure

### App Router Structure (Next.js 15.4.4)

```
src/app/
├── layout.tsx                    # Root layout (fonts, SessionProvider, metadata)
├── globals.css                   # Global styles
├── favicon.ico                   # Favicon
├── (noadmin)/                    # Public routes with Header/Footer
│   ├── layout.tsx                # Public layout (Header, Footer)
│   ├── page.tsx                  # Home page (/)
│   ├── auth/
│   │   └── page.tsx              # Authentication page (/auth)
│   ├── poems/
│   │   ├── page.tsx              # Poems list page (/poems)
│   │   ├── [slug]/
│   │   │   └── page.tsx          # Individual poem page (/poems/[slug])
│   │   ├── edit-poem/
│   │   │   └── page.tsx          # Edit poem page (/poems/edit-poem)
│   │   └── add-poem/
│   │       └── page.tsx          # Create new poem page (/poems/add-poem)
│   ├── profile/
│   │   └── page.tsx              # User profile page (/profile)
│   └── users/
│       └── page.tsx              # Users list page (/users)
├── dashboard/                    # Dashboard pages (ADMIN only)
│   ├── layout.tsx                # Dashboard layout with ADMIN auth check
│   └── page.tsx                  # Dashboard overview page (/dashboard)
└── api/                          # API routes
    └── auth/
        ├── [...nextauth]/
        │   └── route.ts          # NextAuth.js API route
        ├── login/
        │   │   └── route.ts      # Login API route
        └── register/
            └── route.ts          # Register API route
```

### Layout Hierarchy

```
Root Layout (src/app/layout.tsx)
├── Fonts (Geist, Geist_Mono)
├── SessionProvider
├── Global CSS
└── Children
    ├── Public Layout (src/app/(noadmin)/layout.tsx)
    │   ├── Header
    │   ├── Children (public pages)
    │   └── Footer
    └── Dashboard Layout (src/app/dashboard/layout.tsx)
        ├── Auth check (ADMIN role)
        └── Children (dashboard pages)
```

### Current Route Mapping

| Route | File Path | Access | Description |
|-------|-----------|--------|-------------|
| `/` | `src/app/(noadmin)/page.tsx` | Public | Home page |
| `/auth` | `src/app/(noadmin)/auth/page.tsx` | Public | Authentication (login/register) |
| `/poems` | `src/app/(noadmin)/poems/page.tsx` | Public | Poems listing |
| `/poems/[slug]` | `src/app/(noadmin)/poems/[slug]/page.tsx` | Public | Individual poem view |
| `/poems/edit-poem` | `src/app/(noadmin)/poems/edit-poem/page.tsx` | Private | Edit poem (AUTHOR+) |
| `/poems/add-poem` | `src/app/(noadmin)/poems/add-poem/page.tsx` | Private | Create poem (AUTHOR+) |
| `/profile` | `src/app/(noadmin)/profile/page.tsx` | Private | User profile (SUBSCRIBER+) |
| `/users` | `src/app/(noadmin)/users/page.tsx` | Public | Users listing |
| `/dashboard` | `src/app/dashboard/page.tsx` | Private | Admin dashboard (ADMIN only) |

## Proposed Profile Pages Structure

### Based on RoutePath.ts Analysis

```
src/app/(noadmin)/profile/
├── page.tsx                      # Profile overview (/profile)
├── settings/
│   └── page.tsx                  # Profile settings (/profile/settings)
├── my-poems/
│   ├── page.tsx                  # User's poems list (/profile/my-poems)
│   ├── [id]/
│   │   └── page.tsx              # Edit specific poem (/profile/my-poems/[id])
│   └── new/
│       └── page.tsx              # Create new poem (/profile/my-poems/new)
├── add-poem/
│   └── page.tsx                  # Add poem form (/profile/add-poem)
├── edit-poem/
│   └── page.tsx                  # Edit poem form (/profile/edit-poem)
└── requests/
    └── page.tsx                  # Author role requests (/profile/requests)
```

### Profile Route Mapping

| Route | File Path | Access | Description |
|-------|-----------|--------|-------------|
| `/profile` | `src/app/(noadmin)/profile/page.tsx` | SUBSCRIBER+ | Profile overview |
| `/profile/settings` | `src/app/(noadmin)/profile/settings/page.tsx` | SUBSCRIBER+ | Profile settings |
| `/profile/my-poems` | `src/app/(noadmin)/profile/my-poems/page.tsx` | AUTHOR+ | User's poems list |
| `/profile/my-poems/[id]` | `src/app/(noadmin)/profile/my-poems/[id]/page.tsx` | AUTHOR+ | Edit specific poem |
| `/profile/my-poems/new` | `src/app/(noadmin)/profile/my-poems/new/page.tsx` | AUTHOR+ | Create new poem |
| `/profile/add-poem` | `src/app/(noadmin)/profile/add-poem/page.tsx` | AUTHOR+ | Add poem form |
| `/profile/edit-poem` | `src/app/(noadmin)/profile/edit-poem/page.tsx` | AUTHOR+ | Edit poem form |
| `/profile/requests` | `src/app/(noadmin)/profile/requests/page.tsx` | SUBSCRIBER+ | Author role requests |

## Proposed Dashboard Pages Structure

### Based on Dashboard Structure Analysis

```
src/app/dashboard/
├── layout.tsx                    # Dashboard layout with ADMIN auth check
├── page.tsx                      # Dashboard overview (/dashboard)
├── users/
│   ├── page.tsx                  # User management (/dashboard/users)
│   └── [id]/
│       └── page.tsx              # User details (/dashboard/users/[id])
├── content/
│   ├── page.tsx                  # Content overview (/dashboard/content)
│   ├── poems/
│   │   ├── page.tsx              # Poem management (/dashboard/content/poems)
│   │   └── [id]/
│   │       └── page.tsx          # Poem details (/dashboard/content/poems/[id])
│   ├── categories/
│   │   ├── page.tsx              # Category management (/dashboard/content/categories)
│   │   └── [id]/
│   │       └── page.tsx          # Category details (/dashboard/content/categories/[id])
│   └── tags/
│       └── page.tsx              # Tag management (/dashboard/content/tags)
├── moderation/
│   ├── page.tsx                  # Moderation queue (/dashboard/moderation)
│   ├── reports/
│   │   └── page.tsx              # User reports (/dashboard/moderation/reports)
│   └── requests/
│       └── page.tsx              # Author requests (/dashboard/moderation/requests)
├── analytics/
│   ├── page.tsx                  # Analytics overview (/dashboard/analytics)
│   ├── users/
│   │   └── page.tsx              # User analytics (/dashboard/analytics/users)
│   ├── content/
│   │   └── page.tsx              # Content analytics (/dashboard/analytics/content)
│   └── platform/
│       └── page.tsx              # Platform analytics (/dashboard/analytics/platform)
└── settings/
    ├── page.tsx                  # Settings overview (/dashboard/settings)
    ├── system/
    │   └── page.tsx              # System settings (/dashboard/settings/system)
    ├── security/
    │   └── page.tsx              # Security settings (/dashboard/settings/security)
    └── content/
        └── page.tsx              # Content settings (/dashboard/settings/content)
```

### Dashboard Route Mapping

| Route | File Path | Access | Description |
|-------|-----------|--------|-------------|
| `/dashboard` | `src/app/dashboard/page.tsx` | ADMIN | Dashboard overview |
| `/dashboard/users` | `src/app/dashboard/users/page.tsx` | ADMIN | User management |
| `/dashboard/users/[id]` | `src/app/dashboard/users/[id]/page.tsx` | ADMIN | User details |
| `/dashboard/content` | `src/app/dashboard/content/page.tsx` | ADMIN | Content overview |
| `/dashboard/content/poems` | `src/app/dashboard/content/poems/page.tsx` | ADMIN | Poem management |
| `/dashboard/content/poems/[id]` | `src/app/dashboard/content/poems/[id]/page.tsx` | ADMIN | Poem details |
| `/dashboard/content/categories` | `src/app/dashboard/content/categories/page.tsx` | ADMIN | Category management |
| `/dashboard/content/categories/[id]` | `src/app/dashboard/content/categories/[id]/page.tsx` | ADMIN | Category details |
| `/dashboard/content/tags` | `src/app/dashboard/content/tags/page.tsx` | ADMIN | Tag management |
| `/dashboard/moderation` | `src/app/dashboard/moderation/page.tsx` | ADMIN | Moderation queue |
| `/dashboard/moderation/reports` | `src/app/dashboard/moderation/reports/page.tsx` | ADMIN | User reports |
| `/dashboard/moderation/requests` | `src/app/dashboard/moderation/requests/page.tsx` | ADMIN | Author requests |
| `/dashboard/analytics` | `src/app/dashboard/analytics/page.tsx` | ADMIN | Analytics overview |
| `/dashboard/analytics/users` | `src/app/dashboard/analytics/users/page.tsx` | ADMIN | User analytics |
| `/dashboard/analytics/content` | `src/app/dashboard/analytics/content/page.tsx` | ADMIN | Content analytics |
| `/dashboard/analytics/platform` | `src/app/dashboard/analytics/platform/page.tsx` | ADMIN | Platform analytics |
| `/dashboard/settings` | `src/app/dashboard/settings/page.tsx` | ADMIN | Settings overview |
| `/dashboard/settings/system` | `src/app/dashboard/settings/system/page.tsx` | ADMIN | System settings |
| `/dashboard/settings/security` | `src/app/dashboard/settings/security/page.tsx` | ADMIN | Security settings |
| `/dashboard/settings/content` | `src/app/dashboard/settings/content/page.tsx` | ADMIN | Content settings |

## Layout Architecture

### Root Layout (src/app/layout.tsx)
```typescript
// Глобальные настройки для всего приложения
- Fonts (Geist, Geist_Mono)
- SessionProvider
- Global CSS
- Metadata
```

### Public Layout (src/app/(noadmin)/layout.tsx)
```typescript
// Layout для публичной части приложения
- Header
- Children (public pages)
- Footer
```

### Dashboard Layout (src/app/dashboard/layout.tsx)
```typescript
// Layout для административной части
- Auth check (ADMIN role verification)
- Dashboard sidebar (будущая реализация)
- Children (dashboard pages)
```

## Benefits of New Structure

### 1. **Clear Separation of Concerns**
- ✅ Публичная часть изолирована в `(noadmin)`
- ✅ Административная часть изолирована в `dashboard`
- ✅ Глобальные настройки в корневом layout

### 2. **Performance Optimization**
- ✅ Code splitting по функциональности
- ✅ Ленивая загрузка административных компонентов
- ✅ Оптимизация бандлов

### 3. **Security**
- ✅ Административные страницы защищены на уровне layout
- ✅ Четкое разделение доступа
- ✅ Изоляция административного интерфейса

### 4. **Maintainability**
- ✅ Четкая структура файлов
- ✅ Легко добавлять новые разделы
- ✅ Простое тестирование

### 5. **FSD Compliance**
- ✅ Соответствие принципам Feature-Sliced Design
- ✅ Четкое разделение слоев
- ✅ Правильная организация импортов

## Dashboard Architecture Decision

### Recommendation: Multiple Pages Approach

**Позиция: Рекомендую использовать подход с множественными страницами для dashboard.**

#### Обоснование:

### 1. **SEO и URL Structure**
- ✅ Каждая страница имеет уникальный URL
- ✅ Возможность прямых ссылок на конкретные разделы
- ✅ Лучшая индексация поисковыми системами
- ✅ Возможность добавления мета-тегов для каждой страницы

### 2. **Performance**
- ✅ Ленивая загрузка страниц (code splitting)
- ✅ Меньший размер бандла для каждой страницы
- ✅ Быстрая навигация между разделами
- ✅ Кэширование на уровне страниц

### 3. **User Experience**
- ✅ Понятная навигация с breadcrumbs
- ✅ Возможность открытия нескольких разделов в разных вкладках
- ✅ Сохранение состояния каждой страницы
- ✅ Лучшая доступность (screen readers, keyboard navigation)

### 4. **Development & Maintenance**
- ✅ Четкое разделение ответственности
- ✅ Легче тестировать отдельные страницы
- ✅ Проще добавлять новые разделы
- ✅ Лучшая организация кода

### 5. **FSD Compliance**
- ✅ Соответствие принципам Feature-Sliced Design
- ✅ Каждая страница - отдельный feature
- ✅ Переиспользование компонентов между страницами
- ✅ Четкая структура импортов

## Alternative: Single Page Approach

### Когда стоит рассмотреть:

1. **Очень простой dashboard** с минимальным функционалом
2. **Real-time обновления** требуются для всех разделов
3. **Сложная взаимосвязь** между разделами
4. **Ограничения по производительности** сервера

### Недостатки:

- ❌ Сложная навигация
- ❌ Большой размер бандла
- ❌ Сложность в поддержке
- ❌ Проблемы с SEO
- ❌ Сложность тестирования

## Implementation Strategy

### Phase 1: Core Dashboard
1. Создать базовую структуру с layout
2. Реализовать главную страницу dashboard
3. Добавить sidebar навигацию

### Phase 2: User Management
1. Страница списка пользователей
2. Страница деталей пользователя
3. Функции управления ролями

### Phase 3: Content Management
1. Управление стихотворениями
2. Управление категориями
3. Управление тегами

### Phase 4: Analytics & Settings
1. Аналитические страницы
2. Настройки системы
3. Модерация

## Technical Implementation

### Layout Structure
```typescript
// src/app/dashboard/layout.tsx
export default async function DashboardLayout({ children }) {
  // Auth check
  // Role verification
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
```

### Page Structure
```typescript
// src/app/dashboard/users/page.tsx
export default function UsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="User Management" />
      <UserList />
    </div>
  );
}
```

### Component Reusability
```typescript
// Shared components for all dashboard pages
- PageHeader
- DataTable
- FilterPanel
- StatusBadge
- ActionButton
```

## Conclusion

**Рекомендация: Использовать множественные страницы для dashboard**

Этот подход обеспечивает:
- Лучшую производительность
- Понятную навигацию
- Соответствие FSD принципам
- Легкость в поддержке и развитии
- Хорошую SEO оптимизацию

Каждая страница должна быть самодостаточной, но переиспользовать общие компоненты из shared layer.
