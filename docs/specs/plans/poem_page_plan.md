# Poem Page Development Plan

## Overview

This plan outlines the development of the poem display page (`/poems/[slug]`), which serves as the main content viewing page for individual poems. The page will include poem content, author information, review and comment forms, and moderation features.

## Page Structure

### URL Pattern
- **Route**: `/poems/[slug]`
- **Dynamic Parameter**: `[slug]` - URL-friendly poem identifier
- **File Location**: `src/app/(noadmin)/poems/[slug]/page.tsx`

### Layout Components
1. **Header Widget** - Navigation and user menu
2. **Poem Content Section** - Main poem display
3. **Author Information** - Author details and bio
4. **Review Form** - For AUTHOR+ users (hidden for poem author)
5. **Review List** - Display existing reviews
6. **Comment Form** - For all authenticated users
7. **Comment List** - Display existing comments
8. **Footer Widget** - Site information and links

## Data Fetching Strategy

### Server-Side Data Fetching
```typescript
// src/app/(noadmin)/poems/[slug]/page.tsx
import { poemRepository } from '@/entities/poem/api/poemRepository';
import { userRepository } from '@/entities/user/api/userRepository';
import { reviewRepository } from '@/entities/review/api/reviewRepository';
import { commentRepository } from '@/entities/comment/api/commentRepository';
import { notFound } from 'next/navigation';

interface PoemPageProps {
  params: { slug: string };
}

export default async function PoemPage({ params }: PoemPageProps) {
  // 1. Fetch poem with relations
  const poem = await poemRepository.findBySlug(params.slug);
  if (!poem) {
    notFound();
  }

  // 2. Fetch author information
  const author = await userRepository.findById(poem.authorId);
  if (!author) {
    notFound();
  }

  // 3. Fetch reviews and comments (with pagination)
  const [reviews, comments] = await Promise.all([
    reviewRepository.findByPoemId(poem.id, { limit: 10 }),
    commentRepository.findByPoemId(poem.id, { limit: 20 }),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Poem content and components */}
    </div>
  );
}
```

### Client-Side Data Updates
- **Real-time Updates**: Use Server Actions for form submissions
- **Cache Revalidation**: Automatic cache updates after content changes
- **Optimistic Updates**: Immediate UI feedback for better UX

## Component Architecture

### Poem Content Display
```typescript
// src/entities/poem/view/PoemContent.tsx
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
          <span>By {author.name}</span>
          <span>•</span>
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
      
      {poem.categories.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Categories:</h3>
          <div className="flex gap-2">
            {poem.categories.map((category) => (
              <CategoryBadge key={category.id} category={category} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
```

### Author Information Section
```typescript
// src/entities/user/view/AuthorInfo.tsx
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
            <span>{poemCount} poems</span>
            <span>•</span>
            <span>Member since {formatDate(author.createdAt)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
```

## Form Integration

### Review Form Integration
```typescript
// Integration in poem page
import { ReviewForm } from '@/features/review/ui/ReviewForm';
import { useAuth } from '@/shared/lib/hooks/useAuth';

function PoemPageContent({ poem, author, reviews, comments }) {
  const { user } = useAuth();
  const canReview = user && 
    ['AUTHOR', 'MODERATOR', 'ADMIN'].includes(user.role) && 
    user.id !== poem.authorId;

  return (
    <div>
      <PoemContent poem={poem} author={author} />
      <AuthorInfo author={author} poemCount={author._count?.poems || 0} />
      
      {canReview && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Write a Review</h2>
          <ReviewForm poemId={poem.id} />
        </section>
      )}
      
      <ReviewList reviews={reviews} />
      {/* Comment form and list */}
    </div>
  );
}
```

### Comment Form Integration
```typescript
// Integration in poem page
import { CommentForm } from '@/features/comment/ui/CommentForm';

function PoemPageContent({ poem, author, reviews, comments }) {
  const { user } = useAuth();
  const canComment = user && user.id !== poem.authorId;

  return (
    <div>
      {/* Previous content */}
      
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        {canComment ? (
          <CommentForm poemId={poem.id} />
        ) : (
          <p className="text-muted-foreground">
            {!user ? 'Please sign in to comment.' : 'Authors cannot comment on their own poems.'}
          </p>
        )}
      </section>
      
      <CommentList comments={comments} />
    </div>
  );
}
```

## Error Handling

