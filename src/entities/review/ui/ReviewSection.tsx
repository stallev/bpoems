'use client';

import { useDeleteReview } from '@/features/review/lib/hooks/useDeleteReview';
import { useReviewSection } from '@/features/review/lib/hooks/useReviewSection';
import { ReviewForm } from '@/features/review/ui/ReviewForm';
import { REVIEW_SECTION_LABELS } from '@/shared/constants/ui';
import { SectionHeader } from '@/shared/ui/SectionHeader';
import { ReviewsList } from './ReviewsList';
import type { ReviewSectionProps } from '../model/types';

/**
 * ReviewSection component for displaying and managing reviews
 */
export function ReviewSection({ poemId, reviews, currentUserId }: ReviewSectionProps) {
  const {
    isAdding,
    isEditing,
    editingReviewId,
    data,
    startAdding,
    startEditing,
    cancel,
    // setData и setRating не используются напрямую, но передаются в ReviewForm
    submit,
    // deleteReview не используется, так как используется handleDeleteReview из useDeleteReview
  } = useReviewSection(poemId);

  // Используем optimistic данные для отзывов
  const { deleteReview: handleDeleteReview, optimisticReviews } = useDeleteReview({
    reviews,
  });

  const UI_CONSTANTS = REVIEW_SECTION_LABELS;

  // Проверяем, есть ли уже отзыв от текущего пользователя
  const hasUserReview = currentUserId
    ? reviews.some(review => review.user.id === currentUserId)
    : false;

  return (
    <section className="bg-background rounded-lg p-4 sm:p-6 border shadow-sm space-y-4">
      <SectionHeader title="Отзывы" count={reviews.length} />

      <ReviewsList
        reviews={(optimisticReviews || reviews).map(review => ({
          ...review,
          poemId: poemId,
        }))}
        currentUserId={currentUserId}
        onEditReview={(id: string) => {
          const review = reviews.find(r => r.id === id);
          if (review) {
            startEditing(id, {
              title: review.title || '',
              content: review.content,
              rating: review.rating || 5,
            });
          }
        }}
        onDeleteReview={handleDeleteReview}
        onEditSuccess={submit}
        onEditCancel={cancel}
        isEditing={isEditing}
        editingReviewId={editingReviewId}
        uiConstants={UI_CONSTANTS}
      />

      <ReviewForm
        poemId={poemId}
        reviewId={editingReviewId}
        initialData={data}
        isVisible={isAdding}
        isAuthenticated={!!currentUserId}
        hasUserReview={hasUserReview}
        onSuccess={submit}
        onCancel={cancel}
        onShowForm={startAdding}
        labels={UI_CONSTANTS}
      />
    </section>
  );
}
