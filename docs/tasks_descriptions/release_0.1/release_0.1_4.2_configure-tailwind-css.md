# Задача 4.2: Настройка Tailwind CSS с пользовательскими переменными

## Описание задачи

Настройка и конфигурация Tailwind CSS v4 для проекта с добавлением пользовательских переменных, соответствующих дизайн-системе проекта. Интеграция с компонентами shadcn/ui и обеспечение поддержки темной/светлой темы.

## Необходимые технологии

- Tailwind CSS v4
- Next.js 15.4.4
- TypeScript
- shadcn/ui
- next-themes v0.4.6
- Feature-Sliced Design (FSD)

## Подробное руководство по выполнению

### 1. Установка и базовая настройка Tailwind CSS v4

Согласно package.json, в проекте уже установлен Tailwind CSS v4. Если по каким-то причинам его нужно переустановить, выполните следующие команды:

```bash
npm install -D tailwindcss@4
```

Для инициализации конфигурационных файлов:

```bash
npx tailwindcss init -p
```

Эти команды:
- Устанавливают Tailwind CSS v4 (который теперь включает PostCSS и autoprefixer по умолчанию)
- Создают файлы конфигурации `tailwind.config.js` и `postcss.config.js`

#### Альтернативные подходы

1. **Использование Tailwind CSS v3**
   ```bash
   npm install -D tailwindcss@3 postcss autoprefixer
   npx tailwindcss init -p
   ```
   
   **Плюсы:**
   - Более стабильная версия с большим количеством обучающих материалов
   - Лучшая совместимость с существующими плагинами
   
   **Минусы:**
   - Отсутствие новых функций Tailwind CSS v4
   - Менее оптимизированная производительность
   
2. **Использование CSS-in-JS решений (styled-components, emotion)**
   ```bash
   npm install styled-components
   ```
   
   **Плюсы:**
   - Более привычный для React-разработчиков синтаксис
   - Динамические стили на основе пропсов
   
   **Минусы:**
   - Больший размер бандла
   - Хуже производительность
   - Не соответствует требованиям проекта по использованию Tailwind CSS

**Почему рекомендуется Tailwind CSS v4:**
- Соответствует требованиям проекта (указан в package.json)
- Лучшая производительность и меньший размер бандла
- Встроенная поддержка CSS переменных
- Лучшая интеграция с Next.js 15.4.4
- Совместимость с компонентами shadcn/ui

### 2. Настройка конфигурации Tailwind CSS v4

Обновите файл `tailwind.config.js` для добавления пользовательских переменных и настройки. Tailwind CSS v4 имеет некоторые отличия в синтаксисе от предыдущих версий:

```javascript
// tailwind.config.js
import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/widgets/**/*.{js,ts,jsx,tsx}',
    './src/features/**/*.{js,ts,jsx,tsx}',
    './src/entities/**/*.{js,ts,jsx,tsx}',
    './src/shared/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Основная палитра
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          50: "var(--primary-50)",
          100: "var(--primary-100)",
          200: "var(--primary-200)",
          300: "var(--primary-300)",
          400: "var(--primary-400)",
          500: "var(--primary-500)",
          600: "var(--primary-600)",
          700: "var(--primary-700)",
          800: "var(--primary-800)",
          900: "var(--primary-900)",
          950: "var(--primary-950)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
          50: "var(--secondary-50)",
          100: "var(--secondary-100)",
          200: "var(--secondary-200)",
          300: "var(--secondary-300)",
          400: "var(--secondary-400)",
          500: "var(--secondary-500)",
          600: "var(--secondary-600)",
          700: "var(--secondary-700)",
          800: "var(--secondary-800)",
          900: "var(--secondary-900)",
          950: "var(--secondary-950)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        
        // Нейтральные цвета
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        popover: "var(--popover)",
        "popover-foreground": "var(--popover-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        
        // Семантические цвета
        success: {
          DEFAULT: "var(--success)",
          foreground: "var(--success-foreground)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          foreground: "var(--warning-foreground)",
        },
        error: {
          DEFAULT: "var(--error)",
          foreground: "var(--error-foreground)",
        },
        info: {
          DEFAULT: "var(--info)",
          foreground: "var(--info-foreground)",
        },
        
        // Границы и разделители
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        // Основной шрифт для UI элементов
        sans: ["var(--font-sans)", ...fontFamily.sans],
        // Шрифт для поэзии (с засечками)
        serif: ["var(--font-serif)", ...fontFamily.serif],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '80ch',
            color: 'var(--foreground)',
            a: {
              color: 'var(--primary)',
              '&:hover': {
                color: 'var(--primary-600)',
              },
            },
            h1: {
              fontFamily: 'var(--font-serif)',
            },
            h2: {
              fontFamily: 'var(--font-serif)',
            },
            h3: {
              fontFamily: 'var(--font-serif)',
            },
            blockquote: {
              borderLeftColor: 'var(--primary-200)',
              color: 'var(--muted-foreground)',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    // В Tailwind CSS v4 плагины импортируются по-другому
    import("tailwindcss-animate"),
    import("@tailwindcss/typography"),
  ],
};
```

