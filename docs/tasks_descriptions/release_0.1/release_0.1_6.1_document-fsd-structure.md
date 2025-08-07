# Задача 6.1: Документирование полной структуры проекта FSD

## Описание задачи

Создание подробной документации по структуре проекта, основанного на методологии Feature-Sliced Design (FSD), с детальным описанием всех слоев, сегментов и принципов организации кода. Документация должна учитывать особенности работы с Next.js 15.4.4 и современным стеком технологий.

## Необходимые технологии

- Feature-Sliced Design (FSD)
- Next.js 15.4.4
- TypeScript
- Markdown
- React Server Components
- Server Actions

## Подробное руководство по выполнению

### 1. Понимание методологии Feature-Sliced Design

Перед началом документирования необходимо глубоко понять основные принципы и концепции FSD:

- **Слои (Layers)** - горизонтальное разделение кода по уровню абстракции
- **Слайсы (Slices)** - вертикальное разделение кода по бизнес-доменам
- **Сегменты (Segments)** - внутреннее разделение слайса по техническому назначению
- **Публичное API** - контролируемый интерфейс для взаимодействия между слайсами

#### Альтернативные архитектурные подходы

Существует несколько альтернативных подходов к организации кода в современных React/Next.js приложениях:

1. **Модульный монолит**
   
   ```
   src/
   ├── modules/
   │   ├── auth/
   │   │   ├── components/
   │   │   ├── hooks/
   │   │   ├── services/
   │   │   └── types.ts
   │   ├── poems/
   │   └── users/
   ├── shared/
   │   ├── components/
   │   ├── hooks/
   │   └── utils/
   └── pages/
   ```
   
   **Плюсы:**
   - Более простая структура
   - Меньше абстракций
   - Легче для понимания новичками
   
   **Минусы:**
   - Менее строгие правила импорта
   - Риск циклических зависимостей
   - Сложнее масштабировать на больших проектах
   
2. **Domain-Driven Design (DDD)**
   
   ```
   src/
   ├── domain/
   │   ├── poem/
   │   │   ├── entities/
   │   │   ├── value-objects/
   │   │   ├── repositories/
   │   │   └── services/
   │   └── user/
   ├── application/
   │   ├── use-cases/
   │   └── services/
   ├── infrastructure/
   │   ├── db/
   │   └── api/
   └── presentation/
       ├── components/
       └── pages/
   ```
   
   **Плюсы:**
   - Четкое разделение бизнес-логики и инфраструктуры
   - Хорошо подходит для сложных бизнес-доменов
   - Улучшает тестируемость
   
   **Минусы:**
   - Избыточен для небольших проектов
   - Много абстракций
   - Сложнее интегрировать с React/Next.js
   
3. **Atomic Design**
   
   ```
   src/
   ├── atoms/
   │   ├── Button/
   │   └── Input/
   ├── molecules/
   │   ├── SearchBar/
   │   └── FormField/
   ├── organisms/
   │   ├── Header/
   │   └── Footer/
   ├── templates/
   │   ├── AuthLayout/
   │   └── MainLayout/
   └── pages/
   ```
   
   **Плюсы:**
   - Хорошо подходит для UI-ориентированных проектов
   - Улучшает переиспользуемость компонентов
   - Понятная иерархия UI-элементов
   
   **Минусы:**
   - Фокусируется только на UI, не решает вопросы бизнес-логики
   - Сложно определить границы между уровнями
   - Не решает проблему организации бизнес-логики

**Почему рекомендуется Feature-Sliced Design:**
- Сбалансированный подход между сложностью и гибкостью
- Хорошо подходит для React/Next.js проектов
- Решает проблемы как UI, так и бизнес-логики
- Обеспечивает четкие правила импорта и зависимостей
- Поддерживает масштабирование проекта
- Соответствует требованиям проекта
- Имеет активное сообщество и документацию

### 2. Создание структуры документа

Создайте файл `docs/architecture_docs/arc_general_doc.md` с следующей структурой:

