'use client';

import { useState, useCallback } from 'react';
import { useDeleteReview } from '@/features/review/lib/hooks/useDeleteReview';
import { useReviewSection } from '@/features/review/lib/hooks/useReviewSection';
import { ReviewForm } from '@/features/review/ui/ReviewForm';
import { REVIEW_SECTION_LABELS } from '@/shared/constants/ui';
import { SectionHeader } from '@/shared/ui/SectionHeader';
import { Button } from '@/shared/ui/shadcnComponents/button';
import { ReviewsList } from './ReviewsList';
import type { ReviewSectionProps } from '../model/types';

export function ReviewSection({
  poemId,
  reviews,
  currentUserId,
  hasUserReview = false,
}: ReviewSectionProps) {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const { isEditing, editingReviewId, data, startAdding, startEditing, cancel, submit } =
    useReviewSection(poemId);

  const { deleteReview: handleDeleteReview, optimisticReviews } = useDeleteReview({ reviews });

  const handleStartAdding = useCallback(() => {
    startAdding();
    setIsFormVisible(true);
  }, [startAdding]);

  const handleSuccess = useCallback(() => {
    cancel();
    setIsFormVisible(false);
  }, [cancel]);

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
            setIsFormVisible(true);
          }
        }}
        onDeleteReview={handleDeleteReview}
        onEditSuccess={submit}
        onEditCancel={() => {
          cancel();
          setIsFormVisible(false);
        }}
        isEditing={isEditing}
        editingReviewId={editingReviewId}
        uiConstants={{
          NO_REVIEWS_MESSAGE: REVIEW_SECTION_LABELS.NO_REVIEWS_MESSAGE,
          ADD_REVIEW: REVIEW_SECTION_LABELS.ADD_REVIEW,
          REVIEW_TITLE_PLACEHOLDER: REVIEW_SECTION_LABELS.REVIEW_TITLE_PLACEHOLDER,
          REVIEW_CONTENT_PLACEHOLDER: REVIEW_SECTION_LABELS.REVIEW_CONTENT_PLACEHOLDER,
          RATING_LABEL: REVIEW_SECTION_LABELS.RATING_LABEL,
          SUBMIT_REVIEW: REVIEW_SECTION_LABELS.SUBMIT_REVIEW,
          CANCEL_REVIEW: REVIEW_SECTION_LABELS.CANCEL_REVIEW,
          EDIT_REVIEW: REVIEW_SECTION_LABELS.EDIT_REVIEW,
        }}
      />

      {!isFormVisible && currentUserId && !hasUserReview && (
        <div className="flex justify-center sm:justify-end">
          <Button onClick={handleStartAdding} variant="outline" className="w-full sm:w-auto">
            {REVIEW_SECTION_LABELS.ADD_REVIEW}
          </Button>
        </div>
      )}

      {isFormVisible && (
        <ReviewForm
          poemId={poemId}
          reviewId={editingReviewId}
          initialData={{
            title: data.title,
            content: data.content,
            rating: data.rating,
          }}
          isVisible={true}
          isAuthenticated={!!currentUserId}
          hasUserReview={hasUserReview}
          onSuccess={handleSuccess}
          onCancel={() => {
            cancel();
            setIsFormVisible(false);
          }}
          onShowForm={handleStartAdding}
          labels={REVIEW_SECTION_LABELS}
        />
      )}
    </section>
  );
}
