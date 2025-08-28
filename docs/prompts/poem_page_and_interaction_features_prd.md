# Poem Page and Interaction Features PRD: Christian Poetry Platform

## Overview

This Product Requirements Document (PRD) outlines the development of the poem page (`/poems/[slug]`) and its interaction features (comments, reviews, and content reporting) for the Christian Poetry Platform. The implementation includes the poem display page, comment feature, review feature, and a reusable claim modal, adhering to Feature-Sliced Design (FSD) architecture, TypeScript requirements, and standards specified in `docs/prds/main_prd.md`, `docs/prds/tech_prd.md`, `docs/prds/design_prd.md`, `docs/prds/patterns/form_requirements.md`, and `docs/prds/cursorai_task_execution_workflow_prd.md`. The `user` entity and `userRepository` in `src/entities/user/` are already implemented and will be leveraged. The development is broken down into distinct tasks within this document, with an optimized sequence to minimize dependencies. Type definitions should re-export base types from `@/generated/prisma` (e.g., `Poem as PrismaPoem`, `Tag`, `Statistics`, `Comment as PrismaComment`, `Review as PrismaReview`). Custom types should either extend these Prisma types or be created from scratch when required by business logic or feature requirements. Changes to types, hooks, and components must not break existing functionality, such as the poem creation and editing forms.

## Purpose

This PRD ensures systematic development of the poem page and interaction features, with rigorous validation, accessibility, and documentation to maintain code quality, consistency, and compliance. Changes to type definitions, hooks, and components must preserve the functionality of existing components, such as poem creation and editing forms. The workflow from `cursorai_task_execution_workflow_prd.md` is mandatory for each task.

## Components and Features

### Entities
- **Poem Entity**:
  - **Location**: `src/entities/poem/`
  - **Purpose**: Manages poem data, including content, author, tags, and statistics.
  - **Components**: `PoemContent.tsx`, `ui.ts` (e.g., `BY_AUTHOR_LABEL`, `TAGS_LABEL`).
  - **Dependencies**: `poemRepository`.
  - **Types**: Re-export base types from `@/generated/prisma` (e.g., `Poem as PrismaPoem`, `Tag`, `Statistics`). Extend or create custom types as needed, ensuring compatibility with existing poem creation and editing forms.

- **User Entity** (Existing):
  - **Location**: `src/entities/user/`
  - **Purpose**: Manages user data for author information display.
  - **Components**: `AuthorInfo.tsx`, `ui.ts` (e.g., `POEM_COUNT_LABEL`, `MEMBER_SINCE_LABEL`).
  - **Dependencies**: `userRepository` (existing).
  - **Types**: Assumes Prisma base types are re-exported from `@/generated/prisma` as `User as PrismaUser`. Extend or create custom types as needed.

- **Comment Entity**:
  - **Location**: `src/entities/comment/`
  - **Purpose**: Manages comment data.
  - **Dependencies**: `commentRepository`.
  - **Types**: Re-export base types from `@/generated/prisma` (e.g., `Comment as PrismaComment`). Extend or create custom types as needed.

- **Review Entity**:
  - **Location**: `src/entities/review/`
  - **Purpose**: Manages review data, including content and rating.
  - **Dependencies**: `reviewRepository`.
  - **Types**: Re-export base types from `@/generated/prisma` (e.g., `Review as PrismaReview`). Extend or create custom types as needed.

### Features
- **Comment Feature**:
  - **Location**: `src/features/comment/`
  - **Purpose**: Enables users to submit and view comments (SUBSCRIBER+).
  - **Components**: `CommentForm.tsx`, `CommentList.tsx`, `ui.ts`.
  - **Dependencies**: `useCommentForm`, `useComments`, `createComment`.
  - **Compatibility**: Ensure hooks and types do not conflict with existing poem creation/editing forms.

- **Review Feature**:
  - **Location**: `src/features/review/`
  - **Purpose**: Enables users to submit and view reviews with ratings (AUTHOR+).
  - **Components**: `ReviewForm.tsx`, `ReviewList.tsx`, `ui.ts`.
  - **Dependencies**: `useReviewForm`, `useReviews`, `createReview`.
  - **Compatibility**: Ensure hooks and types do not conflict with existing poem creation/editing forms.

- **Moderation Feature (Claim Modal)**:
  - **Location**: `src/features/moderation/`
  - **Purpose**: Reusable modal for reporting content.
  - **Components**: `ClaimModal.tsx`, `ui.ts`.
  - **Dependencies**: `createClaimReport`, `ClaimRejectReasons.ts`.

- **Poem Page**:
  - **Location**: `src/app/(noadmin)/poems/[slug]/page.tsx`
  - **Purpose**: Displays poem content, author information, and interaction features.
  - **Components**: Integrates `PoemContent.tsx`, `AuthorInfo.tsx`, `ReviewForm.tsx`, `ReviewList.tsx`, `CommentForm.tsx`, `CommentList.tsx`, `Header`, `Footer`.
  - **Types**: Use re-exported Prisma types from `@/generated/prisma`, extended or custom as needed, ensuring compatibility with existing poem creation/editing forms.

