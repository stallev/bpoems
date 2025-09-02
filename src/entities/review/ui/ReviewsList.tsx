'use client';

import { ReviewItem } from './ReviewItem';
import type { ReviewsListProps } from '../model/types';

export function ReviewsList({
  reviews,
  currentUserId,
  onEditReview,
  onDeleteReview,
  onEditSuccess,
  onEditCancel,
  isEditing,
  editingReviewId,
  uiConstants,
}: ReviewsListProps) {
  if (reviews.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {reviews.map(review => (
        <ReviewItem
          key={review.id}
          review={review}
          currentUserId={currentUserId}
          onEditReview={onEditReview}
          onDeleteReview={onDeleteReview}
          onEditSuccess={onEditSuccess}
          onEditCancel={onEditCancel}
          isEditing={isEditing}
          editingReviewId={editingReviewId}
          uiConstants={uiConstants}
        />
      ))}
    </div>
  );
}