### 404 Not Found
```typescript
// src/app/(noadmin)/poems/[slug]/not-found.tsx
export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Poem Not Found</h1>
      <p className="text-muted-foreground mb-8">
        The poem you're looking for doesn't exist or has been removed.
      </p>
      <Link 
        href="/poems" 
        className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90"
      >
        Browse All Poems
      </Link>
    </div>
  );
}
```

### Error Boundary
```typescript
// src/app/(noadmin)/poems/[slug]/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Something went wrong!</h1>
      <p className="text-muted-foreground mb-8">
        {error.message || 'An unexpected error occurred while loading the poem.'}
      </p>
      <button
        onClick={reset}
        className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90"
      >
        Try again
      </button>
    </div>
  );
}
```

## SEO and Metadata

### Dynamic Metadata Generation
```typescript
// src/app/(noadmin)/poems/[slug]/page.tsx
import { Metadata } from 'next';

interface GenerateMetadataProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: GenerateMetadataProps): Promise<Metadata> {
  const poem = await poemRepository.findBySlug(params.slug);
  
  if (!poem) {
    return {
      title: 'Poem Not Found',
      description: 'The requested poem could not be found.',
    };
  }

  const author = await userRepository.findById(poem.authorId);
  
  return {
    title: `${poem.title} by ${author?.name || 'Unknown Author'}`,
    description: poem.content
      .filter(block => block.type === 'text')
      .map(block => block.content)
      .join(' ')
      .slice(0, 160) + '...',
    authors: [{ name: author?.name || 'Unknown Author' }],
    openGraph: {
      title: poem.title,
      description: poem.content
        .filter(block => block.type === 'text')
        .map(block => block.content)
        .join(' ')
        .slice(0, 160) + '...',
      type: 'article',
      authors: [author?.name || 'Unknown Author'],
    },
  };
}
```

## Performance Optimization

### Static Generation Strategy
```typescript
// Generate static params for popular poems
export async function generateStaticParams() {
  const popularPoems = await poemRepository.findPopular({ limit: 100 });
  
  return popularPoems.map((poem) => ({
    slug: poem.slug,
  }));
}
```