## File Structure

Based on `current_project_files_tree.md`, extended for new components/features:

```
bpoems/
├── docs/
│   ├── architecture_docs/
│   │   ├── current_project_files_tree.md
│   │   └── ... (other existing files)
│   ├── prds/
│   │   ├── patterns/
│   │   │   ├── form_requirements.md
│   │   │   └── ... (other existing files)
│   │   └── ... (other existing files)
│   ├── specs/
│   │   ├── forms_specs/
│   │   │   ├── comment_form_structure.md
│   │   │   └── review_form_structure.md
│   │   ├── moderation_specs/
│   │   │   ├── claim_report_structure.md
│   │   │   └── moderation_activity_structure.md
│   │   ├── plans/
│   │   │   └── poem_page_and_interaction_features_prd.md
│   │   └── ... (other existing files)
│   └── tasks/
│       ├── tasks_descriptions/
│       │   └── release_X.Y/
│       │       ├── release_X.Y_task-1_poem-entity.md
│       │       ├── release_X.Y_task-2_user-entity-updates.md
│       │       ├── release_X.Y_task-3_comment-entity.md
│       │       ├── release_X.Y_task-4_review-entity.md
│       │       ├── release_X.Y_task-5_moderation-feature.md
│       │       ├── release_X.Y_task-6_comment-feature.md
│       │       ├── release_X.Y_task-7_review-feature.md
│       │       ├── release_X.Y_task-8_poem-page-integration.md
│       │       ├── release_X.Y_task-9_validation-and-documentation.md
│       └── ... (other existing files)
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   └── (noadmin)/
│   │       ├── poems/
│   │       │   └── [slug]/
│   │       │       ├── page.tsx
│   │       │       ├── not-found.tsx
│   │       │       └── error.tsx
│   │       └── ... (other existing routes)
│   ├── entities/
│   │   ├── poem/
│   │   │   ├── api/
│   │   │   │   ├── poemRepository.ts
│   │   │   │   └── index.ts
│   │   │   ├── constants/
│   │   │   │   ├── ui.ts
│   │   │   │   └── index.ts
│   │   │   ├── model/
│   │   │   │   ├── types.ts
│   │   │   │   └── index.ts
│   │   │   ├── view/
│   │   │   │   ├── PoemContent.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── user/ (existing)
│   │   │   ├── api/
│   │   │   │   ├── userRepository.ts
│   │   │   │   └── index.ts
│   │   │   ├── constants/
│   │   │   │   ├── ui.ts
│   │   │   │   └── index.ts
│   │   │   ├── model/
│   │   │   │   ├── types.ts
│   │   │   │   └── index.ts
│   │   │   ├── view/
│   │   │   │   ├── AuthorInfo.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── comment/
│   │   │   ├── api/
│   │   │   │   ├── commentRepository.ts
│   │   │   │   └── index.ts
│   │   │   ├── model/
│   │   │   │   ├── types.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   └── review/
│   │       ├── api/
│   │       │   ├── reviewRepository.ts
│   │       │   └── index.ts
│   │       ├── model/
│   │       │   ├── types.ts
│   │       │   └── index.ts
│   │       └── index.ts
│   ├── features/
│   │   ├── comment/
│   │   │   ├── constants/
│   │   │   │   ├── ui.ts
│   │   │   │   └── index.ts
│   │   │   ├── lib/
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useCommentForm.ts
│   │   │   │   │   ├── useComments.ts
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   ├── model/
│   │   │   │   ├── schemas.ts
│   │   │   │   ├── types.ts
│   │   │   │   └── index.ts
│   │   │   ├── server-actions/
│   │   │   │   ├── createComment.ts
│   │   │   │   └── index.ts
│   │   │   ├── ui/
│   │   │   │   ├── CommentForm.tsx
│   │   │   │   ├── CommentList.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── review/
│   │   │   ├── constants/
│   │   │   │   ├── ui.ts
│   │   │   │   └── index.ts
│   │   │   ├── lib/
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useReviewForm.ts
│   │   │   │   │   ├── useReviews.ts
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   ├── model/
│   │   │   │   ├── schemas.ts
│   │   │   │   ├── types.ts
│   │   │   │   └── index.ts
│   │   │   ├── server-actions/
│   │   │   │   ├── createReview.ts
│   │   │   │   └── index.ts
│   │   │   ├── ui/
│   │   │   │   ├── ReviewForm.tsx
│   │   │   │   ├── ReviewList.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── moderation/
│   │   │   ├── constants/
│   │   │   │   ├── ui.ts
│   │   │   │   └── index.ts
│   │   │   ├── server-actions/
│   │   │   │   ├── createClaimReport.ts
│   │   │   │   └── index.ts
│   │   │   ├── ui/
│   │   │   │   ├── ClaimModal.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   └── ... (other existing features)
│   ├── shared/
│   │   ├── constants/
│   │   │   ├── ErrorMessages.ts
│   │   │   ├── RoutePath.ts
│   │   │   ├── ClaimRejectReasons.ts
│   │   │   ├── ContentStatus.ts
│   │   │   ├── Roles.ts
│   │   │   └── index.ts
│   │   ├── lib/
│   │   │   ├── utils/
│   │   │   │   ├── formatDate.ts
│   │   │   │   ├── slugify.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── auth.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── ui/
│   │   │   ├── shadcnComponents/
│   │   │   │   ├── form.tsx
│   │   │   │   ├── textarea.tsx
│   │   │   │   ├── button.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   └── widgets/
│       ├── header/
│       │   ├── ui/
│       │   │   ├── Header.tsx
│       │   │   └── index.ts
│       │   └── index.ts
│       └── footer/
│           ├── ui/
│           │   ├── Footer.tsx
│           │   └── index.ts
│           └── index.ts
```