```markdown
# Feature-Sliced Design (FSD) Architecture Documentation

## Overview

This document outlines the Feature-Sliced Design (FSD) architecture implementation for the Christian Poetry Platform. FSD is a methodology for organizing frontend code that promotes scalability, maintainability, and clear separation of concerns.

## Architecture Principles

### Core Concepts
- **Layers:** Hierarchical organization of code by responsibility
- **Slices:** Self-contained features that can be developed and maintained independently
- **Segments:** Logical grouping within slices (ui, model, lib, api)
- **Public API:** Controlled interface for each slice

### Benefits
- **Scalability:** Easy to add new features without affecting existing code
- **Maintainability:** Clear structure makes code easier to understand and modify
- **Reusability:** Shared components and utilities can be used across features
- **Team Collaboration:** Different teams can work on different features independently

## Project Structure

[Detailed project structure will be added here]

## Layer Descriptions

[Layer descriptions will be added here]

## Segment Structure

[Segment structure will be added here]

## Import Rules

[Import rules will be added here]

## Public API Pattern

[Public API pattern will be added here]

## Naming Conventions

[Naming conventions will be added here]

## Adding New Code

[Guidelines for adding new code will be added here]

## Documentation Requirements

[Documentation requirements will be added here]

## Best Practices

[Best practices will be added here]

## Migration Guidelines

[Migration guidelines will be added here]

---

**Document Version:** 1.0  
**Last Updated:** [Current Date]  
**Next Review:** [Date + 2 weeks]
```

### 3. Документирование структуры проекта

Заполните раздел "Project Structure" детальным описанием структуры проекта:

```markdown
## Project Structure

```
src/
├── app/                    # App layer - application initialization
│   ├── providers/         # Global providers (theme, auth, etc.)
│   ├── styles/           # Global styles
│   └── [locale]/         # Locale-specific app structure
│       ├── layout.tsx    # Root layout
│       └── page.tsx      # Root page
├── pages/                 # Pages layer - page components
│   ├── home/             # Home page
│   ├── auth/             # Authentication pages
│   ├── poems/            # Poem-related pages
│   ├── profile/          # User profile pages
│   └── admin/            # Admin pages
├── widgets/               # Widgets layer - complex UI blocks
│   ├── header/           # Site header widget
│   ├── footer/           # Site footer widget
│   ├── sidebar/          # Navigation sidebar
│   ├── poem-card/        # Poem display widget
│   └── comment-section/  # Comments widget
├── features/              # Features layer - user-facing functionality
│   ├── auth/             # Authentication feature
│   │   ├── ui/           # UI components
│   │   ├── model/        # Business logic
│   │   ├── lib/          # Utilities
│   │   └── api/          # API calls
│   ├── poem-creation/    # Poem creation feature
│   ├── poem-viewing/     # Poem viewing feature
│   ├── search/           # Search functionality
│   ├── comments/         # Comment system
│   ├── user-profile/     # User profile management
│   ├── moderation/       # Content moderation
│   └── notifications/    # Notification system
├── entities/              # Entities layer - business entities
│   ├── user/             # User entity
│   │   ├── ui/           # User-related UI components
│   │   ├── model/        # User business logic
│   │   ├── lib/          # User utilities
│   │   └── api/          # User API calls
│   ├── poem/             # Poem entity
│   ├── category/         # Category entity
│   ├── tag/              # Tag entity
│   ├── comment/          # Comment entity
│   └── role/             # Role entity
└── shared/                # Shared layer - common utilities and components
    ├── ui/               # Reusable UI components
    │   ├── button/       # Button component
    │   ├── input/        # Input component
    │   ├── modal/        # Modal component
    │   └── icons/        # Icon components
    ├── lib/              # Utility functions
    │   ├── utils/        # General utilities
    │   ├── hooks/        # Custom hooks
    │   ├── constants/    # Constants
    │   └── validators/   # Validation functions
    ├── api/              # API configuration
    │   ├── client.ts     # API client setup
    │   └── types.ts      # API types
    ├── config/           # Configuration files
    │   ├── env.ts        # Environment variables
    │   └── constants.ts  # App constants
    └── styles/           # Global styles and themes
        ├── globals.css   # Global CSS
        └── theme.ts      # Theme configuration
```

### 4. Документирование слоев

Заполните раздел "Layer Descriptions" детальным описанием каждого слоя:

```markdown
## Layer Descriptions

### App Layer (`src/app/`)
**Purpose:** Application initialization and global configuration
**Responsibilities:**
- Global providers setup
- Root layout and routing
- Global styles and themes
- Environment configuration