#### Ключевые отличия Tailwind CSS v4 от v3:

1. Использование ESM синтаксиса (`import`/`export` вместо `require`/`module.exports`)
2. Изменения в импорте плагинов
3. Улучшенная производительность
4. Новые функции и API

#### Альтернативные подходы к конфигурации

1. **Использование CommonJS синтаксиса (для совместимости со старыми проектами)**
   ```javascript
   // tailwind.config.js
   const { fontFamily } = require("tailwindcss/defaultTheme");
   
   /** @type {import('tailwindcss').Config} */
   module.exports = {
     // конфигурация...
   }
   ```
   
   **Плюсы:**
   - Совместимость с проектами, не поддерживающими ESM
   - Более привычный синтаксис для разработчиков, знакомых с Tailwind CSS v3
   
   **Минусы:**
   - Не соответствует современным стандартам JavaScript
   - Может вызвать проблемы совместимости с Tailwind CSS v4
   
2. **Использование отдельного файла для темы**
   ```javascript
   // theme.js
   export const theme = {
     colors: { /* ... */ },
     // другие настройки темы
   };
   
   // tailwind.config.js
   import { theme } from './theme.js';
   
   export default {
     theme,
     // другие настройки
   };
   ```
   
   **Плюсы:**
   - Лучшая организация кода при сложной теме
   - Возможность повторного использования темы в других местах
   
   **Минусы:**
   - Дополнительные файлы и сложность
   - Может усложнить отладку

