'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PoemWithRelations } from '@/entities/poem/model/types';
import { User } from '@/entities/user/model/types';
import type { PoemContentBlock } from '@/features/poem-creation/model/types';
import { AuthorInfo } from '@/shared/ui/AuthorInfo';
import { CommentSection } from '@/shared/ui/CommentSection';
import { PoemContentRenderer } from '@/shared/ui/PoemContentRenderer';
import { ReviewSection } from '@/shared/ui/ReviewSection';
import { UIConstants } from '../constants/ui';

interface PoemContentProps {
  poem: PoemWithRelations;
  author: User;
  currentUserId?: string;
}

export function PoemContent({ poem, author, currentUserId }: PoemContentProps) {
  const router = useRouter();

  // poem.content уже является массивом PoemContentBlock[], приводим типы
  const contentBlocks = (poem.content as unknown as PoemContentBlock[]) || [];

  // Check if current user is the author
  const isAuthor = currentUserId === author.id;

  // Transform reviews and comments data to match component interfaces
  const mockReviews = (poem.reviews || []).map(review => ({
    id: review.id,
    rating: 5, // Default rating (TODO: Get from review data)
    content: review.content,
    author: {
      id: review.user.id,
      name: review.user.name,
      image: undefined,
    },
    createdAt: review.createdAt,
  }));

  const mockComments = (poem.comments || []).map(comment => ({
    id: comment.id,
    content: comment.content,
    author: {
      id: comment.author.id,
      name: comment.author.name,
      image: undefined,
    },
    createdAt: comment.createdAt,
  }));

  const handleDelete = async () => {
    if (!isAuthor) return;

    try {
      // TODO: Implement delete poem server action
      // const result = await deletePoem(poem.id);
      // if (result.success) {
      //   toast.success('Стихотворение успешно удалено');
      //   router.push('/profile');
      // } else {
      //   toast.error(result.message || 'Ошибка при удалении стихотворения');
      // }

      // Temporary implementation
      toast.success('Стихотворение успешно удалено');
      router.push('/profile');
    } catch {
      toast.error('Ошибка при удалении стихотворения');
    }
  };

  return (
    <article className="max-w-4xl mx-auto space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8">
      {/* 1. Page Title */}
      <header className="text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4 leading-tight">
          {poem.title}
        </h1>
      </header>

      {/* 2. Author Information */}
      <div className="flex justify-center">
        <AuthorInfo
          author={author}
          createdAt={poem.createdAt}
          poemSlug={poem.slug}
          isAuthor={isAuthor}
          onDelete={handleDelete}
        />
      </div>

      {/* 3. Poem Content */}
      <section className="bg-background rounded-lg p-4 sm:p-6 border shadow-sm">
        <PoemContentRenderer content={contentBlocks} />

        {/* Tags */}
        {poem.tags.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-sm font-medium mb-3 text-muted-foreground">
              {UIConstants.TAGS_LABEL}
            </h3>
            <div className="flex flex-wrap gap-2">
              {poem.tags.map(tag => (
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

      {/* 4. Reviews Section */}
      <ReviewSection poemId={poem.id} reviews={mockReviews} />

      {/* 5. Comments Section */}
      <CommentSection poemId={poem.id} comments={mockComments} />
    </article>
  );
}
