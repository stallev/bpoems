# Poem Page Structure

## Overview

The Poem page (`src/app/(noadmin)/poems/[slug]/page.tsx`) displays a single poem with its content, category, and author information. It includes functionality for authors to manage their poems, users to add comments and reviews, and all users to report content via claims. The page adheres to `main_prd.md` (MVP Goals, User Stories), `tech_prd.md` (Frontend, Styling, Type Safety), and `design_prd.md` (UI/UX Requirements, Visual Design).

## Structure

### Main Container
- **Container**: `container mx-auto px-4 sm:px-6 lg:px-8`
- **Content**: Displays poem title (`text-2xl sm:text-3xl font-serif font-bold text-foreground`), content (`PoemContentBlock[]`, rendered via `react-quill` in read-only mode with `text-lg font-serif leading-relaxed`), and category (`text-sm text-muted-foreground`)
- **Author Actions**: If the current user is the poem's author (`poem.authorId === session.user.id`):
  - Right-top corner: `DeletePoemButton` (opens `DeletePoemModal`) and `EditPoemLink` (navigates to `RoutePath.EDIT_POEM`)
- **Styling**: `bg-background border border-input rounded-lg p-4 sm:p-6`

### DeletePoemModal
- **Location**: `src/features/poem/ui/DeletePoemModal.tsx`
- **Trigger**: `DeletePoemButton` (styled as `bg-destructive text-destructive-foreground`, `design_prd.md`)
- **Components**: Uses `Dialog` from `shadcn/ui` with `DialogContent`, `DialogHeader`, `DialogTitle` ("Confirm Deletion"), and `DialogFooter` (Cancel/Delete buttons)
- **Functionality**: Calls Server Action `deletePoem` (`src/features/poem/server-actions/deletePoem.ts`) on confirmation, redirects to `RoutePath.PROFILE`
- **Accessibility**: ARIA attributes (`aria-describedby`), keyboard navigation (Tab, Enter)

### CommentForm
- **Location**: `src/features/comment/ui/CommentForm.tsx`
- **Availability**: Available for users with role `SUBSCRIBER` or higher, disabled for the poem's author
- **Validation**: Uses `react-hook-form` and `zod` for validation (text: 1–1000 characters)
- **Submission**: Submits via Server Action `createComment` (`src/features/comment/server-actions/createComment.ts`)
- **Styling**: `flex flex-col gap-4 sm:grid sm:grid-cols-2`, with semantic classes (`bg-background`, `border-input`)
- **Accessibility**: ARIA attributes (`aria-label`, `aria-describedby`), focus indicators (2px purple ring, `design_prd.md`)
- **Documentation**: See `docs/specs/forms_specs/comment_form_structure.md` for detailed structure

### ReviewForm
- **Location**: `src/features/review/ui/ReviewForm.tsx`
- **Availability**: Available for users with role `AUTHOR` or higher, disabled for the poem's author
- **Fields**: Includes rating (1–5, `Select` component) and text (1–2000 characters)
- **Submission**: Submits via Server Action `createReview` (`src/features/review/server-actions/createReview.ts`)
- **Styling**: Similar to `CommentForm`, with `flex flex-col gap-4 sm:grid sm:grid-cols-2`
- **Accessibility**: ARIA attributes, keyboard support for rating selection
- **Documentation**: See `docs/specs/forms_specs/review_form_structure.md` for detailed structure

### CommentList
- **Location**: `src/features/comment/ui/CommentList.tsx`
- **Data**: Displays comments fetched via `commentRepository.findByPoemId` or Server Action
- **Actions**: Each comment includes a "Report" button (`ClaimResourceType.COMMENT`), available for all users (including `READER`)
- **Submission**: Submits claims via Server Action `createClaimReport` (`src/features/moderation/server-actions/createClaimReport.ts`)
- **Styling**: `flex flex-col gap-4`, with each comment in `bg-background border-input rounded-lg p-4`
- **Accessibility**: ARIA attributes for report button (`aria-label="Report comment"`), keyboard navigation

### ReviewList
- **Location**: `src/features/review/ui/ReviewList.tsx`
- **Data**: Displays reviews fetched via `reviewRepository.findByPoemId` or Server Action
- **Actions**: Each review includes a "Report" button (`ClaimResourceType.REVIEW`), available for all users
- **Styling**: Similar to `CommentList`, with rating displayed as stars or text (`text-sm text-accent`)
- **Accessibility**: ARIA attributes for report button and rating (`aria-label="Report review"`)

## Server Actions

### deletePoem.ts
- **Location**: `src/features/poem/server-actions/deletePoem.ts`
- **Functionality**: Deletes poem if the user is the author
- **Revalidation**: Revalidates `RoutePath.POEMS`, `RoutePath.PROFILE`, `RoutePath.DASHBOARD`
- **Authorization**: Checks if user is the poem author or has moderator/admin role

