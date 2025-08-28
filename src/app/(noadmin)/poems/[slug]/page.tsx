import { loadPoemData } from '@/entities/poem/api/loadPoemdata';
import { PoemContent } from '@/entities/poem/view/PoemContent';
import { AuthorInfo } from '@/entities/user/view/AuthorInfo';
import { CommentForm } from '@/features/comment/ui/CommentForm';
import { CommentList } from '@/features/comment/ui/CommentList';
import { ReviewForm } from '@/features/review/ui/ReviewForm';
import { ReviewList } from '@/features/review/ui/ReviewList';
import { ErrorMessages } from '@/shared/constants/ErrorMessages';
import { DynamicPagePathProps } from '@/shared/model/PagesPropsTypes';

export default async function PoemPage({ params }: DynamicPagePathProps) {
  const { slug } = await params;

  try {
    const { session, poem, author, reviews, comments } = await loadPoemData(slug);

    const canReview = session?.user && ['AUTHOR', 'MODERATOR', 'ADMIN'].includes(session.user.role);
    const canComment =
      session?.user && ['SUBSCRIBER', 'AUTHOR', 'MODERATOR', 'ADMIN'].includes(session.user.role);

    return (
      <div className="container mx-auto px-4 py-8">
        <PoemContent poem={poem} author={author} />
        <AuthorInfo author={author} poemCount={author.poems?.length ?? 0} />

        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Reviews</h2>
          {canReview && <ReviewForm poemId={poem.id} />}
          <div className="mt-8">
            <ReviewList reviews={reviews} />
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Comments</h2>
          {canComment && <CommentForm poemId={poem.id} />}
          <div className="mt-8">
            <CommentList comments={comments} />
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('Error loading poem page:', error);
    throw new Error(ErrorMessages.PAGE_LOAD_FAILED);
  }
}
