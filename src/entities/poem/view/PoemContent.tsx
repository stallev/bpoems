// import { CommentSection } from '@/entities/comment/ui/CommentSection';
import { PoemRenderDataType } from '@/entities/poem/model/types';
import { ReviewSection } from '@/entities/review/ui/ReviewSection';
import { User } from '@/entities/user/model/types';
import type { RichTextContentType } from '@/shared/model/SimpleTypes';
import { AuthorInfoContainer } from '@/shared/ui/author/AuthorInfoContainer';
import { PoemContentRenderer } from '@/shared/ui/PoemContentRenderer';
import { UIConstants } from '../constants/ui';

interface PoemContentProps {
  poem: PoemRenderDataType;
  author: User;
  currentUserId?: string;
}

/**
 * Main component for displaying poem content with all related sections
 */
export function PoemContent({ poem, author, currentUserId }: PoemContentProps) {
  const content = (poem.content as unknown as RichTextContentType) || null;

  return (
    <article className="max-w-4xl mx-auto space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8">
      {poem.title && <PoemHeader title={poem.title} />}

      <AuthorInfoContainer
        author={poem.author}
        createdAt={new Date(poem.createdAt)}
        poemSlug={poem.slug}
        poemId={poem.id}
      />

      <PoemContentSection content={content} tags={poem.tags} />

      <ReviewSection
        poemId={poem.id}
        reviews={!!poem.reviews ? poem.reviews : []}
        currentUserId={currentUserId}
        poemAuthorId={author.id}
      />

      {/* <CommentSection
        poemId={poem.id}
        comments={!!poem.comments ? poem.comments : []}
        currentUserId={currentUserId}
      /> */}
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
  content,
  tags,
}: {
  content: RichTextContentType | null;
  tags: Array<{ id: string; name: string }>;
}) => (
  <section className="bg-background rounded-lg p-4 sm:p-6 border shadow-sm">
    <PoemContentRenderer content={content} />

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
