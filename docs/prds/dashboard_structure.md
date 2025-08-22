# Dashboard Structure & FSD Architecture

## FSD Architecture Decision

### Entity vs Feature Approach

**Решение: Dashboard будет реализован как FEATURE, а не как отдельный entity.**

#### Обоснование:
1. **Dashboard не является бизнес-сущностью** - это интерфейс для управления существующими entities
2. **Переиспользование существующих entities** - dashboard использует User, Poem, Category, Statistics
3. **Соблюдение FSD принципов** - dashboard зависит от entities, но не является entity сам по себе

## Proposed FSD Structure

```
src/
├── features/
│   └── dashboard/                    # Dashboard feature
│       ├── ui/                      # UI Components
│       │   ├── DashboardLayout.tsx  # Main dashboard layout
│       │   ├── DashboardSidebar.tsx # Sidebar navigation
│       │   ├── DashboardHeader.tsx  # Header with breadcrumbs
│       │   ├── DashboardContent.tsx # Main content area
│       │   ├── components/          # Dashboard-specific components
│       │   │   ├── UserManagement/
│       │   │   │   ├── UserList.tsx
│       │   │   │   ├── UserCard.tsx
│       │   │   │   ├── UserDetails.tsx
│       │   │   │   └── RoleSelector.tsx
│       │   │   ├── ContentManagement/
│       │   │   │   ├── PoemList.tsx
│       │   │   │   ├── CategoryManager.tsx
│       │   │   │   ├── TagManager.tsx
│       │   │   │   └── ModerationQueue.tsx
│       │   │   ├── Analytics/
│       │   │   │   ├── PlatformStats.tsx
│       │   │   │   ├── UserAnalytics.tsx
│       │   │   │   ├── ContentAnalytics.tsx
│       │   │   │   └── Charts/
│       │   │   └── Settings/
│       │   │       ├── SystemSettings.tsx
│       │   │       ├── SecuritySettings.tsx
│       │   │       └── ContentSettings.tsx
│       │   └── index.ts
│       ├── model/                   # Business Logic
│       │   ├── types.ts            # Dashboard-specific types
│       │   ├── store.ts            # State management
│       │   ├── selectors.ts        # Data selectors
│       │   └── index.ts
│       ├── lib/                    # Utilities
│       │   ├── dashboardUtils.ts   # Dashboard utilities
│       │   ├── permissions.ts      # Permission checks
│       │   ├── analytics.ts        # Analytics helpers
│       │   └── index.ts
│       ├── api/                    # API Integration
│       │   ├── dashboardApi.ts     # Dashboard API calls
│       │   ├── userManagement.ts   # User management API
│       │   ├── contentManagement.ts # Content management API
│       │   └── index.ts
│       └── index.ts                # Public API
├── pages/                          # Dashboard pages
│   └── dashboard/
│       ├── layout.tsx              # Dashboard layout wrapper
│       ├── page.tsx                # Dashboard home
│       ├── users/
│       │   ├── page.tsx            # User management
│       │   └── [id]/
│       │       └── page.tsx        # User details
│       ├── content/
│       │   ├── page.tsx            # Content overview
│       │   ├── poems/
│       │   │   ├── page.tsx        # Poem management
│       │   │   └── [id]/
│       │   │       └── page.tsx    # Poem details
│       │   ├── categories/
│       │   │   ├── page.tsx        # Category management
│       │   │   └── [id]/
│       │   │       └── page.tsx    # Category details
│       │   └── tags/
│       │       └── page.tsx        # Tag management
│       ├── moderation/
│       │   ├── page.tsx            # Moderation queue
│       │   ├── reports/
│       │   │   └── page.tsx        # User reports
│       │   └── requests/
│       │       └── page.tsx        # Author requests
│       ├── analytics/
│       │   ├── page.tsx            # Analytics overview
│       │   ├── users/
│       │   │   └── page.tsx        # User analytics
│       │   ├── content/
│       │   │   └── page.tsx        # Content analytics
│       │   └── platform/
│       │       └── page.tsx        # Platform analytics
│       └── settings/
│           ├── page.tsx            # Settings overview
│           ├── system/
│           │   └── page.tsx        # System settings
│           ├── security/
│           │   └── page.tsx        # Security settings
│           └── content/
│               └── page.tsx        # Content settings
└── shared/
    └── ui/
        └── dashboard/              # Shared dashboard components
            ├── DataTable.tsx       # Reusable data table
            ├── FilterPanel.tsx     # Filter panel component
            ├── StatusBadge.tsx     # Status indicators
            ├── ActionButton.tsx    # Action buttons
            └── index.ts
```

## Component Structure & Code Examples

### 1. Dashboard Layout Component

