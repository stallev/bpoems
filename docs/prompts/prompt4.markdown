# Улучшенный промпт для CursorAI: Рефакторинг и расширение функциональности Christian Poetry Platform (без тестирования)

## Задача

Вы — профессиональный full-stack разработчик, которому поручено выполнить рефакторинг и расширение функциональности Christian Poetry Platform, следуя архитектуре Feature-Sliced Design (FSD, `arc_general_doc.md`), Next.js 15.4.4 App Router, TypeScript, и требованиям из `docs/prds/tech_prd.md`, `docs/prds/main_prd.md`, `docs/prds/design_prd.md`, `prisma/schema.prisma`, и `docs/prds/patterns/form_pattern.md`. Ваша цель — провалидировать и исправить `schema.prisma`, синхронизировать базу данных, исправить ошибки линтера, реорганизовать функции из файлов констант, обновить документацию страницы стихотворения, создать документацию для форм комментариев и рецензий, разработать план создания страницы стихотворения, и актуализировать структуру проекта. Юнит- и интеграционное тестирование, а также создание тестов не требуется.

Выполните следующие шаги в указанном порядке, строго соблюдая требования `tech_prd.md` (разделы: Task Implementation Requirements, Best Practices Adherence, Custom Component Styling, Type Safety), `main_prd.md` (разделы: MVP Goals, User Stories), `design_prd.md` (разделы: UI/UX Requirements, Visual Design, Accessibility), и `form_pattern.md` (разделы: Design Principles, Form Component Structure). Перед внесением изменений в код проведите тщательную проверку на соответствие FSD, типобезопасность, доступность (WCAG 2.1 AA, `design_prd.md`), и требования PRD. Все изменения должны быть задокументированы на английском языке (`tech_prd.md`, раздел: Documentation Language Requirement), а код проверен с помощью `tsc --noEmit` и `npm run lint:fix`. Не создавайте тесты и не выполняйте юнит- или интеграционное тестирование.

## Шаг 1: Валидация и исправление schema.prisma

Провалидируйте файл `prisma/schema.prisma` на соответствие требованиям PRD и исправьте обнаруженные ошибки. После этого выполните миграцию базы данных для синхронизации с изменённой схемой.

- **Требования**:
  - Проверьте `schema.prisma` на:
    - Соответствие моделям `User`, `Poem`, `Comment`, `Review`, `ClaimReport`, и другим, описанным в `main_prd.md` (раздел: MVP User Stories).
    - Корректность связей (`@relation`), индексов (`@@index`), и типов данных.
    - Отсутствие конфликтов между полями и ограничениями (например, уникальность `email` в `User`).
    - Наличие всех необходимых полей для функциональности, описанной в `main_prd.md` (например, поддержка многоязычности через `Locale` и `TranslationItem`).
  - Исправьте ошибки, если обнаружены:
    - Убедитесь, что `ClaimReport` включает поле `claim_reject_decision_reason` (добавленное в предыдущем промпте).
    - Проверьте, что все `enum` (например, `Role`, `ContentApprovalStatus`, `ClaimResourceType`) включают все необходимые значения, описанные в `schema.prisma` и `main_prd.md`.
    - Убедитесь, что связи (`@relation`) используют корректные `onDelete` (например, `Cascade` для `Poem` в `ClaimReport`).
  - Выполните миграцию базы данных:
    - Запустите `npx prisma generate` для генерации клиента Prisma.
    - Создайте миграцию с помощью `npx prisma migrate dev --name update_schema` для синхронизации базы данных.
  - Проверьте, что миграция не нарушает существующие данные (например, сохраняет значения `email` в `User` или `slug` в `Poem`).

- **Проверка**:
  - Запустите `npx prisma validate` для проверки синтаксиса `schema.prisma`.
  - Запустите `tsc --noEmit` и `npm run lint:fix` после генерации клиента Prisma.
  - Проведите ручное тестирование функциональности, связанной с изменёнными моделями (например, создание стихов, жалоб), на страницах `/profile/add-poem` и `/dashboard`.
  - Обновите документацию в `docs/specs/database_specs/schema_changes.md` (создайте, если отсутствует), описав изменения в `schema.prisma` и миграции.

**Результат**:
- Обновлённый файл `prisma/schema.prisma` без ошибок.
- Выполненная миграция базы данных.
- Новый/обновлённый файл `docs/specs/database_specs/schema_changes.md`.

## Шаг 2: Исправление ошибок линтера

Запустите команду `npm run lint:fix`, проанализируйте обнаруженные ошибки и исправьте их.

- **Требования**:
  - Выполните `npm run lint:fix` для автоматического исправления стиля кода и выявления ошибок.
  - Проанализируйте оставшиеся ошибки линтера (например, ESLint/TSLint) в файлах проекта, включая:
    - Нарушение правил импорта (FSD, `arc_general_doc.md`, раздел: Import Rules).
    - Использование типа `any` (`tech_prd.md`, раздел: Type Safety).
    - Несоответствие стилей Tailwind или CSS-переменных (`tech_prd.md`, раздел: Custom Component Styling).
  - Исправьте ошибки вручную:
    - Замените `any` на конкретные типы в `src/features/*/model/types.ts` или `src/entities/*/model/types.ts`.
    - Убедитесь, что импорты используют публичные API (`index.ts`) для всех слоёв (`features`, `entities`, `shared`).
    - Используйте семантические Tailwind-классы (`bg-primary`, `text-foreground`) и CSS-переменные из `src/shared/styles/theme.css`.
  - Повторно запустите `npm run lint:fix` и `tsc --noEmit` для подтверждения отсутствия ошибок.