**Почему рекомендуется подход с ESM и встроенной темой:**
- Соответствует современным стандартам JavaScript
- Рекомендуется официальной документацией Tailwind CSS v4
- Лучшая интеграция с Next.js 15.4.4
- Более простая структура проекта
- Лучшая поддержка Tree Shaking
```

### 3. Создание файла с CSS-переменными

Создайте файл для определения CSS-переменных в соответствии с дизайн-системой проекта:

```typescript
// src/shared/styles/theme.css

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Основные цвета */
    --primary: 221 83% 41%; /* #1e40af - Deep blue */
    --primary-50: 221 100% 96%;
    --primary-100: 221 96% 91%;
    --primary-200: 221 94% 86%;
    --primary-300: 221 90% 76%;
    --primary-400: 221 87% 61%;
    --primary-500: 221 83% 53%;
    --primary-600: 221 83% 41%; /* #1e40af - Base */
    --primary-700: 221 83% 34%;
    --primary-800: 221 83% 28%;
    --primary-900: 221 83% 23%;
    --primary-950: 221 83% 14%;
    --primary-foreground: 210 40% 98%;

    --secondary: 35 92% 52%; /* #f59e0b - Warm gold */
    --secondary-50: 35 100% 96%;
    --secondary-100: 35 97% 90%;
    --secondary-200: 35 96% 82%;
    --secondary-300: 35 94% 70%;
    --secondary-400: 35 93% 62%;
    --secondary-500: 35 92% 52%; /* #f59e0b - Base */
    --secondary-600: 35 92% 42%;
    --secondary-700: 35 92% 34%;
    --secondary-800: 35 92% 28%;
    --secondary-900: 35 92% 23%;
    --secondary-950: 35 92% 14%;
    --secondary-foreground: 210 40% 98%;

    --accent: 160 84% 39%; /* #10b981 - Soft green */
    --accent-foreground: 210 40% 98%;

    /* Нейтральные цвета */
    --background: 0 0% 98%; /* #fafafa - Off-white */
    --foreground: 215 28% 17%; /* #1f2937 - Dark gray */

    /* Компоненты */
    --card: 0 0% 100%;
    --card-foreground: 215 28% 17%;
    --popover: 0 0% 100%;
    --popover-foreground: 215 28% 17%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215 16% 47%;

    /* Семантические цвета */
    --success: 160 84% 39%; /* #10b981 - Green */
    --success-foreground: 210 40% 98%;
    --warning: 35 92% 52%; /* #f59e0b - Orange */
    --warning-foreground: 210 40% 98%;
    --error: 0 84% 60%; /* #ef4444 - Red */
    --error-foreground: 210 40% 98%;
    --info: 214 95% 60%; /* #3b82f6 - Blue */
    --info-foreground: 210 40% 98%;

    /* Границы и разделители */
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221 83% 41%;

    /* Радиус скругления */
    --radius: 0.5rem;

    /* Шрифты */
    --font-sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
    --font-serif: Georgia, Merriweather, Cambria, "Times New Roman", Times, serif;
  }

  .dark {
    /* Основные цвета (темная тема) */
    --primary: 221 83% 61%;
    --primary-foreground: 210 40% 98%;

    --secondary: 35 92% 52%;
    --secondary-foreground: 210 40% 98%;

    --accent: 160 84% 39%;
    --accent-foreground: 210 40% 98%;

    /* Нейтральные цвета (темная тема) */
    --background: 215 28% 9%;
    --foreground: 210 40% 98%;

    /* Компоненты (темная тема) */
    --card: 215 28% 12%;
    --card-foreground: 210 40% 98%;
    --popover: 215 28% 12%;
    --popover-foreground: 210 40% 98%;
    --muted: 215 28% 17%;
    --muted-foreground: 215 20% 65.1%;

    /* Границы и разделители (темная тема) */
    --border: 215 28% 17%;
    --input: 215 28% 17%;
    --ring: 221 83% 61%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
  
  /* Стили для поэзии */
  .poetry-content {
    @apply font-serif leading-relaxed;
  }
  
  /* Стили для заголовков */
  h1, h2, h3, h4, h5, h6 {
    @apply font-serif;
  }
}
```

### 4. Интеграция с глобальными стилями Next.js

Обновите файл `src/app/globals.css`, чтобы импортировать созданные стили:

```css
/* src/app/globals.css */
@import "../shared/styles/theme.css";

/* Дополнительные глобальные стили */
```

### 5. Настройка шрифтов в Next.js

Обновите файл `src/app/layout.tsx` для загрузки шрифтов:

```tsx
// src/app/layout.tsx
import { Inter, Merriweather } from 'next/font/google';
import './globals.css';

// Определение шрифтов
const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
});

const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-serif',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
```

### 6. Создание провайдера темы

Создайте провайдер для управления темой (светлой/темной):

```tsx
// src/shared/ui/theme-provider.tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

### 7. Интеграция провайдера темы в приложение

Обновите файл `src/app/layout.tsx` для добавления провайдера темы. В Next.js 15.4.4 есть некоторые изменения в работе с метаданными и шрифтами:

```tsx
// src/app/layout.tsx
import { Inter, Merriweather } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/shared/ui/theme-provider';
import type { Metadata, Viewport } from 'next';

// Определение шрифтов
const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
});

const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-serif',
  display: 'swap',
});

// Метаданные для SEO
export const metadata: Metadata = {
  title: 'Christian Poetry Platform',
  description: 'A platform for Christian poets to share their work and connect with readers',
};

// Настройки viewport для адаптивности
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${merriweather.variable}`}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

#### Альтернативные подходы к интеграции темы

1. **Использование Context API без библиотеки next-themes**
   ```tsx
   // theme-context.tsx
   'use client';
   
   import { createContext, useContext, useState, useEffect } from 'react';
   
   type Theme = 'light' | 'dark' | 'system';
   
   const ThemeContext = createContext({
     theme: 'system' as Theme,
     setTheme: (theme: Theme) => {},
   });
   
   export function CustomThemeProvider({ children }: { children: React.ReactNode }) {
     const [theme, setTheme] = useState<Theme>('system');
     
     useEffect(() => {
       // Логика определения и применения темы
     }, [theme]);
     
     return (
       <ThemeContext.Provider value={{ theme, setTheme }}>
         {children}
       </ThemeContext.Provider>
     );
   }
   
   export const useTheme = () => useContext(ThemeContext);
   ```
   
   **Плюсы:**
   - Полный контроль над логикой работы темы
   - Отсутствие зависимостей от внешних библиотек
   
   **Минусы:**
   - Необходимость самостоятельной реализации всей логики
   - Возможные проблемы с гидратацией
   - Больше кода для поддержки
   