**Rules:**
- Can import from any layer
- Should not contain business logic
- Focus on application setup and configuration

### Pages Layer (`src/pages/`)
**Purpose:** Page-level components that compose widgets and features
**Responsibilities:**
- Page composition
- Route handling
- Layout management
- Data fetching coordination

**Rules:**
- Can import from widgets, features, entities, and shared
- Should not contain business logic
- Focus on composition and routing

### Widgets Layer (`src/widgets/`)
**Purpose:** Complex UI blocks that combine multiple features
**Responsibilities:**
- Complex UI composition
- Cross-feature integration
- Reusable UI blocks

**Rules:**
- Can import from features, entities, and shared
- Should not contain business logic
- Focus on UI composition

### Features Layer (`src/features/`)
**Purpose:** User-facing functionality and business logic
**Responsibilities:**
- User interactions
- Business logic implementation
- Feature-specific state management
- API integration

**Rules:**
- Can import from entities and shared
- Should be self-contained
- Can export public API for other layers

### Entities Layer (`src/entities/`)
**Purpose:** Business entities and their related logic
**Responsibilities:**
- Entity definitions
- Entity-specific business logic
- Entity-related UI components
- Entity API integration

**Rules:**
- Can import from shared only
- Should be independent and reusable
- Can export public API for other layers

### Shared Layer (`src/shared/`)
**Purpose:** Common utilities, components, and configurations
**Responsibilities:**
- Reusable UI components
- Utility functions
- Type definitions
- Configuration files

**Rules:**
- Cannot import from other layers
- Should be framework-agnostic
- Can be used by any layer
```

### 5. Документирование структуры сегментов

Заполните раздел "Segment Structure" детальным описанием структуры сегментов:

```markdown
## Segment Structure

Each slice (feature, entity, widget) follows a consistent segment structure:

```
feature-name/
├── ui/                   # UI components
│   ├── index.ts         # Public API exports
│   ├── ComponentName.tsx
│   └── ComponentName.module.css
├── model/               # Business logic
│   ├── index.ts         # Public API exports
│   ├── store.ts         # State management
│   ├── types.ts         # Type definitions
│   └── selectors.ts     # State selectors
├── lib/                 # Utilities and helpers
│   ├── index.ts         # Public API exports
│   ├── utils.ts         # Utility functions
│   └── constants.ts     # Feature constants
└── api/                 # API integration
    ├── index.ts         # Public API exports
    ├── api.ts           # API calls
    └── types.ts         # API types
```
```

### 6. Документирование правил импорта

Заполните раздел "Import Rules" детальным описанием правил импорта:

```markdown
## Import Rules

### Strict Import Rules
1. **App layer** can import from any layer
2. **Pages layer** can import from widgets, features, entities, and shared
3. **Widgets layer** can import from features, entities, and shared
4. **Features layer** can import from entities and shared
5. **Entities layer** can import from shared only
6. **Shared layer** cannot import from any other layer

### Import Examples
```typescript
// ✅ Correct imports
// In a feature
import { UserCard } from '@/entities/user/ui/UserCard'
import { Button } from '@/shared/ui/button'
import { formatDate } from '@/shared/lib/utils'

// ❌ Incorrect imports
// In shared layer
import { UserCard } from '@/entities/user/ui/UserCard' // Not allowed

// In entities layer
import { authFeature } from '@/features/auth' // Not allowed
```
```

### 7. Документирование паттерна публичного API

Заполните раздел "Public API Pattern" детальным описанием паттерна публичного API:

```markdown
## Public API Pattern

Each slice should export a public API through an `index.ts` file:

```typescript
// features/auth/index.ts
export { LoginForm } from './ui/LoginForm'
export { useAuth } from './model/hooks/useAuth'
export { authApi } from './api/authApi'
export type { User } from './model/types'
```
```

### 8. Документирование соглашений по именованию

Заполните раздел "Naming Conventions" детальным описанием соглашений по именованию:

```markdown
## Naming Conventions

### Files and Folders
- **PascalCase** for components and types
- **camelCase** for functions and variables
- **kebab-case** for CSS modules and utilities
- **UPPER_SNAKE_CASE** for constants