```typescript
// src/features/dashboard/ui/DashboardLayout.tsx
import { SidebarProvider } from '@/shared/ui/sidebar';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';
import { DashboardContent } from './DashboardContent';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <div className="flex flex-col flex-1">
        <DashboardHeader />
        <DashboardContent>
          {children}
        </DashboardContent>
      </div>
    </SidebarProvider>
  );
}
```

### 2. Dashboard Sidebar Component

```typescript
// src/features/dashboard/ui/DashboardSidebar.tsx
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/shared/ui/sidebar';
import { useDashboardPermissions } from '../lib/permissions';
import { dashboardNavigation } from '../model/constants';

export function DashboardSidebar() {
  const { canAccessUsers, canAccessContent, canAccessAnalytics, canAccessSettings } = useDashboardPermissions();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4">
          <h2 className="text-lg font-semibold">Dashboard</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {/* Overview */}
          <SidebarMenuItem>
            <SidebarMenuButton href="/dashboard" icon="Home">
              Overview
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* User Management */}
          {canAccessUsers && (
            <SidebarMenuItem>
              <SidebarMenuButton href="/dashboard/users" icon="Users">
                User Management
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {/* Content Management */}
          {canAccessContent && (
            <SidebarMenuItem>
              <SidebarMenuButton href="/dashboard/content" icon="FileText">
                Content Management
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {/* Moderation */}
          <SidebarMenuItem>
            <SidebarMenuButton href="/dashboard/moderation" icon="Shield">
              Moderation
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Analytics */}
          {canAccessAnalytics && (
            <SidebarMenuItem>
              <SidebarMenuButton href="/dashboard/analytics" icon="BarChart3">
                Analytics
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {/* Settings */}
          {canAccessSettings && (
            <SidebarMenuItem>
              <SidebarMenuButton href="/dashboard/settings" icon="Settings">
                Settings
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
```

### 3. User Management Components

```typescript
// src/features/dashboard/ui/components/UserManagement/UserList.tsx
import { useState } from 'react';
import { useUsers } from '../../api/userManagement';
import { DataTable } from '@/shared/ui/dashboard/DataTable';
import { FilterPanel } from '@/shared/ui/dashboard/FilterPanel';
import { UserCard } from './UserCard';

export function UserList() {
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    search: '',
  });

  const { users, isLoading, error } = useUsers(filters);

  return (
    <div className="space-y-4">
      <FilterPanel filters={filters} onFiltersChange={setFilters} />
      <DataTable
        data={users}
        isLoading={isLoading}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Role' },
          { key: 'status', label: 'Status' },
          { key: 'createdAt', label: 'Joined' },
          { key: 'actions', label: 'Actions' },
        ]}
        renderRow={(user) => <UserCard user={user} />}
      />
    </div>
  );
}
```

### 4. Analytics Components

```typescript
// src/features/dashboard/ui/components/Analytics/PlatformStats.tsx
import { usePlatformStats } from '../../api/analytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { StatCard } from './StatCard';

export function PlatformStats() {
  const { stats, isLoading } = usePlatformStats();

  if (isLoading) {
    return <div>Loading stats...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Users"
        value={stats.totalUsers}
        change={stats.userGrowth}
        icon="Users"
      />
      <StatCard
        title="Total Poems"
        value={stats.totalPoems}
        change={stats.poemGrowth}
        icon="FileText"
      />
      <StatCard
        title="Active Categories"
        value={stats.activeCategories}
        change={stats.categoryGrowth}
        icon="Folder"
      />
      <StatCard
        title="Pending Moderation"
        value={stats.pendingModeration}
        change={stats.moderationChange}
        icon="Clock"
      />
    </div>
  );
}
```

### 5. Dashboard API Integration

```typescript
// src/features/dashboard/api/dashboardApi.ts
import { userRepository } from '@/entities/user';
import { poemRepository } from '@/entities/poem';
import { categoryRepository } from '@/entities/category';

export const dashboardApi = {
  // User Management
  getUsers: async (filters: UserFilters) => {
    return userRepository.findAll({
      where: filters,
      orderBy: { createdAt: 'desc' },
    });
  },

  updateUserRole: async (userId: string, role: Role) => {
    return userRepository.update(userId, { role });
  },

  // Content Management
  getPoems: async (filters: PoemFilters) => {
    return poemRepository.findAll({
      where: filters,
      include: { author: true, category: true },
    });
  },

  moderatePoem: async (poemId: string, status: ContentApprovalStatus) => {
    return poemRepository.update(poemId, { status });
  },

  // Analytics
  getPlatformStats: async () => {
    const [users, poems, categories] = await Promise.all([
      userRepository.findAll(),
      poemRepository.findAll(),
      categoryRepository.findAll(),
    ]);

    return {
      totalUsers: users.length,
      totalPoems: poems.length,
      activeCategories: categories.filter(c => c.isActive).length,
      // ... other stats
    };
  },
};
```