2. **Использование CSS Media Queries без JavaScript**
   ```css
   @media (prefers-color-scheme: dark) {
     :root {
       --background: 215 28% 9%;
       --foreground: 210 40% 98%;
       /* другие переменные для темной темы */
     }
   }
   ```
   
   **Плюсы:**
   - Работает без JavaScript
   - Быстрее загружается
   
   **Минусы:**
   - Нет возможности переключения темы вручную
   - Ограниченная функциональность
   
**Почему рекомендуется next-themes:**
- Специально оптимизирован для работы с Next.js 15.4.4
- Решает проблемы с гидратацией (через suppressHydrationWarning)
- Поддерживает системные настройки и ручное переключение
- Сохраняет выбор пользователя в localStorage
- Имеет простой API и небольшой размер
- Уже установлен в проекте (версия 0.4.6)
```

### 8. Создание компонента переключателя темы

Создайте компонент для переключения между светлой и темной темой:

```tsx
// src/shared/ui/theme-toggle.tsx
"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/shared/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
```

### 9. Создание файла с утилитами для работы с CSS-переменными

```typescript
// src/shared/lib/utils/css-variables.ts

/**
 * Преобразует HSL значение из CSS-переменной в формат hex
 * @param hsl HSL значение в формате "H S% L%"
 * @returns Hex значение цвета
 */