## Development Tasks

Each task follows the workflow from `cursorai_task_execution_workflow_prd.md`: Task Analysis, Code Implementation, TypeScript Validation, Linting, Build Validation, Code Review Simulation, Documentation Update.

### Task 1: Poem Entity Implementation
- **ID**: `release_X.Y_task-1_poem-entity`
- **Objective**: Implement the poem entity to manage poem data, ensuring type definitions and components do not break existing poem creation/editing forms.
- **Actions**:
  - **Task Analysis**:
    - Review `main_prd.md`, `tech_prd.md`, `design_prd.md`, `form_requirements.md`, `arc_general_doc.md`.
    - Review existing poem creation/editing forms to identify type dependencies (e.g., `PrismaPoem`, `Tag`, `Statistics`).
    - Create `docs/tasks_descriptions/release_X.Y/release_X.Y_task-1_poem-entity.md` with implementation steps, code examples, FSD compliance details, dependencies (e.g., `userRepository`), and compatibility checks for existing forms.
  - **Code Implementation**:
    - Create `src/entities/poem/api/poemRepository.ts` for CRUD operations, ensuring compatibility with existing repository methods used by poem forms.
    - Define types in `src/entities/poem/model/types.ts`, re-exporting base types from `@/generated/prisma` (e.g., `Poem as PrismaPoem`, `Tag`, `Statistics`). Extend or create custom types as needed, ensuring no conflicts with existing form types:
      ```typescript
      // src/entities/poem/model/types.ts
      import type { Poem as PrismaPoem, Tag, Statistics } from '@/generated/prisma';

      // Re-export Prisma base types
      export type { PrismaPoem, Tag, Statistics };

      // Extended type for business logic, compatible with poem creation/editing forms
      export type PoemWithRelations = PrismaPoem & {
        tags: Tag[];
        statistics: Statistics | null;
        author: { id: string; name: string };
      };
      ```
    - Implement `PoemContent.tsx` in `src/entities/poem/view/`:
      ```typescript
      // src/entities/poem/view/PoemContent.tsx
      import { PoemWithRelations, Tag } from '@/entities/poem/model/types';
      import { User } from '@/entities/user/model/types';
      import { UIConstants } from '@/entities/poem/constants/ui';
      import { formatDate } from '@/shared/lib/utils/formatDate';

      interface PoemContentProps {
        poem: PoemWithRelations;
        author: User;
      }

      export function PoemContent({ poem, author }: PoemContentProps) {
        return (
          <article className="prose prose-lg max-w-none">
            <header className="mb-8">
              <h1 className="text-3xl font-bold mb-4">{poem.title}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span>{UIConstants.BY_AUTHOR_LABEL} {author.name}</span>
                <span>{UIConstants.SEPARATOR}</span>
                <time dateTime={poem.createdAt.toISOString()}>
                  {formatDate(poem.createdAt)}
                </time>
              </div>
            </header>
            <div className="poem-content">
              {poem.content.map((block, index) => (
                <PoemContentBlock key={index} block={block} />
              ))}
            </div>
            {poem.tags.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">{UIConstants.TAGS_LABEL}</h3>
                <div className="flex gap-2">
                  {poem.tags.map((tag: Tag) => (
                    <TagBadge key={tag.id} tag={tag} />
                  ))}
                </div>
              </div>
            )}
          </article>
        );
      }
      ```
    - Create `src/entities/poem/constants/ui.ts` for UI constants (e.g., `BY_AUTHOR_LABEL`, `TAGS_LABEL`).
    - Export via `src/entities/poem/index.ts`.
  - **TypeScript Validation**: Run `npx tsc --noEmit`, ensuring no errors in existing poem creation/editing forms, fix errors, document fixes.
  - **Linting**: Run `npm run lint:fix`, ensure ESLint/Prettier compliance.
  - **Build Validation**: Run `npm run build`, verify existing forms build successfully, fix errors, document fixes.
  - **Code Review Simulation**:
    - Verify FSD compliance, TypeScript typing (Prisma re-exports and custom types), UI constant usage, accessibility (ARIA, 4.5:1 contrast), English-only comments.
    - Ensure type changes do not break existing poem creation/editing forms.
    - Revise if needed.
  - **Documentation Update**:
    - Update task document with implementation details, code examples, Prisma re-export usage, compatibility checks, and validation outcomes.
    - Update `docs/architecture_docs/current_project_files_tree.md`.

