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

## Public API Pattern

Each slice should export a public API through an `index.ts` file:

```typescript
// features/auth/index.ts
export { LoginForm } from './ui/LoginForm'
export { useAuth } from './model/hooks/useAuth'
export { authApi } from './api/authApi'
export type { User } from './model/types'
```

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

## Feature: Authentication (NextAuth v5)

### Purpose
Обеспечить вход/выход пользователей, хранение сессий и предоставление роли `SUBSCRIBER` после первой аутентификации. Поддержка провайдера Google на MVP, с возможностью расширения до Apple/Facebook.

### Layer placement
- `shared/api/auth/auth.ts` – серверная конфигурация NextAuth (server-only), адаптер, провайдеры, callbacks
- `features/auth/ui/` – UI-компоненты входа/выхода, индикаторы состояния
- `features/auth/model/` – guards/селекторы роли, хелперы для проверки прав
- `features/auth/api/` – клиентские обёртки над `signIn/signOut`
- `entities/user/` – типы и публичный API пользователя
- `app/api/auth/[...nextauth]/route.ts` – хендлеры Auth.js (реэкспорт конфигурации из shared)
- `middleware.ts` – опциональные редиректы/защита маршрутов (RBAC)

### Public API examples
```ts
// features/auth/ui/index.ts
export { LoginButton } from './LoginButton'
export { LogoutButton } from './LogoutButton'

// features/auth/model/index.ts
export { requireRole, isAuthorized } from './guards'
export type { UserRole } from '@/entities/user/model/types'

// shared/api/auth/index.ts
export { auth } from './auth' // server-only
```

### Import rules
- В `widgets` можно использовать только публичный API `features/auth`
- `shared` не импортирует `features`/`entities`
- Конфигурация NextAuth должна быть изолирована в `shared/api/auth` и не содержать UI-логики

### Callbacks & Roles
- `session` callback добавляет `user.id` и `role`
- `events.createUser`/`linkAccount` присваивают роль `SUBSCRIBER` по умолчанию
- Guards (`requireRole`) используются в серверных действий/роут-хендлерах

### Middleware (optional)
- Для защищённых маршрутов (e.g., `/app/profile`, `/app/restricted/*`) выполняется проверка сессии и роли; неуспешная – редирект на страницу входа

### Testing
- Мок конфигурации провайдера; контрактные тесты guards; smoke-тесты на страницы входа/выхода

---

**Document Version:** 1.0  
**Last Updated:** [Current Date]  
**Next Review:** [Date + 2 weeks]