export function hslToHex(hsl: string): string {
  // Разбиваем строку на компоненты
  const [h, s, l] = hsl.split(' ').map(val => {
    // Удаляем % из значений
    return parseFloat(val.replace('%', ''));
  });
  
  // Преобразуем HSL в RGB
  const c = (1 - Math.abs(2 * l / 100 - 1)) * s / 100;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l / 100 - c / 2;
  
  let r, g, b;
  if (h >= 0 && h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (h >= 60 && h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (h >= 120 && h < 180) {
    [r, g, b] = [0, c, x];
  } else if (h >= 180 && h < 240) {
    [r, g, b] = [0, x, c];
  } else if (h >= 240 && h < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }
  
  // Преобразуем RGB в hex
  const toHex = (val: number) => {
    const hex = Math.round((val + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Получает значение CSS-переменной
 * @param variableName Имя CSS-переменной (без --)
 * @returns Значение CSS-переменной
 */
export function getCssVariable(variableName: string): string {
  if (typeof window === 'undefined') return '';
  
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--${variableName}`).trim();
}

/**
 * Устанавливает значение CSS-переменной
 * @param variableName Имя CSS-переменной (без --)
 * @param value Значение CSS-переменной
 */
export function setCssVariable(variableName: string, value: string): void {
  if (typeof window === 'undefined') return;
  
  document.documentElement.style.setProperty(`--${variableName}`, value);
}
```

### 10. Создание констант с цветами для использования в коде

```typescript
// src/shared/lib/constants/colors.ts

export const COLORS = {
  primary: {
    50: 'var(--primary-50)',
    100: 'var(--primary-100)',
    200: 'var(--primary-200)',
    300: 'var(--primary-300)',
    400: 'var(--primary-400)',
    500: 'var(--primary-500)',
    600: 'var(--primary-600)',
    700: 'var(--primary-700)',
    800: 'var(--primary-800)',
    900: 'var(--primary-900)',
    950: 'var(--primary-950)',
    DEFAULT: 'var(--primary)',
    foreground: 'var(--primary-foreground)',
  },
  secondary: {
    50: 'var(--secondary-50)',
    100: 'var(--secondary-100)',
    200: 'var(--secondary-200)',
    300: 'var(--secondary-300)',
    400: 'var(--secondary-400)',
    500: 'var(--secondary-500)',
    600: 'var(--secondary-600)',
    700: 'var(--secondary-700)',
    800: 'var(--secondary-800)',
    900: 'var(--secondary-900)',
    950: 'var(--secondary-950)',
    DEFAULT: 'var(--secondary)',
    foreground: 'var(--secondary-foreground)',
  },
  accent: {
    DEFAULT: 'var(--accent)',
    foreground: 'var(--accent-foreground)',
  },
  background: 'var(--background)',
  foreground: 'var(--foreground)',
  card: 'var(--card)',
  cardForeground: 'var(--card-foreground)',
  popover: 'var(--popover)',
  popoverForeground: 'var(--popover-foreground)',
  muted: 'var(--muted)',
  mutedForeground: 'var(--muted-foreground)',
  border: 'var(--border)',
  input: 'var(--input)',
  ring: 'var(--ring)',
  success: {
    DEFAULT: 'var(--success)',
    foreground: 'var(--success-foreground)',
  },
  warning: {
    DEFAULT: 'var(--warning)',
    foreground: 'var(--warning-foreground)',
  },
  error: {
    DEFAULT: 'var(--error)',
    foreground: 'var(--error-foreground)',
  },
  info: {
    DEFAULT: 'var(--info)',
    foreground: 'var(--info-foreground)',
  },
};

export const FONTS = {
  sans: 'var(--font-sans)',
  serif: 'var(--font-serif)',
};

export const RADIUS = {
  sm: 'calc(var(--radius) - 4px)',
  md: 'calc(var(--radius) - 2px)',
  lg: 'var(--radius)',
};
```

### 11. Установка зависимостей для работы с темами

```bash
npm install next-themes
npm install -D tailwindcss-animate @tailwindcss/typography
```

### 12. Обновление файла package.json для добавления зависимостей

```json
{
  "dependencies": {
    // Существующие зависимости...
    "next-themes": "^0.2.1",
    "lucide-react": "^0.294.0"
  },
  "devDependencies": {
    // Существующие зависимости...
    "tailwindcss-animate": "^1.0.7",
    "@tailwindcss/typography": "^0.5.10"
  }
}
```

## Объяснение ключевых концепций

### Tailwind CSS

Tailwind CSS - это утилитарный CSS-фреймворк, который позволяет быстро создавать пользовательские интерфейсы с помощью встроенных классов. Основные преимущества:

1. **Утилитарный подход** - вместо написания CSS вы используете предопределенные классы
2. **Настраиваемость** - легко расширяется и настраивается под ваши нужды
3. **Производительность** - генерирует только те стили, которые вы используете
4. **Отзывчивый дизайн** - встроенные классы для адаптивного дизайна

### CSS-переменные

CSS-переменные (пользовательские свойства) позволяют определять значения, которые можно повторно использовать в документе. Преимущества:

1. **Централизованное управление** - изменение значения в одном месте влияет на все использования
2. **Динамическое изменение** - можно изменять значения через JavaScript
3. **Каскадность** - наследуются по DOM-дереву
4. **Поддержка тем** - легко реализовать светлую/темную тему

### Интеграция с FSD

В архитектуре Feature-Sliced Design:

1. **Shared Layer** - содержит общие стили, темы и утилиты для работы с CSS
2. **UI компоненты** - используют переменные из темы для стилизации
3. **Провайдеры** - управляют темой и другими глобальными настройками

### Система дизайна

В нашей настройке:

1. **Цветовая палитра** - основана на требованиях из дизайн-документа
2. **Типография** - два основных шрифта: sans-serif для UI и serif для поэзии
3. **Компоненты** - стилизованы с использованием переменных темы
4. **Темы** - поддержка светлой и темной темы

### Next.js интеграция

Интеграция с Next.js 14 включает:

1. **App Router** - новая файловая система маршрутизации Next.js
2. **Загрузка шрифтов** - оптимизированная загрузка шрифтов с помощью next/font
3. **Провайдеры** - обертки для управления состоянием и темой

## Дополнительные ресурсы

1. [Официальная документация Tailwind CSS](https://tailwindcss.com/docs)
2. [Документация next-themes](https://github.com/pacocoursey/next-themes)
3. [Руководство по CSS-переменным](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
4. [Документация shadcn/ui](https://ui.shadcn.com/)
5. [Руководство по типографике в Tailwind](https://tailwindcss.com/docs/typography-plugin)

## Результат выполнения задачи

После выполнения этой задачи у вас будет:

1. Настроенный Tailwind CSS с пользовательскими переменными
2. Система цветов, соответствующая дизайн-требованиям
3. Поддержка светлой и темной темы
4. Интеграция с шрифтами для UI и поэзии
5. Утилиты для работы с CSS-переменными
6. Компонент для переключения темы

Эта настройка послужит основой для создания единообразного и стильного пользовательского интерфейса платформы для христианской поэзии.