### Task 2: User Entity Updates
- **ID**: `release_X.Y_task-2_user-entity-updates`
- **Objective**: Update the existing user entity for author information display, ensuring compatibility with existing components.
- **Actions**:
  - **Task Analysis**:
    - Review existing `src/entities/user/` and requirements.
    - Create `docs/tasks_descriptions/release_X.Y/release_X.Y_task-2_user-entity-updates.md`.
  - **Code Implementation**:
    - Implement `AuthorInfo.tsx` in `src/entities/user/view/`:
      ```typescript
      // src/entities/user/view/AuthorInfo.tsx
      import { User } from '@/entities/user/model/types';
      import { UIConstants } from '@/entities/user/constants/ui';
      import { formatDate } from '@/shared/lib/utils/formatDate';

      interface AuthorInfoProps {
        author: User;
        poemCount: number;
      }

      export function AuthorInfo({ author, poemCount }: AuthorInfoProps) {
        return (
          <section className="bg-muted/50 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">
                {author.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">{author.name}</h2>
                {author.bio && (
                  <p className="text-muted-foreground mb-3">{author.bio}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{UIConstants.POEM_COUNT_LABEL} {poemCount}</span>
                  <span>{UIConstants.SEPARATOR}</span>
                  <span>{UIConstants.MEMBER_SINCE_LABEL} {formatDate(author.createdAt)}</span>
                </div>
              </div>
            </div>
          </section>
        );
      }
      ```
    - Create `src/entities/user/constants/ui.ts` for UI constants.
    - Update `src/entities/user/model/types.ts`, ensuring Prisma `User as PrismaUser` is re-exported and extended if needed, maintaining compatibility with existing components:
      ```typescript
      // src/entities/user/model/types.ts
      import type { User as PrismaUser } from '@/generated/prisma';

      // Re-export Prisma base type
      export type { PrismaUser };

      // Extended type for business logic (if needed)
      export type User = PrismaUser & {
        poemCount?: number;
      };
      ```
    - Use existing `src/entities/user/api/userRepository.ts`.
    - Update `src/entities/user/index.ts` for exports.
  - **TypeScript Validation**, **Linting**, **Build Validation**, **Code Review Simulation**: Same as Task 1, ensuring no impact on existing components.
  - **Documentation Update**:
    - Update task document with Prisma re-export details and compatibility notes.
    - Update `current_project_files_tree.md`.

### Task 3: Comment Entity Implementation
- **ID**: `release_X.Y_task-3_comment-entity`
- **Objective**: Implement the comment entity for poem interactions.
- **Actions**:
  - **Task Analysis**:
    - Review requirements and create `docs/tasks_descriptions/release_X.Y/release_X.Y_task-3_comment-entity.md`.
  - **Code Implementation**:
    - Create `src/entities/comment/api/commentRepository.ts` for CRUD operations.
    - Define types in `src/entities/comment/model/types.ts`, re-exporting `Comment as PrismaComment` from `@/generated/prisma` and extending as needed:
      ```typescript
      // src/entities/comment/model/types.ts
      import type { Comment as PrismaComment } from '@/generated/prisma';

      // Re-export Prisma base type
      export type { PrismaComment };

      // Extended type for business logic
      export type CommentWithRelations = PrismaComment & {
        author: { id: string; name: string };
        poem: { id: string; slug: string };
      };
      ```
    - Export via `src/entities/comment/index.ts`.
  - **TypeScript Validation**, **Linting**, **Build Validation**, **Code Review Simulation**: Same as Task 1.
  - **Documentation Update**:
    - Update task document with Prisma re-export details.
    - Update `current_project_files_tree.md`.

### Task 4: Review Entity Implementation
- **ID**: `release_X.Y_task-4_review-entity`
- **Objective**: Implement the review entity for poem reviews.
- **Actions**:
  - **Task Analysis**:
    - Review requirements and create `docs/tasks_descriptions/release_X.Y/release_X.Y_task-4_review-entity.md`.
  - **Code Implementation**:
    - Create `src/entities/review/api/reviewRepository.ts` for CRUD operations.
    - Define types in `src/entities/review/model/types.ts`, re-exporting `Review as PrismaReview` from `@/generated/prisma` and extending as needed:
      ```typescript
      // src/entities/review/model/types.ts
      import type { Review as PrismaReview } from '@/generated/prisma';

      // Re-export Prisma base type
      export type { PrismaReview };

      // Extended type for business logic
      export type ReviewWithRelations = PrismaReview & {
        author: { id: string; name: string };
        poem: { id: string; slug: string };
      };
      ```
    - Export via `src/entities/review/index.ts`.
  - **TypeScript Validation**, **Linting**, **Build Validation**, **Code Review Simulation**: Same as Task 1.
  - **Documentation Update**:
    - Update task document with Prisma re-export details.
    - Update `current_project_files_tree.md`.