### createComment.ts
- **Location**: `src/features/comment/server-actions/createComment.ts`
- **Functionality**: Creates a comment
- **Authorization**: Checks role (`SUBSCRIBER+`)
- **Revalidation**: Revalidates `RoutePath.POEMS`
- **Validation**: Validates comment text (1-1000 characters)

### createReview.ts
- **Location**: `src/features/review/server-actions/createReview.ts`
- **Functionality**: Creates a review with rating
- **Authorization**: Checks role (`AUTHOR+`)
- **Revalidation**: Revalidates `RoutePath.POEMS`
- **Validation**: Validates review text (1-1000 characters) and rating (1-5)

### createClaimReport.ts
- **Location**: `src/features/moderation/server-actions/createClaimReport.ts`
- **Functionality**: Submits a claim for a poem, comment, or review
- **Status**: Sets `claimResultDecision = PENDING`
- **Authorization**: Available for all users (including unauthenticated)
- **Validation**: Validates claim message and resource type

## Repository and Types for Comment and Review

### Comment Repository
- **File**: `src/entities/comment/api/commentRepository.ts`
- **Methods**:
  - `findById(id: string): Promise<CommentWithRelations | null>` - Fetch a comment by ID with relations (author, poem).
  - `findByPoemId(poemId: string, params?: { skip?: number; take?: number }): Promise<CommentWithRelations[]>` - Fetch comments for a poem.
  - `create(data: CommentCreateInput): Promise<Comment>` - Create a comment.
  - `update(id: string, data: CommentUpdateInput): Promise<Comment>` - Update a comment.
  - `delete(id: string): Promise<void>` - Delete a comment.
- **Relations**: Include `author` and `poem` in `CommentWithRelations`.

### Review Repository
- **File**: `src/entities/review/api/reviewRepository.ts`
- **Methods**:
  - `findById(id: string): Promise<ReviewWithRelations | null>` - Fetch a review by ID with relations (author, poem).
  - `findByPoemId(poemId: string, params?: { skip?: number; take?: number }): Promise<ReviewWithRelations[]>` - Fetch reviews for a poem.
  - `create(data: ReviewCreateInput): Promise<Review>` - Create a review.
  - `update(id: string, data: ReviewUpdateInput): Promise<Review>` - Update a review.
  - `delete(id: string): Promise<void>` - Delete a review.
- **Relations**: Include `author` and `poem` in `ReviewWithRelations`.

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

## Development Plans

### Comment Feature Plan
- **Documentation**: `docs/specs/plans/comment_feature_plan.md`
- **Components**: CommentForm, CommentList, ClaimModal
- **Hooks**: useCommentForm, useComments
- **Server Actions**: createComment, createClaimReport

### Review Feature Plan
- **Documentation**: `docs/specs/plans/review_feature_plan.md`
- **Components**: ReviewForm, ReviewList, ClaimModal (reused)
- **Hooks**: useReviewForm, useReviews
- **Server Actions**: createReview, createClaimReport

### Poem Page Plan
- **Documentation**: `docs/specs/plans/poem_page_plan.md`
- **Components**: PoemPage, DeletePoemModal, CommentForm, CommentList, ReviewForm, ReviewList
- **Server Actions**: deletePoem, createComment, createReview, createClaimReport

## Adaptivity

### Mobile (320px–640px)
- **Layout**: `flex-col` layout
- **Padding**: Reduced padding (`px-4`)
- **Typography**: Smaller text (`text-sm` for labels, `text-base` for content)
- **Spacing**: Compact spacing between elements

### Tablet (640px–1024px)
- **Layout**: `sm:grid sm:grid-cols-2` for forms
- **Padding**: Increased padding (`sm:px-6`)
- **Typography**: Standard text sizes
- **Forms**: Two-column layout for comment and review forms

### Desktop (1024px+)
- **Padding**: `lg:px-8`
- **Container**: Wider containers
- **Typography**: Larger text for headings (`text-3xl`)
- **Spacing**: Generous spacing for readability

### Responsive Classes
- Uses Tailwind responsive classes (`sm:`, `md:`, `lg:`) for fluid scaling
- Maintains readability across all screen sizes
- Optimizes touch targets for mobile devices

## Accessibility

### WCAG 2.1 AA Compliance
- **Contrast**: Minimum 4.5:1 ratio for text (`design_prd.md`)
- **Focus Indicators**: 2px purple ring (`ring-2 ring-primary`, `design_prd.md`)
- **Keyboard Navigation**: Complete keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and semantic HTML

### ARIA Attributes
- **Forms**: `aria-label`, `aria-describedby` for form elements
- **Buttons**: `aria-label` for action buttons (delete, edit, report)
- **Content**: `aria-labelledby` for content sections
- **Status**: `aria-live` for dynamic content updates

