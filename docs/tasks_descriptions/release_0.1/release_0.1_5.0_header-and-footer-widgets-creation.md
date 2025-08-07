# Задача 5.0: Создание виджетов Header и Footer

## Описание задачи

Разработка адаптивных виджетов Header (шапка) и Footer (подвал) для платформы христианской поэзии в соответствии с архитектурой Feature-Sliced Design (FSD). Виджеты должны обеспечивать удобную навигацию, отображать статус аутентификации пользователя и включать переключатель языков.

## Подзадачи

1. Создание адаптивного виджета Header с навигацией
2. Создание адаптивного виджета Footer с ссылками и информацией
3. Реализация адаптивного дизайна для виджетов Header и Footer
4. Добавление переключателя языков в виджет Header
5. Добавление отображения статуса аутентификации пользователя в виджет Header

## Технический контекст

### Используемые технологии

- Next.js 15.4.4 с App Router
- TypeScript
- React Server Components
- Tailwind CSS v4
- shadcn/ui для компонентов интерфейса
- Auth.js (next-auth v5 beta) для аутентификации
- FSD (Feature-Sliced Design) для архитектуры проекта

### Архитектурные требования

В соответствии с методологией Feature-Sliced Design, виджеты Header и Footer должны быть размещены в слое `widgets`. Они будут использовать компоненты из слоя `shared/ui` и интегрироваться с функциональностью из слоя `features` (например, аутентификация, переключение языков).

## Пошаговая инструкция по реализации

### 1. Создание структуры директорий

Сначала необходимо создать соответствующую структуру директорий для виджетов Header и Footer:

```bash
mkdir -p src/widgets/header
mkdir -p src/widgets/footer
```

### 2. Реализация виджета Header

#### 2.1. Создание базовой структуры Header

Создайте файл `src/widgets/header/ui/Header.tsx`:

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/shared/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/shared/ui/sheet';
import { Menu } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Главная', href: '/' },
  { label: 'Стихи', href: '/poems' },
  { label: 'Категории', href: '/categories' },
  { label: 'О нас', href: '/about' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-xl">
            Christian Poetry
          </Link>
        </div>
        
        {/* Навигация для десктопа */}
        <nav className="hidden md:flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.href ? 'text-foreground' : 'text-foreground/60'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        
        {/* Мобильная навигация */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Открыть меню</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="md:hidden">
            <nav className="flex flex-col gap-4 mt-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.href ? 'text-foreground' : 'text-foreground/60'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
```

#### 2.2. Добавление отображения статуса аутентификации

Модифицируйте виджет Header, добавив компонент для отображения статуса аутентификации. Сначала создайте компонент `UserAuthStatus.tsx`:

```tsx
'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { User, LogOut } from 'lucide-react';

export function UserAuthStatus() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') {
    return <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />;
  }
  
  if (status === 'authenticated' && session?.user) {
    const initials = session.user.name
      ? session.user.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
      : 'U';
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src={session.user.image || ''} alt={session.user.name || 'Пользователь'} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" />
              <span>Профиль</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/api/auth/signout">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Выйти</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  
  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="ghost" size="sm">
        <Link href="/api/auth/signin">Войти</Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/register">Регистрация</Link>
      </Button>
    </div>
  );
}
```

#### 2.3. Создание переключателя языков

Создайте компонент `LanguageSwitcher.tsx`:

```tsx
'use client';

import { useState, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Button } from '@/shared/ui/button';
import { Globe } from 'lucide-react';

interface Language {
  code: string;
  name: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'ru', name: 'Русский' },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  
  // Определяем текущий язык из пути
  const currentLanguageCode = pathname.split('/')[1] || 'ru';
  const currentLanguage = languages.find(lang => lang.code === currentLanguageCode) || languages[0];
  
  const handleLanguageChange = (languageCode: string) => {
    setIsOpen(false);
    
    // Переключение языка путем изменения маршрута
    startTransition(() => {
      const newPath = pathname.replace(/^\/[a-z]{2}/, '') || '/';
      router.push(`/${languageCode}${newPath}`);
    });
  };
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isPending}>
          <Globe className="h-5 w-5" />
          <span className="sr-only">Переключить язык</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={currentLanguageCode === language.code ? 'bg-muted' : ''}
          >
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

