# Poem Page Structure

## Overview

The poem page (`/poems/[slug]`) displays a single poem with its content, author information, reviews, and comments. The page follows the Feature-Sliced Design (FSD) architecture and implements all required features according to the project's technical and design requirements.

## Components

### Page Layout
- **Location**: `src/app/(noadmin)/poems/[slug]/page.tsx`
- **Purpose**: Server component that fetches and displays poem data
- **Dependencies**:
  - `PoemContent` from `@/entities/poem`
  - `AuthorInfo` from `@/entities/user`
  - `ReviewForm` and `ReviewList` from `@/features/review`
  - `CommentForm` and `CommentList` from `@/features/comment`

### Error Handling
- **Location**: `src/app/(noadmin)/poems/[slug]/error.tsx`
- **Purpose**: Client component for displaying error states
- **Features**:
  - Error message display
  - Retry functionality
  - Error logging

### Not Found Page
- **Location**: `src/app/(noadmin)/poems/[slug]/not-found.tsx`
- **Purpose**: Static page for non-existent poems
- **Features**:
  - User-friendly message
  - Return to home link

## Data Flow

1. **Initial Load**:
   - Fetch poem data by slug
   - Load author information
   - Load reviews and comments
   - Check user permissions

2. **Reviews**:
   - Display review form for AUTHOR+ roles
   - Show existing reviews
   - Support reporting functionality

3. **Comments**:
   - Display comment form for SUBSCRIBER+ roles
   - Show existing comments
   - Support reporting functionality

## Features

### Poem Display
- Rich text content rendering
- Author information
- Creation date
- Tags display

### Reviews
- Rating system (1-5 stars)
- Rich text content
- Author information
- Creation date
- Report functionality

### Comments
- Rich text content
- Author information
- Creation date
- Report functionality

## Permissions

### Review Permissions
- **Can Review**: AUTHOR, MODERATOR, ADMIN roles
- **Review Form**: Only shown to users with appropriate roles
- **Review Actions**: Report, Edit (own reviews), Delete (own reviews)

### Comment Permissions
- **Can Comment**: SUBSCRIBER, AUTHOR, MODERATOR, ADMIN roles
- **Comment Form**: Only shown to users with appropriate roles
- **Comment Actions**: Report, Edit (own comments), Delete (own comments)

## Error States

### Not Found
- Displayed when poem doesn't exist
- User-friendly message
- Return to home option

### Error Page
- Displayed for other errors
- Error message display
- Retry functionality
- Error logging

## Accessibility

- ARIA labels for interactive elements
- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance

## Performance

- Server-side rendering
- Optimized data fetching
- Pagination for reviews and comments
- Lazy loading for images

## Dependencies

### Entities
- `@/entities/poem`
- `@/entities/user`
- `@/entities/comment`
- `@/entities/review`

### Features
- `@/features/review`
- `@/features/comment`
- `@/features/moderation`

### Shared
- `@/shared/ui/shadcnComponents`
- `@/shared/lib/utils`
- `@/shared/constants`

## Testing

### Unit Tests
- Component rendering
- Permission checks
- Error handling

### Integration Tests
- Data fetching
- Form submissions
- Error states

### E2E Tests
- User interactions
- Navigation
- Form validation

## Documentation

### Code Comments
- Component purpose
- Complex logic explanation
- Type definitions
- Function parameters

### Type Definitions
- Props interfaces
- Form data types
- API response types
- Error types

## Future Improvements

1. **Performance**
   - Implement infinite scrolling for comments
   - Add review/comment search
   - Optimize image loading

2. **Features**
   - Add social sharing
   - Implement bookmarking
   - Add rich text editor for comments

3. **Analytics**
   - Track user engagement
   - Monitor performance metrics
   - Collect user feedback

## Version History

- **1.0.0** - Initial implementation
  - Basic poem display
  - Reviews and comments
  - Moderation features

- **1.1.0** - Planned
  - Rich text editor
  - Social sharing
  - Analytics integration