# Dashboard Design Specifications

## Design Philosophy

Dashboard следует принципам современного административного интерфейса с акцентом на функциональность, производительность и доступность. Дизайн основан на существующей цветовой схеме приложения и компонентах shadcn/ui.

## Color Scheme & Theme

### Primary Colors
Используется существующая цветовая схема приложения, определенная в CSS переменных:

```css
/* Primary Colors */
--primary-50: 250 245 255;
--primary-100: 243 232 255;
--primary-200: 233 213 255;
--primary-300: 216 180 254;
--primary-400: 196 181 253;
--primary-500: 168 85 247;
--primary-600: 147 51 234;
--primary-700: 126 34 206;
--primary-800: 107 33 168;
--primary-900: 88 28 135;
--primary-950: 59 7 100;
```

### Semantic Colors
```css
/* Success Colors */
--success: 34 197 94; /* Green-500 */

/* Warning Colors */
--warning: 234 179 8; /* Yellow-500 */

/* Error Colors */
--error: 239 68 68; /* Red-500 */

/* Info Colors */
--info: 59 130 246; /* Blue-500 */
```

### Neutral Colors
```css
/* Background Colors */
--background: 0 0% 100%;
--card: 0 0% 100%;
--popover: 0 0% 100%;
--muted: 240 4.8% 95.9%;

/* Text Colors */
--foreground: 240 10% 3.9%;
--muted-foreground: 240 3.8% 46.1%;

/* Border Colors */
--border: 240 5.9% 90%;
--input: 240 5.9% 90%;
```

## Layout Structure

### Sidebar Design
```typescript
// Sidebar использует shadcn/ui sidebar компоненты
<Sidebar className="border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <SidebarHeader className="border-b">
    <div className="flex items-center gap-2 px-4 py-3">
      <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
    </div>
  </SidebarHeader>
  <SidebarContent className="px-3 py-4">
    {/* Navigation items */}
  </SidebarContent>
</Sidebar>
```

### Header Design
```typescript
// Header с breadcrumbs и действиями
<header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div className="flex items-center gap-2 px-4">
    <SidebarTrigger className="-ml-1" />
    <Separator orientation="vertical" className="mr-2 h-4" />
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Current Page</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  </div>
</header>
```

## Component Design Specifications

### 1. Data Table Component

```typescript
// src/shared/ui/dashboard/DataTable.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  pagination?: PaginationProps;
  filters?: FilterProps;
}

export function DataTable<T>({ data, columns, isLoading, pagination, filters }: DataTableProps<T>) {
  return (
    <div className="space-y-4">
      {/* Filters */}
      {filters && (
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <Input placeholder="Search..." className="max-w-sm" />
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="ml-2 text-muted-foreground">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow key={index} className="hover:bg-muted/50">
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.className}>
                      {column.render ? column.render(row) : row[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {pagination.from} to {pagination.to} of {pagination.total} results
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={pagination.currentPage === 1}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={pagination.currentPage === pagination.totalPages}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
```

### 2. Status Badge Component

```typescript
// src/shared/ui/dashboard/StatusBadge.tsx
import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/lib/utils';

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'approved' | 'rejected' | 'suspended' | 'banned';
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

const statusConfig = {
  active: { label: 'Active', className: 'bg-success/10 text-success border-success/20' },
  inactive: { label: 'Inactive', className: 'bg-muted text-muted-foreground' },
  pending: { label: 'Pending', className: 'bg-warning/10 text-warning border-warning/20' },
  approved: { label: 'Approved', className: 'bg-success/10 text-success border-success/20' },
  rejected: { label: 'Rejected', className: 'bg-error/10 text-error border-error/20' },
  suspended: { label: 'Suspended', className: 'bg-warning/10 text-warning border-warning/20' },
  banned: { label: 'Banned', className: 'bg-error/10 text-error border-error/20' },
};

export function StatusBadge({ status, variant = 'default' }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant={variant}
      className={cn(
        'font-medium',
        variant === 'default' && config.className
      )}
    >
      {config.label}
    </Badge>
  );
}
```

### 3. Stat Card Component

```typescript
// src/features/dashboard/ui/components/Analytics/StatCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
}

export function StatCard({ title, value, change, icon: Icon, trend }: StatCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {change !== undefined && (
          <p className={cn(
            "text-xs",
            trend === 'up' && "text-success",
            trend === 'down' && "text-error",
            trend === 'neutral' && "text-muted-foreground"
          )}>
            {trend === 'up' && '+'}{change}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}
```

### 4. Action Button Component

```typescript
// src/shared/ui/dashboard/ActionButton.tsx
import { Button } from '@/shared/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Eye, Shield } from 'lucide-react';

interface ActionButtonProps {
  actions: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: 'default' | 'destructive';
  }[];
}

export function ActionButton({ actions }: ActionButtonProps) {
  if (actions.length === 1) {
    const action = actions[0];
    return (
      <Button
        variant={action.variant || 'ghost'}
        size="sm"
        onClick={action.onClick}
        className="h-8 w-8 p-0"
      >
        {action.icon}
        <span className="sr-only">{action.label}</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map((action, index) => (
          <DropdownMenuItem
            key={index}
            onClick={action.onClick}
            className={action.variant === 'destructive' ? 'text-error' : ''}
          >
            {action.icon}
            <span className="ml-2">{action.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

## Typography

### Font Hierarchy
```css
/* Headings */
h1: text-3xl font-bold text-foreground
h2: text-2xl font-semibold text-foreground  
h3: text-xl font-semibold text-foreground
h4: text-lg font-medium text-foreground