### Task 5: Moderation Feature (Claim Modal) Implementation
- **ID**: `release_X.Y_task-5_moderation-feature`
- **Objective**: Implement the reusable claim modal for reporting content.
- **Actions**:
  - **Task Analysis**:
    - Review requirements and create `docs/tasks_descriptions/release_X.Y/release_X.Y_task-5_moderation-feature.md`.
  - **Code Implementation**:
    - Create `src/features/moderation/server-actions/createClaimReport.ts` supporting `ClaimResourceType.COMMENT` and `ClaimResourceType.REVIEW`.
    - Implement `ClaimModal.tsx` in `src/features/moderation/ui/` using `Dialog` from `shadcn/ui`.
    - Create `src/features/moderation/constants/ui.ts` for UI constants (e.g., `CLAIM_MODAL_TITLE`, `CLAIM_REASON_LABEL`).
    - Define schemas in `src/features/moderation/model/schemas.ts` and types in `src/features/moderation/model/types.ts`, re-exporting `ClaimReport as PrismaClaimReport` from `@/generated/prisma` if applicable.
    - Export via `src/features/moderation/index.ts`.
  - **TypeScript Validation**, **Linting**, **Build Validation**, **Code Review Simulation**: Same as Task 1.
  - **Documentation Update**:
    - Update task document with Prisma re-export details if used.
    - Update `current_project_files_tree.md`.
    - Update `prisma/schema.prisma` and `docs/specs/moderation_specs/claim_report_structure.md`.

