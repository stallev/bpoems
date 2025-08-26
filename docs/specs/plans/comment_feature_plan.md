# Comment Feature Development Plan

## Overview

This plan outlines the development of the comment feature, including the form, list, and claim modal, for the poem page (`/poems/[slug]`).

## Components

### CommentForm
- **Location**: `src/features/comment/ui/CommentForm.tsx`
- **Purpose**: Implements form structure from `comment_form_structure.md`
- **Dependencies**: 
  - Uses `useForm` from `react-hook-form` with `zodResolver`
  - Submits via `createComment` Server Action
- **Features**:
  - Textarea for comment content (1-1000 characters)
  - Real-time validation
  - Role-based access control (SUBSCRIBER+)
  - Responsive design

### CommentList
- **Location**: `src/features/comment/ui/CommentList.tsx`
- **Purpose**: Displays comments for a poem
- **Dependencies**:
  - Fetches comments using `commentRepository.findByPoemId`
  - Displays comments in `flex flex-col gap-4`, each in `bg-background border-input rounded-lg p-4`
- **Features**:
  - Paginated comment loading
  - "Report" button (`bg-destructive text-destructive-foreground`) for each comment
  - Opens `ClaimModal` for reporting
  - Author information display

### ClaimModal
- **Location**: `src/features/moderation/ui/ClaimModal.tsx`
- **Purpose**: Modal for reporting content
- **Dependencies**:
  - Uses `Dialog` from `shadcn/ui` with `DialogContent`, `DialogHeader`, `DialogTitle` ("Report Content")
  - Form with `Textarea` for claim message (1–1000 characters)
  - `Select` for claim reason (from `ClaimRejectReasons`)
- **Features**:
  - Submits via `createClaimReport` Server Action
  - Reusable for poem, comment, and review claims
  - Proper form validation and error handling

## Hooks

### useCommentForm
- **Location**: `src/features/comment/lib/hooks/useCommentForm.ts`
- **Purpose**: Custom hook for comment form management
- **Implementation**:
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

### useComments
- **Location**: `src/features/comment/lib/hooks/useComments.ts`
- **Purpose**: Custom hook for fetching and managing comments
- **Implementation**:
  ```typescript
  import { useState, useEffect } from 'react';
  import { commentRepository } from '@/entities/comment/api/commentRepository';
  import { CommentWithRelations } from '@/entities/comment/model/types';
  
  export const useComments = (poemId: string) => {
    const [comments, setComments] = useState<CommentWithRelations[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchComments = async () => {
        try {
          setLoading(true);
          const data = await commentRepository.findByPoemId(poemId);
          setComments(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load comments');
        } finally {
          setLoading(false);
        }
      };
  
      fetchComments();
    }, [poemId]);
  
    return { comments, loading, error, refetch: () => fetchComments() };
  };
  ```

## Server Actions

### createComment
- **Location**: `src/features/comment/server-actions/createComment.ts`
- **Purpose**: Creates a new comment
- **Implementation**:
  ```typescript
  'use server';
  
  import { revalidatePath } from 'next/cache';
  import { auth } from '@/shared/api/auth/auth';
  import { commentRepository } from '@/entities/comment/api/commentRepository';
  import { commentFormSchema } from '../model/schemas';
  import { ErrorMessages } from '@/shared/constants/ErrorMessages';
  import { RoutePath } from '@/shared/constants/RoutePath';
  import sanitizeHtml from 'sanitize-html';
  
  export async function createComment(formData: FormData) {
    try {
      // 1. Authentication check
      const session = await auth();
      if (!session?.user) {
        throw new Error(ErrorMessages.UNAUTHORIZED);
      }
  
      // 2. Authorization check
      if (!['SUBSCRIBER', 'AUTHOR', 'MODERATOR', 'ADMIN'].includes(session.user.role)) {
        throw new Error(ErrorMessages.SUBSCRIBER_REQUIRED);
      }
  
      // 3. Data parsing and validation
      const rawData = {
        content: formData.get('content') as string,
        poemId: formData.get('poemId') as string,
      };
  
      const validatedData = commentFormSchema.parse(rawData);
  
      // 4. Input sanitization
      const sanitizedContent = sanitizeHtml(validatedData.content, {
        allowedTags: [],
        allowedAttributes: {},
      });
  
      // 5. Create comment
      const comment = await commentRepository.create({
        content: sanitizedContent,
        authorId: session.user.id,
        poemId: validatedData.poemId,
      });
  
      // 6. Cache revalidation
      revalidatePath(RoutePath.POEMS);
  
      // 7. Success response
      return {
        success: true,
        message: 'Comment created successfully',
        data: comment,
      };
    } catch (error) {
      console.error('Error creating comment:', error);
      
      if (error instanceof Error) {
        return {
          success: false,
          message: error.message,
        };
      }
  
      return {
        success: false,
        message: ErrorMessages.UNKNOWN_ERROR,
      };
    }
  }
  ```

