# Задача 3.1: Настройка Prisma ORM с базовой схемой

## Описание задачи

Настройка Prisma ORM v6.13.0 для работы с базой данных PostgreSQL, создание базовой схемы данных и интеграция с проектом на Next.js 15.4.4 в соответствии с архитектурой Feature-Sliced Design (FSD). Реализация схемы данных для работы с Auth.js (next-auth v5 beta).

## Необходимые технологии

- Prisma ORM v6.13.0
- PostgreSQL
- TypeScript
- Next.js 15.4.4
- Auth.js (next-auth v5 beta)
- @auth/prisma-adapter v2.10.0
- Feature-Sliced Design

## Подробное руководство по выполнению

### 1. Установка Prisma ORM v6.13.0

Согласно package.json, в проекте уже установлены Prisma v6.13.0 и @prisma/client v6.13.0. Если по каким-то причинам их нужно переустановить, выполните следующие команды:

```bash
npm install prisma@6.13.0 --save-dev
npm install @prisma/client@6.13.0
```

Также для интеграции с Auth.js (next-auth v5 beta) необходимо установить адаптер:

```bash
npm install @auth/prisma-adapter@2.10.0
```

Prisma состоит из двух основных компонентов:
- **Prisma CLI** - инструмент командной строки для генерации кода, миграций и других операций
- **Prisma Client** - автоматически генерируемый клиент для работы с базой данных

#### Альтернативные подходы

1. **Использование TypeORM**
   ```bash
   npm install typeorm reflect-metadata pg
   ```
   
   **Плюсы:**
   - Более традиционный ORM с классами и декораторами
   - Богатый API для сложных запросов
   - Поддержка множества баз данных
   
   **Минусы:**
   - Более сложная настройка
   - Менее типобезопасный по сравнению с Prisma
   - Больше бойлерплейт-кода
   - Не соответствует требованиям проекта
   
2. **Использование Drizzle ORM**
   ```bash
   npm install drizzle-orm postgres
   ```
   
   **Плюсы:**
   - Легковесный и производительный
   - Хорошая типизация
   - Нет необходимости в генерации кода
   
   **Минусы:**
   - Меньше функций по сравнению с Prisma
   - Меньше инструментов для миграций
   - Не имеет встроенной интеграции с Auth.js
   - Не соответствует требованиям проекта

**Почему рекомендуется Prisma ORM v6.13.0:**
- Соответствует требованиям проекта (указан в package.json)
- Отличная типобезопасность благодаря автоматически генерируемым типам TypeScript
- Интуитивный API для работы с данными
- Мощная система миграций
- Визуальный инструмент Prisma Studio для работы с данными
- Официальный адаптер для Auth.js (@auth/prisma-adapter)
- Хорошая документация и большое сообщество

### 2. Инициализация Prisma в проекте

После установки необходимо инициализировать Prisma в проекте:

```bash
npx prisma init
```

Эта команда создаст:
- Директорию `prisma` в корне проекта
- Файл `prisma/schema.prisma` - основной файл с определением схемы данных
- Файл `.env` с переменными окружения для подключения к базе данных (если он еще не существует)

### 3. Настройка подключения к базе данных

Откройте файл `.env` и настройте переменную `DATABASE_URL` для подключения к PostgreSQL (Neon):

```
DATABASE_URL="postgresql://username:password@hostname:port/database?schema=public"
```

Для Neon Database URL будет выглядеть примерно так:
```
DATABASE_URL="postgres://username:password@ep-example-id.eu-central-1.aws.neon.tech/database?sslmode=require"
```

### 4. Создание базовой схемы данных

Отредактируйте файл `prisma/schema.prisma` и определите базовую схему данных в соответствии с требованиями проекта:

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Модель пользователя
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  password      String?
  role          Role      @default(SUBSCRIBER)
  bio           Json?     // Для хранения форматированного текста (WYSIWYG)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Отношения
  poems         Poem[]
  comments      Comment[]
  accounts      Account[]
  sessions      Session[]
}

// Модель аккаунта (для Auth.js)
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

// Модель сессии (для Auth.js)
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// Модель для верификации (для Auth.js)
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// Модель стихотворения
model Poem {
  id          String   @id @default(cuid())
  title       String
  content     Json     // Для хранения форматированного текста (WYSIWYG)
  published   Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  authorId    String
  
  // Отношения
  author      User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  categories  CategoryOnPoem[]
  tags        TagOnPoem[]
  comments    Comment[]
}

// Модель категории
model Category {
  id          String   @id @default(cuid())
  name        Json     // Для мультиязычности (объект с переводами)
  description Json?    // Для мультиязычности (объект с переводами)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Отношения
  poems       CategoryOnPoem[]
}