### Image Optimization
```typescript
// Optimize author avatars and poem images
import Image from 'next/image';

function AuthorAvatar({ author }: { author: User }) {
  return (
    <div className="relative w-16 h-16">
      {author.avatar ? (
        <Image
          src={author.avatar}
          alt={`${author.name}'s avatar`}
          fill
          className="rounded-full object-cover"
          sizes="64px"
        />
      ) : (
        <div className="w-full h-full bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">
          {author.name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}
```

## Accessibility Features

### Semantic HTML Structure
```typescript
// Proper semantic structure for screen readers
return (
  <main className="container mx-auto px-4 py-8">
    <article aria-labelledby="poem-title">
      <header>
        <h1 id="poem-title" className="text-3xl font-bold mb-4">
          {poem.title}
        </h1>
        <p className="text-muted-foreground">
          By <span className="font-medium">{author.name}</span>
        </p>
      </header>
      
      <section aria-label="Poem content">
        {/* Poem content blocks */}
      </section>
    </article>
    
    <aside aria-label="Author information">
      <AuthorInfo author={author} poemCount={poemCount} />
    </aside>
    
    <section aria-label="Reviews">
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>
      <ReviewList reviews={reviews} />
    </section>
    
    <section aria-label="Comments">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      <CommentList comments={comments} />
    </section>
  </main>
);
```

### Keyboard Navigation
```typescript
// Ensure proper tab order and focus management
function PoemPageContent({ poem, author, reviews, comments }) {
  return (
    <div>
      <PoemContent poem={poem} author={author} />
      
      <nav aria-label="Page sections">
        <ul className="flex gap-4 mb-8">
          <li>
            <a href="#reviews" className="text-primary hover:underline">
              Reviews ({reviews.length})
            </a>
          </li>
          <li>
            <a href="#comments" className="text-primary hover:underline">
              Comments ({comments.length})
            </a>
          </li>
        </ul>
      </nav>
      
      <section id="reviews" aria-labelledby="reviews-heading">
        <h2 id="reviews-heading" className="text-2xl font-bold mb-4">Reviews</h2>
        <ReviewList reviews={reviews} />
      </section>
      
      <section id="comments" aria-labelledby="comments-heading">
        <h2 id="comments-heading" className="text-2xl font-bold mb-4">Comments</h2>
        <CommentList comments={comments} />
      </section>
    </div>
  );
}
```

## Security Considerations

### Content Sanitization
```typescript
// Ensure all user-generated content is properly sanitized
import DOMPurify from 'dompurify';

function PoemContentBlock({ block }: { block: PoemContentBlock }) {
  const sanitizedContent = DOMPurify.sanitize(block.content);
  
  return (
    <div 
      className="poem-block"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
```

### Rate Limiting
```typescript
// Implement rate limiting for form submissions
import { rateLimit } from '@/shared/lib/utils/rateLimit';

export async function createComment(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  // Rate limiting: max 5 comments per minute
  const { success } = await rateLimit(session.user.id, 'comment', 5, 60);
  if (!success) {
    throw new Error('Too many comments. Please wait before posting again.');
  }

  // Continue with comment creation...
}
```

## Development Steps

### Step 1: Create Page Structure
1. Create `src/app/(noadmin)/poems/[slug]/page.tsx`
2. Create `src/app/(noadmin)/poems/[slug]/not-found.tsx`
3. Create `src/app/(noadmin)/poems/[slug]/error.tsx`
4. Implement basic data fetching and error handling

### Step 2: Implement Core Components
1. Create `src/entities/poem/view/PoemContent.tsx`
2. Create `src/entities/user/view/AuthorInfo.tsx`
3. Implement poem content rendering with proper styling
4. Add author information display

### Step 3: Integrate Review System
1. Import and integrate `ReviewForm` from review feature
2. Import and integrate `ReviewList` from review feature
3. Add proper role-based access control
4. Test review creation and display

### Step 4: Integrate Comment System
1. Import and integrate `CommentForm` from comment feature
2. Import and integrate `CommentList` from comment feature
3. Add proper authentication checks
4. Test comment creation and display

### Step 5: Add SEO and Performance
1. Implement `generateMetadata` function
2. Add `generateStaticParams` for popular poems
3. Optimize images and loading performance
4. Add proper meta tags and structured data

### Step 6: Enhance Accessibility
1. Add semantic HTML structure
2. Implement proper ARIA labels
3. Ensure keyboard navigation
4. Test with screen readers

### Step 7: Security and Testing
1. Implement content sanitization
2. Add rate limiting for forms
3. Test error scenarios
4. Perform security audit

### Step 8: Documentation and Cleanup
1. Update documentation
2. Ensure FSD compliance
3. Run linting and type checking
4. Test all user workflows

## File Structure

```
src/
├── app/
│   └── (noadmin)/
│       └── poems/
│           └── [slug]/
│               ├── page.tsx
│               ├── not-found.tsx
│               └── error.tsx
├── entities/
│   ├── poem/
│   │   └── view/
│   │       ├── PoemContent.tsx
│   │       └── index.ts
│   └── user/
│       └── view/
│           ├── AuthorInfo.tsx
│           └── index.ts
└── features/
    ├── review/
    │   └── ui/
    │       ├── ReviewForm.tsx
    │       ├── ReviewList.tsx
    │       └── index.ts
    └── comment/
        └── ui/
            ├── CommentForm.tsx
            ├── CommentList.tsx
            └── index.ts
```

## Testing Strategy

### Unit Tests
- **Page Rendering**: Test page component with different data scenarios
- **Component Integration**: Test poem content and author info components
- **Form Integration**: Test review and comment form integration
- **Error Handling**: Test 404 and error scenarios

### Integration Tests
- **Data Fetching**: Test server-side data fetching
- **Form Submissions**: Test review and comment creation
- **Navigation**: Test internal page navigation
- **Cache Management**: Test cache invalidation

### Manual Testing
- **User Workflows**: Test complete poem viewing experience
- **Role-based Access**: Test different user roles and permissions
- **Responsive Design**: Test on different screen sizes
- **Accessibility**: Test with screen readers and keyboard navigation

## Performance Metrics

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Loading Performance
- **Time to First Byte**: < 600ms
- **Time to Interactive**: < 3.5s
- **Bundle Size**: < 200KB (gzipped)

## Monitoring and Analytics

### User Engagement
- **Time on Page**: Track how long users spend reading poems
- **Scroll Depth**: Monitor how far users scroll through content
- **Interaction Rate**: Track review and comment submissions

### Performance Monitoring
- **Page Load Times**: Monitor actual user experience
- **Error Rates**: Track 404s and other errors
- **Cache Hit Rates**: Monitor static generation effectiveness

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Next Review**: [Date + 2 weeks]