/* Body Text */
p: text-sm text-foreground
span: text-sm text-muted-foreground

/* Labels */
label: text-sm font-medium text-foreground

/* Captions */
caption: text-xs text-muted-foreground
```

## Spacing System

### Consistent Spacing
```css
/* Spacing scale based on Tailwind CSS */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
```

### Component Spacing
```typescript
// Card spacing
<Card className="p-6"> {/* 24px padding */}

// Section spacing  
<section className="space-y-6"> {/* 24px between elements */}

// Form spacing
<form className="space-y-4"> {/* 16px between form elements */}

// Button spacing
<div className="flex items-center gap-2"> {/* 8px between buttons */}
```

## Interactive States

### Hover States
```css
/* Button hover */
.button:hover {
  background-color: hsl(var(--primary-600));
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

/* Card hover */
.card:hover {
  box-shadow: 0 10px 25px -3px rgb(0 0 0 / 0.1);
  transition: box-shadow 0.2s ease;
}

/* Table row hover */
.table-row:hover {
  background-color: hsl(var(--muted) / 0.5);
}
```

### Focus States
```css
/* Focus ring */
.focus-visible {
  outline: 2px solid hsl(var(--primary-500));
  outline-offset: 2px;
}

/* Input focus */
.input:focus {
  border-color: hsl(var(--primary-500));
  box-shadow: 0 0 0 1px hsl(var(--primary-500));
}
```

### Loading States
```typescript
// Skeleton loading
<div className="animate-pulse">
  <div className="h-4 bg-muted rounded w-3/4"></div>
  <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
</div>

// Spinner loading
<div className="flex items-center justify-center">
  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
  <span className="ml-2 text-muted-foreground">Loading...</span>
</div>
```

## Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### Responsive Layout
```typescript
// Sidebar responsive behavior
<Sidebar className="hidden md:block"> {/* Hidden on mobile, visible on desktop */}

// Grid responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

// Table responsive
<div className="overflow-x-auto"> {/* Horizontal scroll on small screens */}
  <Table className="min-w-full">
    {/* Table content */}
  </Table>
</div>
```

## Accessibility

### ARIA Labels
```typescript
// Proper labeling
<Button aria-label="Edit user">
  <Edit className="h-4 w-4" />
</Button>

// Screen reader support
<span className="sr-only">Loading data</span>

// Form labels
<Label htmlFor="email">Email Address</Label>
<Input id="email" aria-describedby="email-error" />
```

### Keyboard Navigation
```typescript
// Focus management
<Button onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    handleClick();
  }
}}>

// Skip links
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

### Color Contrast
```css
/* High contrast ratios */
--foreground: 240 10% 3.9%; /* Dark text on light background */
--background: 0 0% 100%;    /* Light background */

/* Status colors with sufficient contrast */
--success: 34 197 94;       /* Green with good contrast */
--error: 239 68 68;         /* Red with good contrast */
```

## Animation & Transitions

### Micro-interactions
```css
/* Smooth transitions */
.transition-all {
  transition: all 0.2s ease-in-out;
}

/* Hover animations */
.hover-lift:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}

/* Loading animations */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

## Dark Mode Support

### Dark Mode Colors
```css
/* Dark mode variables */
.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --card: 240 10% 3.9%;
  --popover: 240 10% 3.9%;
  --muted: 240 3.7% 15.9%;
  --muted-foreground: 240 5% 64.9%;
  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
}
```

### Dark Mode Components
```typescript
// Dark mode aware components
<Card className="bg-card text-card-foreground border-border">
  <CardContent className="p-6">
    {/* Content */}
  </CardContent>
</Card>
```

## Design Tokens

### Consistent Design System
```typescript
// Design tokens for consistent styling
const designTokens = {
  colors: {
    primary: 'hsl(var(--primary-600))',
    success: 'hsl(var(--success))',
    warning: 'hsl(var(--warning))',
    error: 'hsl(var(--error))',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
};
```

## Implementation Guidelines

### 1. Component Consistency
- Используйте только shadcn/ui компоненты
- Следуйте установленной цветовой схеме
- Придерживайтесь единого стиля отступов

### 2. Performance
- Используйте CSS-in-JS для динамических стилей
- Оптимизируйте анимации с помощью `transform` и `opacity`
- Избегайте layout thrashing

### 3. Accessibility
- Всегда добавляйте ARIA labels
- Обеспечивайте keyboard navigation
- Поддерживайте screen readers

### 4. Responsive Design
- Mobile-first подход
- Адаптивные grid layouts
- Гибкие компоненты

### 5. Dark Mode
- Используйте CSS переменные для цветов
- Тестируйте контрастность в обеих темах
- Обеспечивайте плавные переходы