#### 2.4. Интеграция компонентов в Header

Обновите файл `Header.tsx`, включив в него созданные компоненты:

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/shared/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/shared/ui/sheet';
import { Menu } from 'lucide-react';
import { UserAuthStatus } from './UserAuthStatus';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Главная', href: '/' },
  { label: 'Стихи', href: '/poems' },
  { label: 'Категории', href: '/categories' },
  { label: 'О нас', href: '/about' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-xl">
            Christian Poetry
          </Link>
        </div>
        
        {/* Навигация для десктопа */}
        <nav className="hidden md:flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.href ? 'text-foreground' : 'text-foreground/60'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        
        {/* Правая часть шапки */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <UserAuthStatus />
          
          {/* Мобильная навигация */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Открыть меню</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="md:hidden">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      pathname === item.href ? 'text-foreground' : 'text-foreground/60'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
```

#### 2.5. Создание индексного файла для экспорта

Создайте файл `src/widgets/header/index.ts`:

```typescript
export { Header } from './ui/Header';
```

### 3. Реализация виджета Footer

#### 3.1. Создание базовой структуры Footer

Создайте файл `src/widgets/footer/ui/Footer.tsx`:

```tsx
import Link from 'next/link';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: 'О проекте',
    links: [
      { label: 'О нас', href: '/about' },
      { label: 'Контакты', href: '/contacts' },
      { label: 'Правила', href: '/rules' },
    ],
  },
  {
    title: 'Навигация',
    links: [
      { label: 'Стихи', href: '/poems' },
      { label: 'Категории', href: '/categories' },
      { label: 'Авторы', href: '/authors' },
    ],
  },
  {
    title: 'Правовая информация',
    links: [
      { label: 'Условия использования', href: '/terms' },
      { label: 'Политика конфиденциальности', href: '/privacy' },
      { label: 'Правила публикации', href: '/publishing-rules' },
    ],
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-muted py-8 border-t">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h3 className="text-sm font-medium">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Christian Poetry. Все права защищены.
          </p>
          <div className="flex gap-4">
            <Link 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Facebook
            </Link>
            <Link 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Twitter
            </Link>
            <Link 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Instagram
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

#### 3.2. Создание индексного файла для экспорта

Создайте файл `src/widgets/footer/index.ts`:

```typescript
export { Footer } from './ui/Footer';
```

### 4. Интеграция виджетов в макет приложения

Обновите файл `src/app/layout.tsx`, чтобы включить в него виджеты Header и Footer:

```tsx
import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { SessionProvider } from '@/shared/providers/SessionProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata = {
  title: 'Christian Poetry',
  description: 'Платформа для публикации и чтения христианской поэзии',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <SessionProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
```

## Адаптивный дизайн

Виджеты Header и Footer уже имеют базовую адаптивность благодаря использованию Tailwind CSS. Для Header используется мобильное меню, которое появляется на маленьких экранах, а для Footer используется изменение расположения элементов с помощью Grid.

## Альтернативные подходы

### 1. Использование серверных компонентов

**Плюсы:**
- Уменьшение размера JavaScript-бандла
- Улучшение SEO
- Более быстрая загрузка страницы

**Минусы:**
- Ограниченная интерактивность
- Невозможность использования хуков React (useState, useEffect и т.д.)
- Сложности с обработкой событий пользователя

### 2. Использование глобального состояния для управления навигацией

**Плюсы:**
- Централизованное управление состоянием навигации
- Возможность управления навигацией из любого компонента

**Минусы:**
- Излишняя сложность для простой навигации
- Дополнительные зависимости (Redux, Zustand и т.д.)
- Усложнение кодовой базы

### 3. Использование отдельных компонентов для мобильной и десктопной версий

**Плюсы:**
- Более специализированный код для каждой версии
- Потенциально более оптимизированный пользовательский опыт

**Минусы:**
- Дублирование кода
- Сложности с поддержкой
- Несоответствие между версиями

## Рекомендуемый подход

Рекомендуется использовать подход, описанный в пошаговой инструкции, так как он:

1. Соответствует архитектуре Feature-Sliced Design
2. Использует современные возможности Next.js 15.4.4
3. Обеспечивает адаптивность с помощью Tailwind CSS
4. Разделяет ответственность между компонентами
5. Обеспечивает хорошую поддержку и расширяемость

## Тестирование

### Ручное тестирование

1. Проверьте отображение Header и Footer на разных устройствах (мобильные, планшеты, десктопы)
2. Убедитесь, что навигация работает корректно
3. Проверьте работу переключателя языков
4. Проверьте отображение статуса аутентификации для разных состояний (неаутентифицированный пользователь, аутентифицированный пользователь, загрузка)
5. Проверьте, что все ссылки в Footer ведут на правильные страницы

### Автоматизированное тестирование

Для автоматизированного тестирования можно создать тесты с использованием Jest и React Testing Library:

```tsx
// src/widgets/header/ui/Header.test.tsx
import { render, screen } from '@testing-library/react';
import { Header } from './Header';

// Мокаем необходимые хуки и компоненты
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

jest.mock('./UserAuthStatus', () => ({
  UserAuthStatus: () => <div data-testid="user-auth-status">User Auth Status</div>,
}));

jest.mock('./LanguageSwitcher', () => ({
  LanguageSwitcher: () => <div data-testid="language-switcher">Language Switcher</div>,
}));

describe('Header', () => {
  it('renders logo and navigation links', () => {
    render(<Header />);
    
    // Проверяем наличие логотипа
    expect(screen.getByText('Christian Poetry')).toBeInTheDocument();
    
    // Проверяем наличие навигационных ссылок
    expect(screen.getByText('Главная')).toBeInTheDocument();
    expect(screen.getByText('Стихи')).toBeInTheDocument();
    expect(screen.getByText('Категории')).toBeInTheDocument();
    expect(screen.getByText('О нас')).toBeInTheDocument();
    
    // Проверяем наличие компонентов UserAuthStatus и LanguageSwitcher
    expect(screen.getByTestId('user-auth-status')).toBeInTheDocument();
    expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
  });
});
```

## Зависимости от предыдущих задач

Эта задача зависит от следующих предыдущих задач:

1. Настройка Next.js с App Router
2. Настройка Tailwind CSS
3. Настройка shadcn/ui
4. Настройка Auth.js для аутентификации
5. Настройка интернационализации (i18n)

## Лучшие практики

1. **Компонентный подход:** Разделение функциональности на небольшие, переиспользуемые компоненты
2. **Семантическая верстка:** Использование семантических тегов HTML (header, footer, nav)
3. **Доступность:** Добавление атрибутов aria и sr-only для улучшения доступности
4. **Адаптивный дизайн:** Использование Tailwind CSS для создания адаптивного интерфейса
5. **Типизация:** Использование TypeScript для улучшения качества кода
6. **Соответствие FSD:** Соблюдение принципов Feature-Sliced Design для организации кода

## Заключение

В результате выполнения задачи будут созданы адаптивные виджеты Header и Footer, которые обеспечат удобную навигацию по платформе, отображение статуса аутентификации пользователя и возможность переключения языков. Виджеты будут соответствовать архитектуре Feature-Sliced Design и использовать современные возможности Next.js, TypeScript и Tailwind CSS.

---

**Версия документа:** 1.0  
**Последнее обновление:** 2025-07-17