### Examples
```
UserProfile.tsx          # Component
useUserProfile.ts        # Hook
user-profile.module.css  # CSS module
USER_ROLES.ts           # Constants
```
```

### 9. Документирование руководства по добавлению нового кода

Заполните раздел "Adding New Code" детальным описанием руководства по добавлению нового кода:

```markdown
## Adding New Code

### Adding a New Feature
1. Create feature folder in `src/features/`
2. Follow segment structure (ui, model, lib, api)
3. Create `index.ts` with public API exports
4. Document the feature in architecture docs
5. Update import rules if necessary

### Adding a New Entity
1. Create entity folder in `src/entities/`
2. Follow segment structure
3. Create `index.ts` with public API exports
4. Document the entity in architecture docs
5. Ensure independence from other entities

### Adding a New Widget
1. Create widget folder in `src/widgets/`
2. Compose features and entities
3. Create `index.ts` with public API exports
4. Document the widget in architecture docs

### Adding a New Page
1. Create page folder in `src/pages/`
2. Compose widgets and features
3. Handle routing and layout
4. Document the page in architecture docs
```

### 10. Документирование требований к документации

Заполните раздел "Documentation Requirements" детальным описанием требований к документации:

```markdown
## Documentation Requirements

### For Each New Slice
- **Purpose:** What does this slice do?
- **Dependencies:** What other slices does it depend on?
- **Public API:** What does it export?
- **Usage Examples:** How to use this slice?

### Architecture Documentation
- Update this document when adding new layers or changing structure
- Document any deviations from standard patterns
- Keep import rules up to date
```

### 11. Документирование лучших практик

Заполните раздел "Best Practices" детальным описанием лучших практик:

```markdown
## Best Practices

### Code Organization
- Keep slices small and focused
- Use meaningful names for slices and segments
- Follow consistent file naming conventions
- Group related functionality together

### State Management
- Use local state for component-specific data
- Use global state for cross-feature data
- Keep business logic in model segments
- Use selectors for derived state

### Performance
- Lazy load features when possible
- Use code splitting for large features
- Optimize bundle size with tree shaking
- Cache API responses appropriately

### Testing
- Test each segment independently
- Mock dependencies from other layers
- Test public APIs thoroughly
- Maintain good test coverage
```

### 12. Документирование руководства по миграции

Заполните раздел "Migration Guidelines" детальным описанием руководства по миграции:

```markdown
## Migration Guidelines

### From Monolithic Structure
1. Identify feature boundaries
2. Extract entities first
3. Move shared utilities
4. Refactor features
5. Update imports gradually
6. Test thoroughly at each step

### Common Pitfalls
- **Circular Dependencies:** Ensure proper layer hierarchy
- **Over-Engineering:** Don't create slices for simple components
- **Tight Coupling:** Keep slices loosely coupled
- **Inconsistent Naming:** Follow established conventions
```

### 13. Обновление метаданных документа

Обновите метаданные в конце документа:

```markdown
---

