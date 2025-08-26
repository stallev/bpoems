# Review Feature Development Plan

## Overview

This plan outlines the development of the review feature, including the form, list, and claim modal, for the poem page (`/poems/[slug]`).

## Components

### ReviewForm
- **Location**: `src/features/review/ui/ReviewForm.tsx`
- **Purpose**: Implements form structure from `review_form_structure.md`
- **Dependencies**: 
  - Uses `useForm` from `react-hook-form` with `zodResolver`
  - Submits via `createReview` Server Action
- **Features**:
  - Textarea for review content (1-1000 characters)
  - Rating dropdown (1-5 stars)
  - Real-time validation
  - Role-based access control (AUTHOR+)
  - Responsive design

### ReviewList
- **Location**: `src/features/review/ui/ReviewList.tsx`
- **Purpose**: Displays reviews for a poem
- **Dependencies**:
  - Fetches reviews using `reviewRepository.findByPoemId`
  - Displays reviews in `flex flex-col gap-4`, each in `bg-background border-input rounded-lg p-4`
- **Features**:
  - Paginated review loading
  - "Report" button (`bg-destructive text-destructive-foreground`) for each review
  - Opens `ClaimModal` for reporting
  - Author information and rating display
  - Star rating visualization

### ClaimModal
- **Location**: `src/features/moderation/ui/ClaimModal.tsx`
- **Purpose**: Modal for reporting content (reused from comment feature)
- **Dependencies**:
  - Uses `Dialog` from `shadcn/ui` with `DialogContent`, `DialogHeader`, `DialogTitle` ("Report Content")
  - Form with `Textarea` for claim message (1–1000 characters)
  - `Select` for claim reason (from `ClaimRejectReasons`)
- **Features**:
  - Submits via `createClaimReport` Server Action
  - Reusable for poem, comment, and review claims
  - Proper form validation and error handling

## Hooks

### useReviewForm
- **Location**: `src/features/review/lib/hooks/useReviewForm.ts`
- **Purpose**: Custom hook for review form management
- **Implementation**:
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

### useReviews
- **Location**: `src/features/review/lib/hooks/useReviews.ts`
- **Purpose**: Custom hook for fetching and managing reviews
- **Implementation**:
  ```typescript
  import { useState, useEffect } from 'react';
  import { reviewRepository } from '@/entities/review/api/reviewRepository';
  import { ReviewWithRelations } from '@/entities/review/model/types';
  
  export const useReviews = (poemId: string) => {
    const [reviews, setReviews] = useState<ReviewWithRelations[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchReviews = async () => {
        try {
          setLoading(true);
          const data = await reviewRepository.findByPoemId(poemId);
          setReviews(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load reviews');
        } finally {
          setLoading(false);
        }
      };
  
      fetchReviews();
    }, [poemId]);
  
    return { reviews, loading, error, refetch: () => fetchReviews() };
  };
  ```

## Server Actions