### Semantic HTML
- **Structure**: `<main>`, `<section>`, `<article>` for poem content
- **Navigation**: Proper heading hierarchy
- **Forms**: Semantic form elements with labels
- **Lists**: Proper list structure for comments and reviews

### Keyboard Navigation
- **Tab Order**: Logical tab order for interactive elements
- **Enter Key**: Submit forms and activate buttons
- **Escape Key**: Close modals and dialogs
- **Focus Management**: Proper focus handling for dynamic content

## Security

### Input Sanitization
- **Content**: Sanitize user inputs in `CommentForm` and `ReviewForm` using `sanitize-html` to prevent XSS (`tech_prd.md`, Security Metrics)
- **Validation**: Server-side validation for all form submissions
- **CSRF Protection**: Built-in CSRF protection via Server Actions

### Authorization
- **Role-Based Access**: Checks in Server Actions (`SUBSCRIBER` for comments, `AUTHOR` for reviews, `MODERATOR/ADMIN` for claims)
- **Ownership**: Authors can only edit/delete their own poems
- **Content Access**: Proper content access control based on user roles

### Data Protection
- **Input Validation**: Comprehensive validation using Zod schemas
- **SQL Injection Prevention**: Use of Prisma ORM for safe database operations
- **XSS Prevention**: Content sanitization and proper output encoding

## Multilingual Support

### Labels and Messages
- **Constants**: Use constants from `src/shared/constants/LocaleMessages.ts` (RU for MVP, infrastructure for EN, `main_prd.md`)
- **Examples**: 
  - `COMMENT_FORM_LABELS.RU.SUBMIT` for comment form submit button
  - `REVIEW_FORM_LABELS.RU.RATING` for review rating label
  - `POEM_PAGE_LABELS.RU.REPORT` for report button

### Content Display
- **Interface Language**: Displays in user's selected language
- **Fallback**: Falls back to English if translation not available
- **Dynamic Content**: User-generated content displayed as-is

### Form Validation
- **Error Messages**: Localized error messages
- **Success Messages**: Localized success messages
- **Placeholders**: Localized form placeholders

## Dependencies

### Core Dependencies
- **React Hook Form**: `react-hook-form@7.61.1` for form handling
- **Zod**: `zod@4.0.10` for validation
- **shadcn/ui**: UI components (`Button`, `Dialog`, `Select`, `Textarea`)
- **React Quill**: `react-quill` for read-only poem content rendering

### Security Dependencies
- **Sanitize HTML**: `sanitize-html` for input sanitization
- **NextAuth**: `next-auth@5.0.0-beta` for session and role checks

### Styling Dependencies
- **Tailwind CSS**: `tailwindcss` for styling
- **CSS Variables**: Custom CSS variables for theming

## Performance Considerations

### Code Splitting
- **Lazy Loading**: Components loaded on demand
- **Bundle Optimization**: Efficient bundle splitting
- **Image Optimization**: Optimized images and assets

### Caching
- **Static Generation**: Static generation for poem pages where possible
- **Cache Revalidation**: Proper cache invalidation after content updates
- **CDN**: Content delivery network for static assets

### Database Optimization
- **Efficient Queries**: Optimized database queries with proper indexing
- **Pagination**: Paginated loading for comments and reviews
- **Selective Loading**: Only necessary data loaded

## Error Handling

### Form Validation Errors
- **Client-Side**: Real-time validation with immediate feedback
- **Server-Side**: Comprehensive server-side validation
- **Error Display**: Clear error messages with proper styling

### Network Errors
- **Retry Logic**: Automatic retry for failed requests
- **Fallback UI**: Graceful degradation for network issues
- **User Feedback**: Clear feedback for network errors

### Authorization Errors
- **Access Denied**: Clear messages for unauthorized access
- **Redirect Logic**: Proper redirects for authentication
- **Role-Based UI**: UI adapts based on user permissions

## Testing Considerations

### Unit Tests
- **Component Tests**: Test individual components
- **Hook Tests**: Test custom hooks
- **Utility Tests**: Test utility functions

### Integration Tests
- **Form Submission**: Test complete form workflows
- **Server Actions**: Test server action functionality
- **Authorization**: Test role-based access control

## Future Enhancements

### Planned Features
- **Real-time Comments**: WebSocket integration for real-time comments
- **Advanced Moderation**: Enhanced moderation tools
- **Analytics**: User engagement analytics
- **Social Features**: Sharing and social media integration

### Performance Improvements
- **Virtual Scrolling**: For large comment lists
- **Image Optimization**: Advanced image optimization
- **PWA Features**: Progressive web app capabilities

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Next Review**: [Date + 2 weeks]