**Document Version:** 1.0  
**Last Updated:** [Current Date]  
**Next Review:** [Date + 2 weeks]
```

## Объяснение ключевых концепций

### Feature-Sliced Design (FSD)

Feature-Sliced Design - это методология организации кода для frontend-приложений, которая фокусируется на разделении кода по бизнес-доменам и уровням абстракции. Основные принципы:

1. **Слоистая архитектура** - код разделен на слои по уровню абстракции
2. **Бизнес-домены** - код организован вокруг бизнес-функций
3. **Изоляция** - слайсы независимы и могут разрабатываться отдельно
4. **Публичное API** - контролируемый интерфейс для взаимодействия между слайсами

### React Server Components и Server Actions в контексте FSD

Next.js 15.4.4 активно использует React Server Components (RSC) и Server Actions, что требует адаптации FSD архитектуры:

#### Интеграция React Server Components с FSD

1. **Маркировка серверных и клиентских компонентов:**
   ```typescript
   // src/entities/user/ui/UserProfile.tsx
   'use client'; // Клиентский компонент

   // src/entities/user/ui/UserCard.tsx
   // По умолчанию серверный компонент (без 'use client')
   ```

2. **Организация данных:**
   - Серверные компоненты могут напрямую получать данные из базы данных
   - Клиентские компоненты должны получать данные через пропсы или API

3. **Структура для серверных компонентов:**
   ```
   src/entities/user/
   ├── ui/
   │   ├── UserCard.tsx        # Серверный компонент
   │   └── UserProfile.tsx     # Клиентский компонент ('use client')
   ├── model/
   │   ├── types.ts
   │   └── store.ts            # Только для клиентских компонентов
   └── api/
       ├── server/             # Для серверных компонентов
       │   └── getUserById.ts
       └── client/             # Для клиентских компонентов
           └── userApi.ts
   ```

#### Интеграция Server Actions с FSD

1. **Размещение Server Actions:**
   ```typescript
   // src/entities/user/actions/updateUser.ts
   'use server';
   
   export async function updateUser(userId: string, data: UserUpdateData) {
     // Логика обновления пользователя
   }
   ```

2. **Структура для Server Actions:**
   ```
   src/entities/user/
   ├── ui/
   ├── model/
   ├── api/
   └── actions/                # Server Actions
       ├── createUser.ts
       ├── updateUser.ts
       └── deleteUser.ts
   ```

3. **Использование в компонентах:**
   ```typescript
   // src/features/user-profile/ui/UserProfileForm.tsx
   'use client';
   
   import { updateUser } from '@/entities/user/actions/updateUser';
   
   export function UserProfileForm() {
     async function handleSubmit(formData: FormData) {
       await updateUser(formData.get('userId'), {
         name: formData.get('name'),
         email: formData.get('email'),
       });
     }
     
     return (
       <form action={handleSubmit}>
         {/* ... */}
       </form>
     );
   }
   ```

Эти адаптации позволяют эффективно использовать современные возможности Next.js 15.4.4 в рамках архитектуры Feature-Sliced Design.

### Слои в FSD

1. **App** - инициализация приложения, глобальная конфигурация
2. **Pages** - композиция страниц из виджетов и фичей
3. **Widgets** - сложные UI-блоки, объединяющие несколько фичей
4. **Features** - бизнес-функциональность, доступная пользователю
5. **Entities** - бизнес-сущности и их логика
6. **Shared** - общие утилиты, компоненты и конфигурации

### Сегменты в FSD

1. **ui** - компоненты пользовательского интерфейса
2. **model** - бизнес-логика и управление состоянием
3. **lib** - утилиты и вспомогательные функции
4. **api** - взаимодействие с API

### Правила импорта

Правила импорта в FSD строго определены и следуют принципу односторонней зависимости:

1. Слои могут импортировать только из слоев ниже себя
2. Слой shared не может импортировать из других слоев
3. Слои app и pages могут импортировать из любых слоев

### Публичное API

Публичное API в FSD - это механизм контролируемого экспорта функциональности из слайса через файлы `index.ts`. Это позволяет:

1. Скрыть внутреннюю реализацию
2. Предоставить четкий интерфейс для использования
3. Контролировать, что доступно для импорта из других слайсов

## Дополнительные ресурсы

1. [Официальная документация Feature-Sliced Design](https://feature-sliced.design/)
2. [FSD: Архитектура Frontend-проектов](https://feature-sliced.design/docs/get-started/overview)
3. [FSD: Примеры реализации](https://feature-sliced.design/examples)
4. [FSD: Правила импорта](https://feature-sliced.design/docs/concepts/layers)
5. [FSD: Публичное API](https://feature-sliced.design/docs/concepts/public-api)
6. [FSD с React Server Components](https://github.com/feature-sliced/documentation/discussions/390)
7. [Next.js 15 документация по Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
8. [Next.js 15 документация по Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
9. [Адаптация FSD для современных React-приложений](https://github.com/feature-sliced/documentation/discussions/398)
10. [Примеры проектов на FSD с Next.js](https://github.com/feature-sliced/examples)

## Результат выполнения задачи

После выполнения этой задачи у вас будет:

1. Подробная документация по архитектуре проекта на основе FSD
2. Четкое описание структуры проекта и ответственности каждого слоя
3. Руководство по правилам импорта и соглашениям по именованию
4. Инструкции по добавлению нового кода в соответствии с FSD
5. Описание лучших практик и рекомендаций по работе с FSD

Эта документация послужит руководством для разработчиков, работающих над проектом, и поможет поддерживать архитектурную целостность кодовой базы.