### Task 6: Comment Feature Implementation
- **ID**: `release_X.Y_task-6_comment-feature`
- **Objective**: Implement the comment feature for poem interactions, ensuring hooks and types do not break existing poem creation/editing forms.
- **Actions**:
  - **Task Analysis**:
    - Review requirements and existing poem creation/editing forms to identify dependencies.
    - Create `docs/tasks_descriptions/release_X.Y/release_X.Y_task-6_comment-feature.md` with compatibility checks.
  - **Code Implementation**:
    - Create `src/features/comment/model/schemas.ts` with Zod schemas (version 4.0.10).
    - Define types in `src/features/comment/model/types.ts` (e.g., `CommentFormData`), extending `PrismaComment` if needed, ensuring compatibility with existing forms.
    - Implement `useCommentForm.ts` and `useComments.ts` in `src/features/comment/lib/hooks/`, verifying no conflicts with existing hooks:
      ```typescript
      // src/features/comment/lib/hooks/useCommentForm.ts
      import { useForm } from 'react-hook-form';
      import { zodResolver } from '@hookform/resolvers/zod';
      import { commentFormSchema, type CommentFormData } from '../model/schemas';

      interface UseCommentFormProps {
        onSuccess?: (data: CommentFormData) => void;
      }

      export function useCommentForm({ onSuccess }: UseCommentFormProps) {
        const form = useForm<CommentFormData>({
          resolver: zodResolver(commentFormSchema),
          defaultValues: {
            content: '',
          },
        });

        const handleSubmit = (data: CommentFormData) => {
          const formData = new FormData();
          formData.append('content', data.content);
          if (onSuccess) onSuccess(data);
          return formData;
        };

        return { form, handleSubmit };
      }
      ```
    - Create `createComment.ts` in `src/features/comment/server-actions/`:
      ```typescript
      // src/features/comment/server-actions/createComment.ts
      'use server';

      import { revalidatePath } from 'next/cache';
      import { auth } from '@/shared/api/auth/auth';
      import { commentRepository } from '@/entities/comment/api/commentRepository';
      import { commentFormSchema } from '../model/schemas';
      import { ErrorMessages } from '@/shared/constants/ErrorMessages';
      import { RoutePath } from '@/shared/constants/RoutePath';
      import { UIConstants } from '../constants/ui';
      import sanitizeHtml from 'sanitize-html';

      export async function createComment(formData: FormData) {
        try {
          const session = await auth();
          if (!session?.user) {
            throw new Error(ErrorMessages.UNAUTHORIZED);
          }

          if (!['SUBSCRIBER', 'AUTHOR', 'MODERATOR', 'ADMIN'].includes(session.user.role)) {
            throw new Error(ErrorMessages.SUBSCRIBER_REQUIRED);
          }

          const rawData = {
            content: formData.get('content') as string,
            poemId: formData.get('poemId') as string,
          };
          const validatedData = commentFormSchema.parse(rawData);

          const sanitizedContent = sanitizeHtml(validatedData.content, {
            allowedTags: [],
            allowedAttributes: {},
          });

          const comment = await commentRepository.create({
            content: sanitizedContent,
            authorId: session.user.id,
            poemId: validatedData.poemId,
          });

          revalidatePath(RoutePath.POEMS);

          return {
            success: true,
            message: UIConstants.COMMENT_SUCCESS_MESSAGE,
            data: comment,
          };
        } catch (error) {
          console.error('Error creating comment:', error);
          return {
            success: false,
            message: error instanceof Error ? error.message : ErrorMessages.UNKNOWN_ERROR,
          };
        }
      }
      ```
    - Implement `CommentForm.tsx` and `CommentList.tsx` in `src/features/comment/ui/`:
      ```typescript
      // src/features/comment/ui/CommentForm.tsx
      'use client';

      import { useActionState, startTransition } from 'react';
      import { useForm } from 'react-hook-form';
      import { zodResolver } from '@hookform/resolvers/zod';
      import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/shadcnComponents/form';
      import { Textarea } from '@/shared/ui/shadcnComponents/textarea';
      import { Button } from '@/shared/ui/shadcnComponents/button';
      import { UIConstants } from '../constants/ui';
      import { useCommentForm } from '../lib/hooks/useCommentForm';
      import { createComment } from '../server-actions/createComment';
      import { commentFormSchema, type CommentFormData } from '../model/schemas';

      interface CommentFormProps {
        poemId: string;
        onSuccess?: (data: CommentFormData) => void;
        onCancel?: () => void;
      }

      export const CommentForm = ({ poemId, onSuccess, onCancel }: CommentFormProps) => {
        const [state, formAction] = useActionState(createComment, { success: false, message: '' });
        const { form, handleSubmit } = useCommentForm({ onSuccess });
        const onSubmit = (data: CommentFormData) => {
          const formData = handleSubmit(data);
          formData.append('poemId', poemId);
          startTransition(() => formAction(formData));
        };

        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel id="content-label">{UIConstants.COMMENT_CONTENT_LABEL}</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={UIConstants.COMMENT_CONTENT_PLACEHOLDER}
                        aria-labelledby="content-label"
                        aria-describedby="content-error"
                        aria-invalid={!!form.formState.errors.content}
                        className="bg-background border-input text-foreground"
                      />
                    </FormControl>
                    <FormMessage id="content-error" />
                  </FormItem>
                )}
              />
              {state.message && (
                <div
                  className={`text-sm p-3 rounded-md border ${
                    state.success ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                  }`}
                  role="alert"
                  aria-live="polite"
                >
                  {state.message}
                </div>
              )}
              <div className="flex items-center justify-end space-x-2">
                {onCancel && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      form.reset();
                      onCancel();
                    }}
                    className="bg-background border-input text-foreground"
                  >
                    {UIConstants.CANCEL_BUTTON}
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {form.formState.isSubmitting ? UIConstants.SUBMITTING_BUTTON : UIConstants.SUBMIT_BUTTON}
                </Button>
              </div>
            </form>
          </Form>
        );
      };
      ```
    - Create `src/features/comment/constants/ui.ts` for UI constants.
    - Export via `src/features/comment/index.ts`.
  - **TypeScript Validation**: Run `npx tsc --noEmit`, ensuring no errors in existing poem creation/editing forms.
  - **Linting**, **Build Validation**, **Code Review Simulation**: Same as Task 1, verifying hooks and types do not break existing forms.
  - **Documentation Update**:
    - Update task document with compatibility checks.
    - Update `current_project_files_tree.md`.
    - Update `docs/specs/forms_specs/comment_form_structure.md`.