- **Проверка**:
  - Убедитесь, что `npm run lint:fix` не выдаёт ошибок или предупреждений.
  - Проверьте, что `tsc --noEmit` проходит успешно.
  - Проведите ручное тестирование затронутых страниц (`/profile/add-poem`, `/dashboard`) для проверки работоспособности после исправлений.

**Результат**:
- Исправленные файлы с ошибками линтера.
- Успешное выполнение `npm run lint:fix` и `tsc --noEmit`.

## Шаг 3: Реорганизация функций из файлов констант

Исправьте несоответствие в файлах `src/shared/constants/Roles.ts`, `src/shared/constants/RoutePath.ts`, `src/shared/constants/ContentStatus.ts`, и `src/shared/constants/ClaimRejectReasons.ts`, переместив функции в отдельные файлы в соответствии с FSD и сделав их стрелочными. Добавьте требование об использовании стрелочных функций в `main_prd.md`.

- **Требования**:
  - Проверьте указанные файлы на наличие функций (например, утилиты для проверки ролей в `Roles.ts` или обработки путей в `RoutePath.ts`).
  - Переместите функции в соответствующие файлы в `src/shared/lib/utils/`:
    - Создайте файлы, например, `src/shared/lib/utils/roleUtils.ts`, `src/shared/lib/utils/routeUtils.ts`, `src/shared/lib/utils/contentStatusUtils.ts`, и `src/shared/lib/utils/claimRejectUtils.ts`.
    - Преобразуйте функции в стрелочные, например:
      ```typescript
      // src/shared/lib/utils/roleUtils.ts
      export const requireRole = (userRole: string, requiredRole: string): boolean => {
        const roleHierarchy = ['READER', 'SUBSCRIBER', 'AUTHOR', 'MODERATOR', 'ADMIN'];
        return roleHierarchy.indexOf(userRole) >= roleHierarchy.indexOf(requiredRole);
      };
      ```
    - Обновите импорты в файлах, использующих эти функции, чтобы они ссылались на новые утилиты через публичные API (`index.ts` в `src/shared/lib`).
  - Убедитесь, что файлы констант содержат только константы (например, `ROLES`, `RoutePath`, `ContentStatus`, `ClaimRejectReasons`) и типы, без логики.
  - Обновите `docs/prds/main_prd.md`, добавив требование об использовании стрелочных функций:
    ```
    ### Development Requirements
    - All utility functions must be implemented as arrow functions to ensure consistency and compatibility with modern JavaScript practices.
    - Utility functions must be placed in `src/shared/lib/utils/` and exported via public APIs (`index.ts`) in accordance with FSD architecture.
    ```
  - Проверьте соответствие FSD (`arc_general_doc.md`, раздел: Project Structure, Import Rules), используя публичные API для импортов.

- **Проверка**:
  - Запустите `tsc --noEmit` и `npm run lint:fix` для проверки кода.
  - Проведите ручное тестирование функциональности, связанной с перемещёнными функциями (например, проверка ролей в Server Actions, маршруты на страницах).
  - Убедитесь, что файлы констант содержат только константы и типы, а функции находятся в `src/shared/lib/utils/`.

**Результат**:
- Обновлённые файлы `src/shared/constants/Roles.ts`, `src/shared/constants/RoutePath.ts`, `src/shared/constants/ContentStatus.ts`, `src/shared/constants/ClaimRejectReasons.ts` (только константы и типы).
- Новые файлы в `src/shared/lib/utils/` (например, `roleUtils.ts`, `routeUtils.ts`, `contentStatusUtils.ts`, `claimRejectUtils.ts`).
- Обновлённый файл `src/shared/lib/index.ts` с экспортами утилит.
- Обновлённый файл `docs/prds/main_prd.md` с требованием стрелочных функций.

## Шаг 4: Обновление документации страницы Poem

Обновите файл `docs/specs/pages_specs/poem_page_structure.md`, добавив ссылки на файлы с описанием структуры форм, создайте план создания кода репозитория и типов для сущностей `Comment` и `Review`, используя `src/entities/poem/api/poemRepository.ts` как образец.