// Связующая таблица между стихотворениями и категориями
model CategoryOnPoem {
  poemId      String
  categoryId  String
  assignedAt  DateTime @default(now())
  
  // Отношения
  poem        Poem     @relation(fields: [poemId], references: [id], onDelete: Cascade)
  category    Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  
  @@id([poemId, categoryId])
}

// Модель тега
model Tag {
  id        String   @id @default(cuid())
  name      String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Отношения
  poems     TagOnPoem[]
}

// Связующая таблица между стихотворениями и тегами
model TagOnPoem {
  poemId    String
  tagId     String
  assignedAt DateTime @default(now())
  
  // Отношения
  poem      Poem     @relation(fields: [poemId], references: [id], onDelete: Cascade)
  tag       Tag      @relation(fields: [tagId], references: [id], onDelete: Cascade)
  
  @@id([poemId, tagId])
}

// Модель комментария
model Comment {
  id        String   @id @default(cuid())
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  poemId    String
  authorId  String
  
  // Отношения
  poem      Poem     @relation(fields: [poemId], references: [id], onDelete: Cascade)
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
}

// Перечисление ролей пользователей
enum Role {
  SUBSCRIBER
  AUTHOR
  MODERATOR
  ADMIN
}
```

Эта схема включает:
- Модели для аутентификации с Auth.js (User, Account, Session, VerificationToken)
- Основные бизнес-сущности (Poem, Category, Tag, Comment)
- Связующие таблицы для отношений многие-ко-многим
- Поля для мультиязычности (name и description в Category)
- Поля для хранения форматированного текста (bio в User, content в Poem)
- Систему ролей (Role enum)

### 5. Генерация Prisma Client

После определения схемы необходимо сгенерировать Prisma Client:

```bash
npx prisma generate
```

Эта команда создаст типизированный клиент для работы с базой данных на основе вашей схемы.

### 6. Создание миграции

Для создания миграции на основе схемы выполните:

```bash
npx prisma migrate dev --name init
```

Эта команда:
- Создаст файл миграции в директории `prisma/migrations`
- Применит миграцию к базе данных
- Перегенерирует Prisma Client

### 7. Интеграция с FSD архитектурой

Согласно FSD архитектуре, создадим файл для инициализации Prisma Client в слое shared:

```typescript
// src/shared/api/database/prisma.ts

import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// Предотвращение создания множества экземпляров PrismaClient в режиме разработки
export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
```

Этот паттерн предотвращает создание множества экземпляров PrismaClient при горячей перезагрузке в режиме разработки.

### 8. Создание базовых репозиториев

В соответствии с FSD архитектурой, создадим базовые репозитории для работы с сущностями в слое entities:

```typescript
// src/entities/user/api/userRepository.ts

import { prisma } from '@/shared/api/database/prisma';
import type { User, Prisma } from '@prisma/client';

export const userRepository = {
  findById: async (id: string) => {
    return prisma.user.findUnique({
      where: { id }
    });
  },
  
  findByEmail: async (email: string) => {
    return prisma.user.findUnique({
      where: { email }
    });
  },
  
  create: async (data: Prisma.UserCreateInput) => {
    return prisma.user.create({
      data
    });
  },
  
  update: async (id: string, data: Prisma.UserUpdateInput) => {
    return prisma.user.update({
      where: { id },
      data
    });
  },
  
  delete: async (id: string) => {
    return prisma.user.delete({
      where: { id }
    });
  }
};
```

```typescript
// src/entities/poem/api/poemRepository.ts

import { prisma } from '@/shared/api/database/prisma';
import type { Poem, Prisma } from '@prisma/client';