### Task 7: Review Feature Implementation
- **ID**: `release_X.Y_task-7_review-feature`
- **Objective**: Implement the review feature for poem reviews, ensuring hooks and types do not break existing poem creation/editing forms.
- **Actions**:
  - **Task Analysis**:
    - Review requirements and existing poem creation/editing forms.
    - Create `docs/tasks_descriptions/release_X.Y/release_X.Y_task-7_review-feature.md` with compatibility checks.
  - **Code Implementation**:
    - Create `src/features/review/model/schemas.ts` with Zod schemas.
    - Define types in `src/features/review/model/types.ts` (e.g., `ReviewFormData`), extending `PrismaReview` if needed, ensuring compatibility with existing forms.
    - Implement `useReviewForm.ts` and `useReviews.ts` in `src/features/review/lib/hooks/`, verifying no conflicts with existing hooks:
      ```typescript
      // src/features/review/lib/hooks/useReviewForm.ts
      import { useForm } from 'react-hook-form';
      import { zodResolver } from '@hookform/resolvers/zod';
      import { reviewFormSchema, type ReviewFormData } from '../model/schemas';

      interface UseReviewFormProps {
        onSuccess?: (data: ReviewFormData) => void;
      }

      export function useReviewForm({ onSuccess }: UseReviewFormProps) {
        const form = useForm<ReviewFormData>({
          resolver: zodResolver(reviewFormSchema),
          defaultValues: {
            content: '',
            rating: 0,
          },
        });

        const handleSubmit = (data: ReviewFormData) => {
          const formData = new FormData();
          formData.append('content', data.content);
          formData.append('rating', data.rating.toString());
          if (onSuccess) onSuccess(data);
          return formData;
        };

        return { form, handleSubmit };
      }
      ```
    - Create `createReview.ts` in `src/features/review/server-actions/`:
      ```typescript
      // src/features/review/server-actions/createReview.ts
      'use server';

      import { revalidatePath } from 'next/cache';
      import { auth } from '@/shared/api/auth/auth';
      import { reviewRepository } from '@/entities/review/api/reviewRepository';
      import { reviewFormSchema } from '../model/schemas';
      import { ErrorMessages } from '@/shared/constants/ErrorMessages';
      import { RoutePath } from '@/shared/constants/RoutePath';
      import { UIConstants } from '../constants/ui';
      import sanitizeHtml from 'sanitize-html';

      export async function createReview(formData: FormData) {
        try {
          const session = await auth();
          if (!session?.user) {
            throw new Error(ErrorMessages.UNAUTHORIZED);
          }

          if (!['AUTHOR', 'MODERATOR', 'ADMIN'].includes(session.user.role)) {
            throw new Error(ErrorMessages.AUTHOR_REQUIRED);
          }

          const rawData = {
            content: formData.get('content') as string,
            rating: Number(formData.get('rating')),
            poemId: formData.get('poemId') as string,
          };
          const validatedData = reviewFormSchema.parse(rawData);

          const sanitizedContent = sanitizeHtml(validatedData.content, {
            allowedTags: [],
            allowedAttributes: {},
          });

          const review = await reviewRepository.create({
            content: sanitizedContent,
            rating: validatedData.rating,
            authorId: session.user.id,
            poemId: validatedData.poemId,
          });

          revalidatePath(RoutePath.POEMS);

          return {
            success: true,
            message: UIConstants.REVIEW_SUCCESS_MESSAGE,
            data: review,
          };
        } catch (error) {
          console.error('Error creating review:', error);
          return {
            success: false,
            message: error instanceof Error ? error.message : ErrorMessages.UNKNOWN_ERROR,
          };
        }
      }
      ```
    - Implement `ReviewForm.tsx` and `ReviewList.tsx` in `src/features/review/ui/` using `shadcn/ui`, Tailwind CSS, and UI constants.
    - Create `src/features/review/constants/ui.ts` for UI constants (e.g., `RATING_LABEL`, `SUBMIT_BUTTON`).
    - Export via `src/features/review/index.ts`.
  - **TypeScript Validation**: Run `npx tsc --noEmit`, ensuring no errors in existing poem creation/editing forms.
  - **Linting**, **Build Validation**, **Code Review Simulation**: Same as Task 1, verifying hooks and types do not break existing forms.
  - **Documentation Update**:
    - Update task document with compatibility checks.
    - Update `current_project_files_tree.md`.
    - Update `docs/specs/forms_specs/review_form_structure.md`.

### Task 8: Poem Page Integration
- **ID**: `release_X.Y_task-8_poem-page-integration`
- **Objective**: Integrate components into the poem page, ensuring type definitions and components do not break existing poem creation/editing forms.
- **Actions**:
  - **Task Analysis**:
    - Review requirements and existing poem creation/editing forms to identify dependencies.
    - Create `docs/tasks_descriptions/release_X.Y/release_X.Y_task-8_poem-page-integration.md` with compatibility checks.
  - **Code Implementation**:
    - Create `src/app/(noadmin)/poems/[slug]/page.tsx`, using re-exported Prisma types, extended as needed, ensuring compatibility with existing forms:
      ```typescript
      // src/app/(noadmin)/poems/[slug]/page.tsx
      import { poemRepository } from '@/entities/poem/api/poemRepository';
      import { userRepository } from '@/entities/user/api/userRepository';
      import { reviewRepository } from '@/entities/review/api/reviewRepository';
      import { commentRepository } from '@/entities/comment/api/commentRepository';
      import { notFound } from 'next/navigation';
      import { ErrorMessages } from '@/shared/constants/ErrorMessages';
      import { PoemContent } from '@/entities/poem/view/PoemContent';
      import { AuthorInfo } from '@/entities/user/view/AuthorInfo';
      import { ReviewForm } from '@/features/review/ui/ReviewForm';
      import { ReviewList } from '@/features/review/ui/ReviewList';
      import { CommentForm } from '@/features/comment/ui/CommentForm';
      import { CommentList } from '@/features/comment/ui/CommentList';
      import { PoemWithRelations } from '@/entities/poem/model/types';
      import { User } from '@/entities/user/model/types';
      import { ReviewWithRelations } from '@/entities/review/model/types';
      import { CommentWithRelations } from '@/entities/comment/model/types';

      interface PoemPageProps {
        params: { slug: string };
      }

      export default async function PoemPage({ params }: PoemPageProps) {
        try {
          const poem: PoemWithRelations | null = await poemRepository.findBySlug(params.slug);
          if (!poem) {
            notFound();
          }

          const [author, reviews, comments]: [User | null, ReviewWithRelations[], CommentWithRelations[]] = await Promise.all([
            userRepository.findById(poem.authorId),
            reviewRepository.findByPoemId(poem.id, { limit: 10 }),
            commentRepository.findByPoemId(poem.id, { limit: 20 }),
          ]);

          if (!author) {
            throw new Error(ErrorMessages.AUTHOR_NOT_FOUND);
          }

          return (
            <div className="container mx-auto px-4 py-8">
              <PoemContent poem={poem} author={author} />
              <AuthorInfo author={author} poemCount={author.poemCount} />
              <ReviewForm poemId={poem.id} />
              <ReviewList reviews={reviews} />
              <CommentForm poemId={poem.id} />
              <CommentList comments={comments} />
            </div>
          );
        } catch (error) {
          console.error('Error loading poem page:', error);
          throw new Error(ErrorMessages.PAGE_LOAD_FAILED);
        }
      }
      ```
    - Add `src/app/(noadmin)/poems/[slug]/not-found.tsx` and `error.tsx`.
    - Integrate `Header` and `Footer` from `src/widgets/`.
  - **TypeScript Validation**: Run `npx tsc --noEmit`, ensuring no errors in existing poem creation/editing forms.
  - **Linting**, **Build Validation**, **Code Review Simulation**: Same as Task 1, verifying types and components do not break existing forms.
  - **Documentation Update**:
    - Update task document with Prisma re-export, custom type, and compatibility details.
    - Update `current_project_files_tree.md`.
    - Update `docs/specs/pages_specs/poem_page_structure.md`.