- **Требования**:
  - Обновите `docs/specs/pages_specs/poem_page_structure.md`, добавив:
    - Ссылки на новые документы, описывающие структуру форм комментариев и рецензий (создаваемые на шагах 5 и 6).
    - Раздел "Repository and Types for Comment and Review" с планом создания:
      - Репозитория для `Comment` (`src/entities/comment/api/commentRepository.ts`) с методами CRUD:
        ```markdown
        ### Comment Repository
        - **File**: `src/entities/comment/api/commentRepository.ts`
        - **Methods**:
          - `findById(id: string): Promise<CommentWithRelations | null>` - Fetch a comment by ID with relations (author, poem).
          - `findByPoemId(poemId: string, params?: { skip?: number; take?: number }): Promise<CommentWithRelations[]>` - Fetch comments for a poem.
          - `create(data: CommentCreateInput): Promise<Comment>` - Create a comment.
          - `update(id: string, data: CommentUpdateInput): Promise<Comment>` - Update a comment.
          - `delete(id: string): Promise<void>` - Delete a comment.
        - **Relations**: Include `author` and `poem` in `CommentWithRelations`.
        ```
      - Репозитория для `Review` (`src/entities/review/api/reviewRepository.ts`) с методами CRUD:
        ```markdown
        ### Review Repository
        - **File**: `src/entities/review/api/reviewRepository.ts`
        - **Methods**:
          - `findById(id: string): Promise<ReviewWithRelations | null>` - Fetch a review by ID with relations (author, poem).
          - `findByPoemId(poemId: string, params?: { skip?: number; take?: number }): Promise<ReviewWithRelations[]>` - Fetch reviews for a poem.
          - `create(data: ReviewCreateInput): Promise<Review>` - Create a review.
          - `update(id: string, data: ReviewUpdateInput): Promise<Review>` - Update a review.
          - `delete(id: string): Promise<void>` - Delete a review.
        - **Relations**: Include `author` and `poem` in `ReviewWithRelations`.
        ```
      - Типов для `Comment` и `Review` в `src/entities/comment/model/types.ts` и `src/entities/review/model/types.ts`:
        ```markdown
        ### Types
        - **Comment Types** (`src/entities/comment/model/types.ts`):
          ```typescript
          export type Comment = {
            id: string;
            content: string;
            authorId: string;
            poemId: string;
            createdAt: Date;
            updatedAt: Date;
          };
          export type CommentWithRelations = Comment & {
            author: User;
            poem: Poem;
          };
          export type CommentCreateInput = {
            content: string;
            authorId: string;
            poemId: string;
          };
          export type CommentUpdateInput = {
            content: string;
          };
          ```
        - **Review Types** (`src/entities/review/model/types.ts`):
          ```typescript
          export type Review = {
            id: string;
            content: string;
            rating: number;
            authorId: string;
            poemId: string;
            createdAt: Date;
            updatedAt: Date;
          };
          export type ReviewWithRelations = Review & {
            author: User;
            poem: Poem;
          };
          export type ReviewCreateInput = {
            content: string;
            rating: number;
            authorId: string;
            poemId: string;
          };
          export type ReviewUpdateInput = {
            content: string;
            rating: number;
          };
          ```
  - Убедитесь, что структура соответствует `main_prd.md` (MVP User Stories: poem display, comments, reviews, claims), `tech_prd.md` (Frontend, Styling, Type Safety), и `design_prd.md` (UI/UX, Visual Design, Accessibility).
  - Используйте `src/entities/poem/api/poemRepository.ts` как образец для структуры репозиториев.

- **Проверка**:
  - Проверьте, что документация написана на английском языке (`tech_prd.md`, раздел: Documentation Language Requirement).
  - Убедитесь, что добавлены ссылки на документы форм (создаваемые на шагах 5 и 6).
  - Проверьте, что описанные методы репозитория соответствуют функциональности в `schema.prisma` и `main_prd.md`.

**Результат**:
- Обновлённый файл `docs/specs/pages_specs/poem_page_structure.md`.

## Шаг 5: Документация формы добавления комментария

Создайте документ, описывающий структуру и функционал формы добавления комментария, а также план создания необходимых хуков и компонентов для формы, списка комментариев, и модальной формы жалоб.

- **Документ структуры формы**:
  - Создайте `docs/specs/forms_specs/comment_form_structure.md`:
    ```markdown
    # Comment Form Structure

    ## Overview
    The Comment Form (`src/features/comment/ui/CommentForm.tsx`) allows users with role `SUBSCRIBER` or higher to add comments to a poem, adhering to `main_prd.md` (MVP User Stories), `tech_prd.md` (Frontend, Type Safety), `design_prd.md` (UI/UX, Accessibility), and `form_pattern.md` (Form Component Structure).

    ## Structure
    - **Form Container** (`flex flex-col gap-4 sm:grid sm:grid-cols-2`):
      - Uses `Form` from `shadcn/ui` with `react-hook-form` and `zod` for validation (text: 1–1000 characters).
      - Input: `Textarea` for comment content (`text-lg font-serif`, `bg-background border-input`).
      - Buttons: Submit (`bg-primary text-primary-foreground`) and Cancel (`bg-muted text-muted-foreground`).
      - Labels and messages from `src/shared/constants/LocaleMessages.ts` (RU for MVP, infrastructure for EN).
    - **Validation**:
      - Schema in `src/features/comment/model/schemas.ts`:
        ```typescript
        import { z } from 'zod';
        export const commentFormSchema = z.object({
          content: z.string().min(1).max(1000),
        });
        export type CommentFormData = z.infer<typeof commentFormSchema>;
        ```
      - Client-side validation via `zodResolver`.
      - Server-side validation in `createComment` Server Action.
    - **Server Action**:
      - Submits via `src/features/comment/server-actions/createComment.ts`.
      - Checks user role (`SUBSCRIBER+`), sanitizes input with `sanitize-html`, and revalidates `RoutePath.POEMS`.
    - **Accessibility**:
      - ARIA attributes: `aria-label="Comment input"`, `aria-describedby="comment-error"`.
      - Keyboard navigation: Tab order, Enter for submission.
      - Focus indicator: 2px purple ring (`ring-2 ring-primary`, `design_prd.md`).
    - **Adaptivity**:
      - Mobile: `flex-col`, reduced padding (`px-4`).
      - Tablet: `sm:grid sm:grid-cols-2`, standard padding (`sm:px-6`).
      - Desktop: Wider layout (`lg:px-8`).

    ## Dependencies
    - `react-hook-form@7.61.1`, `zod@4.0.10` for form handling.
    - `shadcn/ui` for `Form`, `Textarea`, `Button`.
    - `sanitize-html` for input sanitization.
    - `next-auth@5.0.0-beta` for role checks.

    ## Security
    - Sanitize input with `sanitize-html` to prevent XSS (`tech_prd.md`, Security Metrics).
    - Role-based access in Server Action (`SUBSCRIBER+`).
    ```

- **Документ плана создания**:
  - Создайте `docs/specs/plans/comment_feature_plan.md`:
    ```markdown
    # Comment Feature Development Plan

    ## Overview
    This plan outlines the development of the comment feature, including the form, list, and claim modal, for the poem page (`/poems/[slug]`).

    ## Components
    - **CommentForm** (`src/features/comment/ui/CommentForm.tsx`):
      - Implements form structure from `comment_form_structure.md`.
      - Uses `useForm` from `react-hook-form` with `zodResolver`.
      - Submits via `createComment` Server Action.
    - **CommentList** (`src/features/comment/ui/CommentList.tsx`):
      - Fetches comments using `commentRepository.findByPoemId`.
      - Displays comments in `flex flex-col gap-4`, each in `bg-background border-input rounded-lg p-4`.
      - Includes "Report" button (`bg-destructive text-destructive-foreground`) for each comment, opening `ClaimModal`.
    - **ClaimModal** (`src/features/moderation/ui/ClaimModal.tsx`):
      - Uses `Dialog` from `shadcn/ui` with `DialogContent`, `DialogHeader`, `DialogTitle` ("Report Content").
      - Form with `Textarea` for claim message (1–1000 characters) and `Select` for claim reason (from `ClaimRejectReasons`).
      - Submits via `createClaimReport` Server Action.

    ## Hooks
    - **useCommentForm** (`src/features/comment/lib/hooks/useCommentForm.ts`):
      ```typescript
      import { useForm } from 'react-hook-form';
      import { zodResolver } from '@hookform/resolvers/zod';
      import { commentFormSchema, CommentFormData } from '../../model/schemas';
      export const useCommentForm = () => {
        return useForm<CommentFormData>({
          resolver: zodResolver(commentFormSchema),
          defaultValues: { content: '' },
        });
      };
      ```
    - **useComments** (`src/features/comment/lib/hooks/useComments.ts`):
      ```typescript
      import { useState, useEffect } from 'react';
      import { commentRepository } from '@/entities/comment/api/commentRepository';
      import { CommentWithRelations } from '@/entities/comment/model/types';
      export const useComments = (poemId: string) => {
        const [comments, setComments] = useState<CommentWithRelations[]>([]);
        useEffect(() => {
          commentRepository.findByPoemId(poemId).then(setComments);
        }, [poemId]);
        return comments;
      };
      ```

    ## Server Actions
    - **createComment** (`src/features/comment/server-actions/createComment.ts`):
      - Validates input, checks role, sanitizes content, creates comment, revalidates `RoutePath.POEMS`.
    - **createClaimReport** (`src/features/moderation/server-actions/createClaimReport.ts`):
      - Creates claim with `ClaimResourceType.COMMENT`, sets `claimResultDecision = PENDING`.

    ## Development Steps
    1. Create `comment_form_schema.ts` and types in `src/features/comment/model/`.
    2. Implement `CommentForm.tsx` and `useCommentForm.ts`.
    3. Create `CommentList.tsx` and `useComments.ts`.
    4. Implement `ClaimModal.tsx` and integrate with `createClaimReport.ts`.
    5. Update `src/features/comment/index.ts` and `src/features/moderation/index.ts` for public APIs.
    6. Perform manual testing on `/poems/[slug]` for comment creation and claim submission.
    7. Run `tsc --noEmit` and `npm run lint:fix`.
    ```

- **Проверка**:
  - Убедитесь, что документация написана на английском языке (`tech_prd.md`, раздел: Documentation Language Requirement).
  - Проверьте соответствие `form_pattern.md` (Form Component Structure, Accessibility, Security).
  - Убедитесь, что структура формы и план соответствуют `main_prd.md`, `tech_prd.md`, и `design_prd.md`.

**Результат**:
- Новый файл `docs/specs/forms_specs/comment_form_structure.md`.
- Новый файл `docs/specs/plans/comment_feature_plan.md`.

## Шаг 6: Документация формы добавления рецензии

Создайте документ, описывающий структуру и функционал формы добавления рецензии, включая claim-функционал, а также план создания необходимых хуков и компонентов для формы, списка рецензий, и модальной формы жалоб.

- **Документ структуры формы**:
  - Создайте `docs/specs/forms_specs/review_form_structure.md`:
    ```markdown
    # Review Form Structure

    ## Overview
    The Review Form (`src/features/review/ui/ReviewForm.tsx`) allows users with role `AUTHOR` or higher to add reviews with ratings to a poem, adhering to `main_prd.md` (MVP User Stories), `tech_prd.md` (Frontend, Type Safety), `design_prd.md` (UI/UX, Accessibility), and `form_pattern.md` (Form Component Structure).

    ## Structure
    - **Form Container** (`flex flex-col gap-4 sm:grid sm:grid-cols-2`):
      - Uses `Form` from `shadcn/ui` with `react-hook-form` and `zod` for validation (text: 1–1000 characters, rating: 1–5).
      - Inputs: `Textarea` for review content (`text-lg font-serif`, `bg-background border-input`), `Select` for rating (`bg-background border-input`).
      - Buttons: Submit (`bg-primary text-primary-foreground`) and Cancel (`bg-muted text-muted-foreground`).
      - Labels and messages from `src/shared/constants/LocaleMessages.ts` (RU for MVP, infrastructure for EN).
    - **Validation**:
      - Schema in `src/features/review/model/schemas.ts`:
        ```typescript
        import { z } from 'zod';
        export const reviewFormSchema = z.object({
          content: z.string().min(1).max(1000),
          rating: z.number().min(1).max(5),
        });
        export type ReviewFormData = z.infer<typeof reviewFormSchema>;
        ```
      - Client-side validation via `zodResolver`.
      - Server-side validation in `createReview` Server Action.
    - **Server Action**:
      - Submits via `src/features/review/server-actions/createReview.ts`.
      - Checks user role (`AUTHOR+`), sanitizes input with `sanitize-html`, and revalidates `RoutePath.POEMS`.
    - **Accessibility**:
      - ARIA attributes: `aria-label="Review input"`, `aria-describedby="review-error"`.
      - Keyboard navigation: Tab order, Enter for submission, arrow keys for rating selection.
      - Focus indicator: 2px purple ring (`ring-2 ring-primary`, `design_prd.md`).
    - **Adaptivity**:
      - Mobile: `flex-col`, reduced padding (`px-4`).
      - Tablet: `sm:grid sm:grid-cols-2`, standard padding (`sm:px-6`).
      - Desktop: Wider layout (`lg:px-8`).

    ## Dependencies
    - `react-hook-form@7.61.1`, `zod@4.0.10` for form handling.
    - `shadcn/ui` for `Form`, `Textarea`, `Select`, `Button`.
    - `sanitize-html` for input sanitization.
    - `next-auth@5.0.0-beta` for role checks.

    ## Security
    - Sanitize input with `sanitize-html` to prevent XSS (`tech_prd.md`, Security Metrics).
    - Role-based access in Server Action (`AUTHOR+`).
    ```

- **Документ плана создания**:
  - Создайте `docs/specs/plans/review_feature_plan.md`:
    ```markdown
    # Review Feature Development Plan

    ## Overview
    This plan outlines the development of the review feature, including the form, list, and claim modal, for the poem page (`/poems/[slug]`).

    ## Components
    - **ReviewForm** (`src/features/review/ui/ReviewForm.tsx`):
      - Implements form structure from `review_form_structure.md`.
      - Uses `useForm` from `react-hook-form` with `zodResolver`.
      - Submits via `createReview` Server Action.
    - **ReviewList** (`src/features/review/ui/ReviewList.tsx`):
      - Fetches reviews using `reviewRepository.findByPoemId`.
      - Displays reviews in `flex flex-col gap-4`, each in `bg-background border-input rounded-lg p-4`.
      - Includes "Report" button (`bg-destructive text-destructive-foreground`) for each review, opening `ClaimModal`.
    - **ClaimModal** (`src/features/moderation/ui/ClaimModal.tsx`):
      - Reuses modal from comment feature, with `ClaimResourceType.REVIEW`.
      - Form with `Textarea` for claim message and `Select` for claim reason (from `ClaimRejectReasons`).
      - Submits via `createClaimReport` Server Action.

    ## Hooks
    - **useReviewForm** (`src/features/review/lib/hooks/useReviewForm.ts`):
      ```typescript
      import { useForm } from 'react-hook-form';
      import { zodResolver } from '@hookform/resolvers/zod';
      import { reviewFormSchema, ReviewFormData } from '../../model/schemas';
      export const useReviewForm = () => {
        return useForm<ReviewFormData>({
          resolver: zodResolver(reviewFormSchema),
          defaultValues: { content: '', rating: 1 },
        });
      };
      ```
    - **useReviews** (`src/features/review/lib/hooks/useReviews.ts`):
      ```typescript
      import { useState, useEffect } from 'react';
      import { reviewRepository } from '@/entities/review/api/reviewRepository';
      import { ReviewWithRelations } from '@/entities/review/model/types';
      export const useReviews = (poemId: string) => {
        const [reviews, setReviews] = useState<ReviewWithRelations[]>([]);
        useEffect(() => {
          reviewRepository.findByPoemId(poemId).then(setReviews);
        }, [poemId]);
        return reviews;
      };
      ```

    ## Server Actions
    - **createReview** (`src/features/review/server-actions/createReview.ts`):
      - Validates input, checks role, sanitizes content, creates review, revalidates `RoutePath.POEMS`.
    - **createClaimReport** (`src/features/moderation/server-actions/createClaimReport.ts`):
      - Creates claim with `ClaimResourceType.REVIEW`, sets `claimResultDecision = PENDING`.

    ## Development Steps
    1. Create `review_form_schema.ts` and types in `src/features/review/model/`.
    2. Implement `ReviewForm.tsx` and `useReviewForm.ts`.
    3. Create `ReviewList.tsx` and `useReviews.ts`.
    4. Reuse `ClaimModal.tsx` from comment feature, update for `ClaimResourceType.REVIEW`.
    5. Update `src/features/review/index.ts` and `src/features/moderation/index.ts` for public APIs.
    6. Perform manual testing on `/poems/[slug]` for review creation and claim submission.
    7. Run `tsc --noEmit` and `npm run lint:fix`.
    ```

- **Проверка**:
  - Убедитесь, что документация написана на английском языке (`tech_prd.md`, раздел: Documentation Language Requirement).
  - Проверьте соответствие `form_pattern.md` (Form Component Structure, Accessibility, Security).
  - Убедитесь, что структура формы и план соответствуют `main_prd.md`, `tech_prd.md`, и `design_prd.md`.

**Результат**:
- Новый файл `docs/specs/forms_specs/review_form_structure.md`.
- Новый файл `docs/specs/plans/review_feature_plan.md`.

## Шаг 7: Разработка плана создания страницы Poem

Разработайте план создания страницы стихотворения (`src/app/(noadmin)/poems/[slug]/page.tsx`) согласно документации `docs/specs/pages_specs/poem_page_structure.md` (обновлённой на шаге 4).

- **Требования**:
  - Создайте `docs/specs/plans/poem_page_plan.md`:
    ```markdown
    # Poem Page Development Plan

    ## Overview
    This plan outlines the development of the poem page (`src/app/(noadmin)/poems/[slug]/page.tsx`) based on `docs/specs/pages_specs/poem_page_structure.md`.

    ## Components
    - **PoemPage** (`src/app/(noadmin)/poems/[slug]/page.tsx`):
      - Fetches poem data using `poemRepository.getBySlug`.
      - Renders poem title (`text-2xl sm:text-3xl font-serif font-bold text-foreground`), content (`react-quill` read-only), and category (`text-sm text-muted-foreground`).
      - Conditionally renders `DeletePoemButton` and `EditPoemLink` for authors.
      - Includes `CommentForm`, `CommentList`, `ReviewForm`, `ReviewList`, and `ClaimModal`.
    - **DeletePoemModal** (`src/features/poem/ui/DeletePoemModal.tsx`):
      - Uses `Dialog` from `shadcn/ui` with `DialogContent`, `DialogHeader`, `DialogTitle` ("Confirm Deletion").
      - Submits via `deletePoem` Server Action, redirects to `RoutePath.PROFILE`.
    - **CommentForm** (`src/features/comment/ui/CommentForm.tsx`): As per `comment_form_structure.md`.
    - **CommentList** (`src/features/comment/ui/CommentList.tsx`): As per `comment_feature_plan.md`.
    - **ReviewForm** (`src/features/review/ui/ReviewForm.tsx`): As per `review_form_structure.md`.
    - **ReviewList** (`src/features/review/ui/ReviewList.tsx`): As per `review_feature_plan.md`.
    - **ClaimModal** (`src/features/moderation/ui/ClaimModal.tsx`): Reused for poem, comment, and review claims.

    ## Server Actions
    - **deletePoem** (`src/features/poem/server-actions/deletePoem.ts`):
      ```typescript
      'use server';
      import { prisma } from '@/shared/lib/prisma';
      import { auth } from '@/shared/api/auth/auth';
      import { RoutePath } from '@/shared/constants/RoutePath';
      import { ErrorMessages } from '@/shared/constants/ErrorMessages';
      import { revalidatePath } from 'next/cache';
      export async function deletePoem(poemId: string) {
        const session = await auth();
        if (!session?.user) {
          return { success: false, message: ErrorMessages.UNAUTHORIZED };
        }
        try {
          const poem = await prisma.poem.findUnique({ where: { id: poemId } });
          if (poem?.authorId !== session.user.id) {
            return { success: false, message: ErrorMessages.UNAUTHORIZED };
          }
          await prisma.poem.delete({ where: { id: poemId } });
          revalidatePath(RoutePath.POEMS);
          revalidatePath(RoutePath.PROFILE);
          revalidatePath(RoutePath.DASHBOARD);
          return { success: true, message: 'Poem deleted' };
        } catch (error) {
          console.error(ErrorMessages.DELETE_POEM_FAILED, error);
          return { success: false, message: ErrorMessages.DELETE_POEM_FAILED };
        }
      }
      ```

    ## Development Steps
    1. Create `page.tsx` with poem fetching and rendering logic.
    2. Implement `DeletePoemModal.tsx` and integrate with `deletePoem.ts`.
    3. Integrate `CommentForm.tsx`, `CommentList.tsx`, `ReviewForm.tsx`, `ReviewList.tsx`, and `ClaimModal.tsx`.
    4. Add role-based conditional rendering for author controls.
    5. Ensure styling uses semantic Tailwind classes and CSS variables (`src/shared/styles/theme.css`).
    6. Perform manual testing on `/poems/[slug]` for poem display, comment/review submission, and claim functionality.
    7. Run `tsc --noEmit` and `npm run lint:fix`.
    ```

- **Проверка**:
  - Убедитесь, что план соответствует `docs/specs/pages_specs/poem_page_structure.md`, `main_prd.md`, `tech_prd.md`, и `design_prd.md`.
  - Проверьте, что документация написана на английском языке (`tech_prd.md`, раздел: Documentation Language Requirement).
  - Убедитесь, что план включает все компоненты, хуки, и Server Actions, описанные в `poem_page_structure.md`.

**Результат**:
- Новый файл `docs/specs/plans/poem_page_plan.md`.

## Шаг 8: Актуализация структуры проекта

Актуализируйте файл `docs/architecture_docs/current_project_files_tree.md`, чтобы отразить финальную структуру проекта после всех изменений.

- **Требования**:
  - Обновите файл, добавив новые и обновлённые файлы, созданные на шагах 1–7, включая:
    - `prisma/schema.prisma` (исправленные ошибки и миграции).
    - `src/shared/constants/` (обновлённые `Roles.ts`, `RoutePath.ts`, `ContentStatus.ts`, `ClaimRejectReasons.ts`).
    - `src/shared/lib/utils/` (новые файлы: `roleUtils.ts`, `routeUtils.ts`, `contentStatusUtils.ts`, `claimRejectUtils.ts`).
    - `src/shared/lib/index.ts` (обновлённый публичный API).
    - `src/entities/comment/api/commentRepository.ts`, `src/entities/comment/model/types.ts`.
    - `src/entities/review/api/reviewRepository.ts`, `src/entities/review/model/types.ts`.
    - `src/features/comment/ui/CommentForm.tsx`, `src/features/comment/ui/CommentList.tsx`.
    - `src/features/comment/model/schemas.ts`, `src/features/comment/lib/hooks/useCommentForm.ts`, `src/features/comment/lib/hooks/useComments.ts`.
    - `src/features/comment/server-actions/createComment.ts`.
    - `src/features/review/ui/ReviewForm.tsx`, `src/features/review/ui/ReviewList.tsx`.
    - `src/features/review/model/schemas.ts`, `src/features/review/lib/hooks/useReviewForm.ts`, `src/features/review/lib/hooks/useReviews.ts`.
    - `src/features/review/server-actions/createReview.ts`.
    - `src/features/moderation/ui/ClaimModal.tsx`, `src/features/moderation/server-actions/createClaimReport.ts`.
    - `src/features/poem/ui/DeletePoemModal.tsx`, `src/features/poem/server-actions/deletePoem.ts`.
    - `docs/specs/database_specs/schema_changes.md`.
    - `docs/specs/forms_specs/comment_form_structure.md`, `docs/specs/plans/comment_feature_plan.md`.
    - `docs/specs/forms_specs/review_form_structure.md`, `docs/specs/plans/review_feature_plan.md`.
    - `docs/specs/pages_specs/poem_page_structure.md`, `docs/specs/plans/poem_page_plan.md`.
  - Используйте Markdown-форматирование с отступами для иерархической структуры, как в текущем `current_project_files_tree.md`.
  - Документация должна быть на английском языке (`tech_prd.md`, раздел: Documentation Language Requirement).
  - Обновите раздел "FSD Compliance Updates", добавив:
    ```
    #### FSD Compliance Updates
    - Updated `schema.prisma` with validated models and migrations, integrated with `entities` and `features` layers.
    - Moved functions from `src/shared/constants/` to `src/shared/lib/utils/` (e.g., `roleUtils.ts`, `routeUtils.ts`), adhering to FSD shared layer principles.
    - Created `commentRepository.ts` and `reviewRepository.ts` in `src/entities/comment/api/` and `src/entities/review/api/`, following FSD `entities` layer.
    - Implemented comment and review forms in `src/features/comment/` and `src/features/review/`, with public APIs in `index.ts`.
    - Documented comment and review forms, repositories, and poem page in `docs/specs/`, aligning with FSD documentation requirements.
    ```

- **Проверка**:
  - Убедитесь, что все новые/обновлённые файлы включены и нет отсутствующих или устаревших записей.
  - Проверьте соответствие FSD-архитектуре (`arc_general_doc.md`, раздел: Project Structure, Import Rules).
  - Проверьте, что документация написана на английском языке и использует правильное форматирование.

**Результат**:
- Обновлённый файл `docs/architecture_docs/current_project_files_tree.md`.

## Дополнительные требования

- **FSD-совместимость** (`arc_general_doc.md`, раздел: Architecture Principles):
  - Все изменения должны соответствовать FSD, используя правильные слои (`app`, `features`, `entities`, `shared`) и сегменты (`ui`, `model`, `lib`, `api`, `server-actions`).
  - Импорты ограничены публичными API (`index.ts`) для слабой связанности (`arc_general_doc.md`, раздел: Import Rules).
- **Типобезопасность** (`tech_prd.md`, раздел: Type Safety):
  - Все изменения типобезопасны, проверены с помощью `tsc --noEmit`.
  - Типы определены в `src/features/*/model/types.ts` или `src/entities/*/model/types.ts` (например, `CommentFormData`, `ReviewFormData`).
  - Запрещено использование типа `any` (`tech_prd.md`, раздел: Type Safety).
- **Стилизация** (`tech_prd.md`, раздел: Custom Component Styling; `design_prd.md`, раздел: Visual Design):
  - Используйте только семантические Tailwind-классы (`bg-primary`, `text-foreground`, `border-input`) и CSS-переменные из `src/shared/styles/theme.css`.
  - Избегайте inline-стилей и хардкода цветов (`bg-purple-600`) (`tech_prd.md`, раздел: Styling Rules).
  - Следуйте цветовой палитре из `design_prd.md` (Primary: Purple #805AD5, Secondary: Blue #3182CE, etc.).
- **Доступность** (`design_prd.md`, раздел: Accessibility):
  - Все компоненты соответствуют WCAG 2.1 AA (ARIA-атрибуты, клавиатурная навигация, индикатор фокуса: 2px purple ring, `ring-2 ring-primary`).
- **Безопасность** (`tech_prd.md`, раздел: Security Metrics):
  - Санитизируйте ввод в формах (`CommentForm`, `ReviewForm`) с помощью `sanitize-html` для предотвращения XSS.
  - Проверяйте права доступа в Server Actions (роли `SUBSCRIBER`, `AUTHOR`, `MODERATOR`, `ADMIN`, `schema.prisma`, `arc_general_doc.md`, раздел: Authentication).
- **Многоязычность** (`main_prd.md`, раздел: Multilingual Interface):
  - Используйте русские метки и сообщения об ошибках для MVP, с инфраструктурой для EN (например, `LocaleMessages.ts`).
  - Храните переводы в `src/shared/constants/LocaleMessages.ts`.
- **Проверка кода** (`tech_prd.md`, раздел: Quality Metrics):
  - Проверяйте код с помощью `tsc --noEmit` и `npm run lint:fix` для обеспечения типобезопасности и соответствия стилю.
  - Проводите ручное тестирование функциональности (например, создание стихов, комментариев, рецензий, жалоб).
  - Не создавайте тесты и не выполняйте юнит- или интеграционное тестирование.
- **Версии библиотек** (`tech_prd.md`, раздел: Technology Stack):
  - Используйте точные версии: `react-hook-form@7.61.1`, `zod@4.0.10`, `next-auth@5.0.0-beta`, `prisma@6.13.0`, `sanitize-html`.

## Критерии успеха

- `schema.prisma` валидирован и синхронизирован с базой данных, документация обновлена.
- Ошибки линтера исправлены, `npm run lint:fix` и `tsc --noEmit` проходят успешно.
- Функции из файлов констант перемещены в `src/shared/lib/utils/`, преобразованы в стрелочные, задокументированы в `main_prd.md`.
- `poem_page_structure.md` обновлён с планом репозиториев и типов для `Comment` и `Review`.
- Созданы документы для форм комментариев и рецензий (`comment_form_structure.md`, `review_form_structure.md`) и планов их реализации (`comment_feature_plan.md`, `review_feature_plan.md`).
- Разработан план создания страницы стихотворения (`poem_page_plan.md`) в соответствии с `poem_page_structure.md`.
- `current_project_files_tree.md` актуализирован, отражает все изменения, и соответствует FSD.
- Код проходит `tsc --noEmit` и `npm run lint:fix` без ошибок.
- Функциональность создания стихов, комментариев, рецензий, и жалоб работает корректно, с учётом ролей (`schema.prisma`) и требований PRD.

## Примечания

- Ссылайтесь на `schema.prisma` для моделей `Poem`, `Comment`, `Review`, `ClaimReport`.
- Документация и комментарии в коде — на английском языке (`tech_prd.md`, раздел: Documentation Language Requirement).
- Убедитесь, что изменения поддерживают многоязычность (RU для MVP, инфраструктура для EN, `main_prd.md`, раздел: Multilingual Interface).
- Если обнаружены ошибки, исправьте их и повторно выполните `tsc --noEmit` и `npm run lint:fix`.
- Код страницы `/poems/[slug]/page.tsx` пока не создавайте, только задокументируйте план в `poem_page_plan.md`.
- Не создавайте тесты и не выполняйте юнит- или интеграционное тестирование, но обеспечьте ручное тестирование функциональности.