### 6. Dashboard Types

```typescript
// src/features/dashboard/model/types.ts
import type { User, Poem, Category } from '@/entities/user';
import type { Role, UserAccountStatus, ContentApprovalStatus } from '@/generated/prisma';

// Dashboard-specific types
export interface DashboardStats {
  totalUsers: number;
  totalPoems: number;
  activeCategories: number;
  pendingModeration: number;
  userGrowth: number;
  poemGrowth: number;
  categoryGrowth: number;
  moderationChange: number;
}

export interface UserFilters {
  role?: Role;
  status?: UserAccountStatus;
  search?: string;
  createdAt?: {
    gte?: Date;
    lte?: Date;
  };
}

export interface PoemFilters {
  status?: ContentApprovalStatus;
  authorId?: string;
  categoryId?: string;
  search?: string;
}

export interface DashboardPermissions {
  canAccessUsers: boolean;
  canAccessContent: boolean;
  canAccessAnalytics: boolean;
  canAccessSettings: boolean;
  canModerateContent: boolean;
  canManageRoles: boolean;
}
```

### 7. Dashboard Permissions

```typescript
// src/features/dashboard/lib/permissions.ts
import { useSession } from 'next-auth/react';
import type { DashboardPermissions } from '../model/types';

export function useDashboardPermissions(): DashboardPermissions {
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  return {
    canAccessUsers: userRole === 'ADMIN',
    canAccessContent: ['ADMIN', 'MODERATOR'].includes(userRole || ''),
    canAccessAnalytics: userRole === 'ADMIN',
    canAccessSettings: userRole === 'ADMIN',
    canModerateContent: ['ADMIN', 'MODERATOR'].includes(userRole || ''),
    canManageRoles: userRole === 'ADMIN',
  };
}
```

## Page Structure Examples

### Dashboard Home Page

```typescript
// src/pages/dashboard/page.tsx
import { DashboardLayout } from '@/features/dashboard/ui/DashboardLayout';
import { PlatformStats } from '@/features/dashboard/ui/components/Analytics/PlatformStats';
import { RecentActivity } from '@/features/dashboard/ui/components/RecentActivity';
import { QuickActions } from '@/features/dashboard/ui/components/QuickActions';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <QuickActions />
        </div>
        
        <PlatformStats />
        
        <div className="grid gap-6 md:grid-cols-2">
          <RecentActivity />
          <div className="bg-muted/50 min-h-[400px] rounded-xl" />
        </div>
      </div>
    </DashboardLayout>
  );
}
```

### User Management Page

```typescript
// src/pages/dashboard/users/page.tsx
import { DashboardLayout } from '@/features/dashboard/ui/DashboardLayout';
import { UserList } from '@/features/dashboard/ui/components/UserManagement/UserList';
import { Breadcrumb } from '@/shared/ui/breadcrumb';

export default function UsersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>User Management</BreadcrumbPage>
              </BreadcrumbItem>
            </Breadcrumb>
            <h1 className="text-3xl font-bold mt-2">User Management</h1>
          </div>
        </div>
        
        <UserList />
      </div>
    </DashboardLayout>
  );
}
```

## Integration with Existing Entities

### Entity Usage in Dashboard

```typescript
// Dashboard использует существующие entities:
import { userRepository } from '@/entities/user';
import { poemRepository } from '@/entities/poem';
import { categoryRepository } from '@/entities/category';
import { statisticsRepository } from '@/entities/statistics';

// Dashboard добавляет специфичную логику поверх entities:
export const dashboardApi = {
  // Расширяет функциональность entities для административных задач
  bulkUpdateUserRoles: async (userIds: string[], role: Role) => {
    return Promise.all(
      userIds.map(id => userRepository.update(id, { role }))
    );
  },

  getModerationQueue: async () => {
    return poemRepository.findAll({
      where: { status: 'PENDING' },
      include: { author: true, category: true },
    });
  },
};
```

## Benefits of This Structure

### 1. FSD Compliance
- ✅ Соблюдение принципов FSD
- ✅ Четкое разделение ответственности
- ✅ Переиспользование существующих entities

### 2. Scalability
- ✅ Легкое добавление новых функций
- ✅ Модульная архитектура
- ✅ Изолированные компоненты

### 3. Maintainability
- ✅ Понятная структура
- ✅ Типизированный код
- ✅ Разделение UI и бизнес-логики

### 4. Performance
- ✅ Ленивая загрузка компонентов
- ✅ Оптимизированные запросы
- ✅ Кэширование данных