### createReview
- **Location**: `src/features/review/server-actions/createReview.ts`
- **Purpose**: Creates a new review with rating
- **Implementation**:
  ```typescript
  'use server';
  
  import { revalidatePath } from 'next/cache';
  import { auth } from '@/shared/api/auth/auth';
  import { reviewRepository } from '@/entities/review/api/reviewRepository';
  import { reviewFormSchema } from '../model/schemas';
  import { ErrorMessages } from '@/shared/constants/ErrorMessages';
  import { RoutePath } from '@/shared/constants/RoutePath';
  import sanitizeHtml from 'sanitize-html';
  
  export async function createReview(formData: FormData) {
    try {
      // 1. Authentication check
      const session = await auth();
      if (!session?.user) {
        throw new Error(ErrorMessages.UNAUTHORIZED);
      }
  
      // 2. Authorization check
      if (!['AUTHOR', 'MODERATOR', 'ADMIN'].includes(session.user.role)) {
        throw new Error(ErrorMessages.AUTHOR_REQUIRED);
      }
  
      // 3. Data parsing and validation
      const rawData = {
        content: formData.get('content') as string,
        rating: Number(formData.get('rating')),
        poemId: formData.get('poemId') as string,
      };
  
      const validatedData = reviewFormSchema.parse(rawData);
  
      // 4. Input sanitization
      const sanitizedContent = sanitizeHtml(validatedData.content, {
        allowedTags: [],
        allowedAttributes: {},
      });
  
      // 5. Create review
      const review = await reviewRepository.create({
        content: sanitizedContent,
        rating: validatedData.rating,
        authorId: session.user.id,
        poemId: validatedData.poemId,
      });
  
      // 6. Cache revalidation
      revalidatePath(RoutePath.POEMS);
  
      // 7. Success response
      return {
        success: true,
        message: 'Review created successfully',
        data: review,
      };
    } catch (error) {
      console.error('Error creating review:', error);
      
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
- **Purpose**: Creates a claim report for content (reused from comment feature)
- **Features**:
  - Creates claim with `ClaimResourceType.REVIEW`
  - Sets `claimResultDecision = PENDING`
  - Available for all users (including unauthenticated)

## Development Steps

### Step 1: Create Review Entity
1. Create `src/entities/review/model/types.ts` with Review types
2. Create `src/entities/review/api/reviewRepository.ts` with CRUD methods
3. Create `src/entities/review/index.ts` for public API exports

### Step 2: Create Review Feature Structure
1. Create `src/features/review/model/schemas.ts` with validation schemas
2. Create `src/features/review/model/types.ts` with form types
3. Create `src/features/review/lib/hooks/useReviewForm.ts`
4. Create `src/features/review/lib/hooks/useReviews.ts`

### Step 3: Implement Server Actions
1. Create `src/features/review/server-actions/createReview.ts`
2. Ensure `src/features/moderation/server-actions/createClaimReport.ts` supports reviews
3. Add proper error handling and validation

### Step 4: Implement UI Components
1. Create `src/features/review/ui/ReviewForm.tsx`
2. Create `src/features/review/ui/ReviewList.tsx`
3. Reuse `src/features/moderation/ui/ClaimModal.tsx` from comment feature
4. Add proper styling and accessibility features

### Step 5: Integration and Testing
1. Update `src/features/review/index.ts` for public API exports
2. Ensure `src/features/moderation/index.ts` exports ClaimModal
3. Perform manual testing on `/poems/[slug]` for review creation and claim submission
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
│   └── review/
│       ├── api/
│       │   ├── reviewRepository.ts
│       │   └── index.ts
│       ├── model/
│       │   ├── types.ts
│       │   └── index.ts
│       └── index.ts
├── features/
│   ├── review/
│   │   ├── lib/
│   │   │   ├── hooks/
│   │   │   │   ├── useReviewForm.ts
│   │   │   │   ├── useReviews.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── model/
│   │   │   ├── schemas.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   ├── server-actions/
│   │   │   ├── createReview.ts
│   │   │   └── index.ts
│   │   ├── ui/
│   │   │   ├── ReviewForm.tsx
│   │   │   ├── ReviewList.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   └── moderation/
│       ├── server-actions/
│       │   ├── createClaimReport.ts (updated)
│       │   └── index.ts
│       ├── ui/
│       │   ├── ClaimModal.tsx (reused)
│       │   └── index.ts
│       └── index.ts
```

## Testing Strategy

### Unit Tests
- **Form Validation**: Test Zod schema validation
- **Component Rendering**: Test form and list components
- **Hook Testing**: Test useReviewForm and useReviews hooks
- **Rating System**: Test rating selection and display

### Integration Tests
- **Server Actions**: Test review creation workflow
- **Authorization**: Test role-based access control
- **Error Handling**: Test error scenarios

### Manual Testing
- **User Workflows**: Test complete review creation and reporting
- **Role-based Access**: Test different user roles
- **Responsive Design**: Test on different screen sizes
- **Rating Display**: Test star rating visualization

## Performance Considerations

### Optimization
- **Lazy Loading**: Load review components on demand
- **Pagination**: Implement pagination for large review lists
- **Caching**: Proper cache invalidation after review creation

### Database Optimization
- **Indexes**: Ensure proper database indexes for review queries
- **Efficient Queries**: Optimize review fetching with proper relations
- **Connection Pooling**: Use efficient database connection management

## Security Considerations

### Input Validation
- **Client-side**: Real-time validation with immediate feedback
- **Server-side**: Comprehensive server-side validation
- **Sanitization**: XSS prevention with sanitize-html

### Authorization
- **Role-based Access**: Proper role checking for review creation
- **Ownership**: Users can only edit/delete their own reviews
- **Content Moderation**: Claim reporting system for inappropriate content

## Rating System Implementation

### Rating Scale
- **1 Star**: Плохо (Poor)
- **2 Stars**: Неудовлетворительно (Unsatisfactory)
- **3 Stars**: Удовлетворительно (Satisfactory)
- **4 Stars**: Хорошо (Good)
- **5 Stars**: Отлично (Excellent)

### Rating Display Components
- **StarRating**: Visual star rating component
- **RatingText**: Text representation of rating
- **RatingBadge**: Badge component for rating display

### Rating Validation
- **Range Validation**: Ensure rating is between 1-5
- **Type Validation**: Ensure rating is a number
- **Required Validation**: Ensure rating is provided

## Integration with Poem Page

### Form Placement
- **Location**: Below poem content, above comments
- **Visibility**: Only for users with `AUTHOR` role or higher
- **Conditional Rendering**: Hidden for poem author

### Data Flow
- **Form Submission**: Creates review via Server Action
- **Cache Update**: Revalidates poem page cache
- **UI Update**: Refreshes review list display

### Review List Integration
- **Sorting**: Sort reviews by creation date (newest first)
- **Pagination**: Load reviews in batches for performance
- **Filtering**: Filter reviews by rating if needed

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Next Review**: [Date + 2 weeks]