### Task 9: Validation and Documentation
- **ID**: `release_X.Y_task-9_validation-and-documentation`
- **Objective**: Validate code and finalize documentation, ensuring no impact on existing poem creation/editing forms.
- **Actions**:
  - **Task Analysis**:
    - Review requirements and existing poem creation/editing forms.
    - Create `docs/tasks_descriptions/release_X.Y/release_X.Y_task-9_validation-and-documentation.md` with compatibility checks.
  - **Code Implementation**:
    - Run `npx tsc --noEmit` for TypeScript validation, verifying existing forms.
    - Run `npm run lint:fix` for linting.
    - Run `npm run build` for build validation, ensuring existing forms build successfully.
    - Fix errors and document resolutions.
  - **Code Review Simulation**:
    - Verify FSD compliance, TypeScript typing (Prisma re-exports and custom types), UI constant usage, accessibility, English-only comments, and compatibility with existing poem creation/editing forms.
    - Revise code if needed.
  - **Documentation Update**:
    - Update all task documents with validation outcomes, code examples, Prisma re-export usage, compatibility checks, and deviations.
    - Update `docs/architecture_docs/current_project_files_tree.md`.
    - Update `prisma/schema.prisma` for comment, review, and claim models.
    - Update `docs/specs/moderation_specs/`, `docs/specs/pages_specs/`, and `docs/specs/forms_specs/`.
    - Replace `comment_feature_plan.md`, `review_feature_plan.md`, `poem_page_plan.md` with this PRD in `docs/specs/plans/`.

## Success Metrics
- **Code Quality**: Zero TypeScript errors, zero linting issues, successful builds, no impact on existing poem creation/editing forms.
- **Documentation**: Complete task documents with Prisma re-export, custom type, and compatibility details.
- **Functionality**: Poem page, comment, and review features meet `main_prd.md` requirements.
- **Design**: Adheres to `design_prd.md` (responsive, accessible, Tailwind styling).
- **FSD Compliance**: Follows layer separation and import rules.

## Error Handling and Recovery
- **Error Handling**:
  - Server actions return messages from `ErrorMessages.ts` or feature-specific `ui.ts`.
  - Log errors to console and Vercel Analytics.
  - Return structured responses (e.g., `{ success: false, message: ErrorMessages.UNAUTHORIZED }`).
- **Recovery Procedures**:
  - Revert to last known working state using git if errors persist, especially if affecting existing forms.
  - Document issues and resolutions in task documents.
  - Propose alternative approaches if needed.

## Development Sequence Rationale
- **Tasks 1–4 (Entities)**: Implement poem, comment, and review entities, and update the user entity, re-exporting Prisma base types from `@/generated/prisma` and extending or creating custom types, ensuring compatibility with existing poem creation/editing forms.
- **Task 5 (Moderation)**: Implement the shared claim modal first to resolve dependencies.
- **Tasks 6–7 (Features)**: Implement comment and review features, ensuring hooks and types do not break existing forms.
- **Task 8 (Page Integration)**: Combine components into the poem page, using Prisma re-exported or custom types, ensuring compatibility with existing forms.
- **Task 9 (Validation/Documentation)**: Finalize validation and documentation, verifying no impact on existing forms.

This sequence minimizes dependencies and ensures efficient integration while preserving existing functionality.

**Document Version**: 1.5  
**Last Updated**: August 27, 2025, 08:03 PM BST  
**Next Review**: September 10, 2025