export const poemRepository = {
  findById: async (id: string) => {
    return prisma.poem.findUnique({
      where: { id },
      include: {
        author: true,
        categories: {
          include: {
            category: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        }
      }
    });
  },
  
  findAll: async (params?: {
    skip?: number;
    take?: number;
    orderBy?: Prisma.PoemOrderByWithRelationInput;
    where?: Prisma.PoemWhereInput;
  }) => {
    const { skip, take, orderBy, where } = params || {};
    
    return prisma.poem.findMany({
      skip,
      take,
      orderBy,
      where,
      include: {
        author: true,
        categories: {
          include: {
            category: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        }
      }
    });
  },
  
  create: async (data: Prisma.PoemCreateInput) => {
    return prisma.poem.create({
      data,
      include: {
        author: true
      }
    });
  },
  
  update: async (id: string, data: Prisma.PoemUpdateInput) => {
    return prisma.poem.update({
      where: { id },
      data,
      include: {
        author: true
      }
    });
  },
  
  delete: async (id: string) => {
    return prisma.poem.delete({
      where: { id }
    });
  }
};
```

### 9. Экспорт API из entities

Создадим файлы индексов для экспорта API из entities:

```typescript
// src/entities/user/api/index.ts
export { userRepository } from './userRepository';

// src/entities/user/index.ts
export * from './api';
export * from './model';
```

```typescript
// src/entities/poem/api/index.ts
export { poemRepository } from './poemRepository';

// src/entities/poem/index.ts
export * from './api';
export * from './model';
```

### 10. Создание типов для моделей

```typescript
// src/entities/user/model/types.ts
import type { User as PrismaUser, Role } from '@prisma/client';

export type User = PrismaUser;

export type UserRole = Role;
```

```typescript
// src/entities/poem/model/types.ts
import type { Poem as PrismaPoem } from '@prisma/client';

export type Poem = PrismaPoem;

export type PoemWithRelations = PrismaPoem & {
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  categories: {
    category: {
      id: string;
      name: any; // JSON с переводами
    };
  }[];
  tags: {
    tag: {
      id: string;
      name: string;
    };
  }[];
};
```

## Объяснение ключевых концепций

### Prisma ORM

Prisma ORM - это современный ORM (Object-Relational Mapping) для Node.js и TypeScript, который упрощает работу с базами данных. Основные преимущества:

1. **Типобезопасность** - Prisma автоматически генерирует типы TypeScript на основе вашей схемы данных
2. **Интуитивный API** - простой и понятный API для работы с данными
3. **Миграции** - встроенная система миграций для управления схемой базы данных
4. **Визуализация данных** - Prisma Studio для просмотра и редактирования данных

### Интеграция с FSD

В архитектуре Feature-Sliced Design:

1. **Shared Layer** - содержит инициализацию Prisma Client (`prisma.ts`)
2. **Entities Layer** - содержит репозитории для работы с сущностями и типы моделей
3. **Features Layer** - использует репозитории из Entities Layer для реализации бизнес-логики

### Модель данных

В нашей схеме:

1. **User** - модель пользователя с ролевой системой
2. **Poem** - модель стихотворения с поддержкой форматированного текста
3. **Category** - модель категории с мультиязычной поддержкой
4. **Tag** - модель тега для организации стихотворений
5. **Comment** - модель комментария

### Auth.js (next-auth v5 beta) интеграция

Модели `Account`, `Session` и `VerificationToken` необходимы для работы Auth.js (next-auth v5 beta) - современной библиотеки для аутентификации в Next.js приложениях. 

В версии next-auth v5 beta есть ряд важных изменений по сравнению с предыдущими версиями:

1. Новый API для серверных компонентов
2. Улучшенная типизация
3. Более гибкая настройка сессий
4. Лучшая интеграция с App Router в Next.js 15.4.4

Для полноценной интеграции Auth.js с Prisma необходимо:

1. Создать правильную схему базы данных (как показано выше)
2. Настроить Auth.js с использованием PrismaAdapter
3. Создать необходимые API роуты для аутентификации

Пример настройки Auth.js с Prisma:

```typescript
// src/auth.ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/shared/api/database/prisma";
import authConfig from "@/shared/config/auth-config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});
```

```typescript
// src/shared/config/auth-config.ts
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { UserRole } from "@prisma/client";
import type { NextAuthConfig } from "next-auth";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        // Здесь логика аутентификации
      }
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      
      return token;
    }
  },
} satisfies NextAuthConfig;

## Дополнительные ресурсы

1. [Официальная документация Prisma v6](https://www.prisma.io/docs)
2. [Руководство по миграциям Prisma](https://www.prisma.io/docs/orm/prisma-migrate)
3. [Интеграция Prisma с Next.js](https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices)
4. [Документация Auth.js (next-auth v5 beta)](https://authjs.dev/)
5. [Prisma адаптер для Auth.js](https://authjs.dev/reference/adapter/prisma)
6. [Feature-Sliced Design методология](https://feature-sliced.design/)
7. [Примеры использования Prisma с Next.js 15](https://github.com/prisma/prisma-examples/tree/latest/typescript/rest-nextjs-api-routes)
8. [Руководство по безопасности Auth.js](https://authjs.dev/getting-started/security)

## Результат выполнения задачи

После выполнения этой задачи у вас будет:

1. Настроенный Prisma ORM с подключением к PostgreSQL
2. Определенная схема данных с основными моделями
3. Сгенерированный Prisma Client для типобезопасного доступа к данным
4. Базовые репозитории для работы с сущностями в соответствии с FSD архитектурой
5. Интеграция с Auth.js для аутентификации

Эта настройка послужит основой для дальнейшей разработки функциональности платформы для христианской поэзии.