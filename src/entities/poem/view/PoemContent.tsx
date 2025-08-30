'use client';

import { PoemWithRelations } from '@/entities/poem/model/types';
import { User } from '@/entities/user/model/types';
import { useDeletePoem } from '@/features/poem/lib/hooks/useDeletePoem';
import type { PoemContentBlock } from '@/features/poem-creation/model/types';
import { AuthorInfoContainer } from '@/shared/ui/AuthorInfoContainer';
import { CommentSection } from '@/shared/ui/CommentSection';
import { PoemContentRenderer } from '@/shared/ui/PoemContentRenderer';
import { ReviewSection } from '@/shared/ui/ReviewSection';
import { UIConstants } from '../constants/ui';

interface PoemContentProps {
  poem: PoemWithRelations;
  author: User;
  currentUserId?: string;
}

/**
 * Main component for displaying poem content with all related sections
 */
export function PoemContent({ poem, author, currentUserId }: PoemContentProps) {
  const { deletePoem } = useDeletePoem();

  // Transform poem content to the expected format
  const contentBlocks = (poem.content as unknown as PoemContentBlock[]) || [];

  // Check if current user is the author
  const isAuthor = currentUserId === author.id;

  // Transform reviews data to match component interface
  const transformedReviews = transformReviewsData(poem).map(review => ({
    ...review,
    title: review.title || '',
    user: {
      ...review.user,
      name: review.user.name || '',
    },
  }));

  // Transform comments data to match component interface
  const transformedComments = transformCommentsData(poem).map(comment => ({
    ...comment,
    author: {
      ...comment.author,
      name: comment.author.name || '',
    },
  }));

  const handleDelete = async () => {
    if (!isAuthor) return;
    await deletePoem(poem.id);
  };

  return (
    <article className="max-w-4xl mx-auto space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8">
      <PoemHeader title={poem.title} />

      <AuthorInfoContainer
        author={author}
        createdAt={poem.createdAt}
        poemSlug={poem.slug}
        isAuthor={isAuthor}
        onDelete={handleDelete}
      />

      <PoemContentSection contentBlocks={contentBlocks} tags={poem.tags} />

      <ReviewSection
        poemId={poem.id}
        reviews={transformedReviews}
        currentUserId={currentUserId}
        poemAuthorId={author.id}
      />

      <CommentSection
        poemId={poem.id}
        comments={transformedComments}
        currentUserId={currentUserId}
      />
    </article>
  );
}

/**
 * Component for poem header with title
 */
const PoemHeader = ({ title }: { title: string }) => (
  <header className="text-center">
    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4 leading-tight">
      {title}
    </h1>
  </header>
);

/**
 * Component for poem content section with tags
 */
const PoemContentSection = ({
  contentBlocks,
  tags,
}: {
  contentBlocks: PoemContentBlock[];
  tags: Array<{ id: string; name: string }>;
}) => (
  <section className="bg-background rounded-lg p-4 sm:p-6 border shadow-sm">
    <PoemContentRenderer content={contentBlocks} />

    {tags.length > 0 && (
      <div className="mt-6 pt-6 border-t">
        <h3 className="text-sm font-medium mb-3 text-muted-foreground">{UIConstants.TAGS_LABEL}</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span
              key={tag.id}
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    )}
  </section>
);

/**
 * Transform reviews data to match ReviewWithRelations interface
 */
const transformReviewsData = (poem: PoemWithRelations) => {
  return (poem.reviews || []).map(review => ({
    id: review.id,
    title: review.title,
    content: review.content,
    createdAt: review.createdAt,
    updatedAt: review.createdAt, // Using createdAt as fallback
    status: 'APPROVED' as const,
    rating: 5, // Default rating
    userId: review.user.id,
    poemId: poem.id,
    user: {
      id: review.user.id,
      name: review.user.name,
      image: null,
    },
    poem: {
      id: poem.id,
      title: poem.title,
      slug: poem.slug,
    },
  }));
};

/**
 * Transform comments data to match CommentWithRelations interface
 */
const transformCommentsData = (poem: PoemWithRelations) => {
  return (poem.comments || []).map(comment => ({
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    updatedAt: comment.createdAt, // Using createdAt as fallback
    status: 'APPROVED' as const,
    authorId: comment.author.id,
    poemId: poem.id,
    isApproved: true,
    author: {
      id: comment.author.id,
      name: comment.author.name,
      image: null,
    },
    poem: {
      id: poem.id,
      title: poem.title,
      slug: poem.slug,
    },
  }));
};