### createClaimReport
- **Location**: `src/features/moderation/server-actions/createClaimReport.ts`
- **Purpose**: Creates a claim report for content
- **Features**:
  - Creates claim with `ClaimResourceType.COMMENT`
  - Sets `claimResultDecision = PENDING`
  - Available for all users (including unauthenticated)

## Development Steps

### Step 1: Create Comment Entity
1. Create `src/entities/comment/model/types.ts` with Comment types
2. Create `src/entities/comment/api/commentRepository.ts` with CRUD methods
3. Create `src/entities/comment/index.ts` for public API exports

### Step 2: Create Comment Feature Structure
1. Create `src/features/comment/model/schemas.ts` with validation schemas
2. Create `src/features/comment/model/types.ts` with form types
3. Create `src/features/comment/lib/hooks/useCommentForm.ts`
4. Create `src/features/comment/lib/hooks/useComments.ts`

### Step 3: Implement Server Actions
1. Create `src/features/comment/server-actions/createComment.ts`
2. Ensure `src/features/moderation/server-actions/createClaimReport.ts` supports comments
3. Add proper error handling and validation

### Step 4: Implement UI Components
1. Create `src/features/comment/ui/CommentForm.tsx`
2. Create `src/features/comment/ui/CommentList.tsx`
3. Create `src/features/moderation/ui/ClaimModal.tsx` (reusable)
4. Add proper styling and accessibility features

### Step 5: Integration and Testing
1. Update `src/features/comment/index.ts` for public API exports
2. Update `src/features/moderation/index.ts` for public API exports
3. Perform manual testing on `/poems/[slug]` for comment creation and claim submission
4. Run `tsc --noEmit` and `npm run lint:fix`

### Step 6: Documentation and Cleanup
1. Update documentation to reflect new components
2. Ensure all imports use public APIs
3. Verify FSD architecture compliance
4. Test role-based access control

## File Structure

```
src/
├── entities/
│   └── comment/
│       ├── api/
│       │   ├── commentRepository.ts
│       │   └── index.ts
│       ├── model/
│       │   ├── types.ts
│       │   └── index.ts
│       └── index.ts
├── features/
│   ├── comment/
│   │   ├── lib/
│   │   │   ├── hooks/
│   │   │   │   ├── useCommentForm.ts
│   │   │   │   ├── useComments.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── model/
│   │   │   ├── schemas.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   ├── server-actions/
│   │   │   ├── createComment.ts
│   │   │   └── index.ts
│   │   ├── ui/
│   │   │   ├── CommentForm.tsx
│   │   │   ├── CommentList.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   └── moderation/
│       ├── server-actions/
│       │   ├── createClaimReport.ts (updated)
│       │   └── index.ts
│       ├── ui/
│       │   ├── ClaimModal.tsx
│       │   └── index.ts
│       └── index.ts
```

## Testing Strategy

### Unit Tests
- **Form Validation**: Test Zod schema validation
- **Component Rendering**: Test form and list components
- **Hook Testing**: Test useCommentForm and useComments hooks

### Integration Tests
- **Server Actions**: Test comment creation workflow
- **Authorization**: Test role-based access control
- **Error Handling**: Test error scenarios

### Manual Testing
- **User Workflows**: Test complete comment creation and reporting
- **Role-based Access**: Test different user roles
- **Responsive Design**: Test on different screen sizes

## Performance Considerations

### Optimization
- **Lazy Loading**: Load comment components on demand
- **Pagination**: Implement pagination for large comment lists
- **Caching**: Proper cache invalidation after comment creation

### Database Optimization
- **Indexes**: Ensure proper database indexes for comment queries
- **Efficient Queries**: Optimize comment fetching with proper relations
- **Connection Pooling**: Use efficient database connection management

## Security Considerations

### Input Validation
- **Client-side**: Real-time validation with immediate feedback
- **Server-side**: Comprehensive server-side validation
- **Sanitization**: XSS prevention with sanitize-html

### Authorization
- **Role-based Access**: Proper role checking for comment creation
- **Ownership**: Users can only edit/delete their own comments
- **Content Moderation**: Claim reporting system for inappropriate content

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Next Review**: [Date + 2 weeks]
