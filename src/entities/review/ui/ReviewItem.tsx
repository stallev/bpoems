'use client';

import { Edit, Star, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ReviewForm } from '@/features/review/ui/ReviewForm';
import { REVIEW_SECTION_LABELS } from '@/shared/constants/ui';
import { PostClaimButton } from '@/shared/ui/claim/PostClaimButton';
import { ConfirmationModal } from '@/shared/ui/modals/ConfirmationModal';
import { Button } from '@/shared/ui/shadcnComponents/button';
import { simpleFormatDate } from '@/shared/ui/utils/dateFormatting';
import type { ReviewItemProps } from '../model/types';

export function ReviewItem({
  review,
  currentUserId,
  onEditReview,
  onDeleteReview,
  onEditSuccess,
  onEditCancel,
  isEditing,
  editingReviewId,
  uiConstants,
}: ReviewItemProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isEditingThisReview = isEditing && editingReviewId === review.id;

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await onDeleteReview(review.id);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  // Если редактируется этот отзыв, показываем форму редактирования
  if (isEditingThisReview) {
    return (
      <div className="bg-muted/30 rounded-lg p-4 border">
        <ReviewForm
          poemId={review.poemId}
          reviewId={review.id}
          initialData={{
            title: review.title || '',
            content: review.content,
            rating: review.rating,
          }}
          isVisible={true}
          isAuthenticated={!!currentUserId}
          hasUserReview={false}
          onSuccess={onEditSuccess}
          onCancel={onEditCancel}
          onShowForm={() => {
            // Не используется при редактировании
          }}
          labels={uiConstants as typeof REVIEW_SECTION_LABELS}
        />
      </div>
    );
  }

  return (
    <div className="bg-muted/30 rounded-lg p-4 border">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-foreground">{review.user.name}</span>
            <span className="text-xs text-muted-foreground">
              {simpleFormatDate(review.createdAt)}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-muted-foreground">Оценка:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {review.title && <h4 className="font-semibold text-foreground mb-2">{review.title}</h4>}

          <p className="text-sm text-foreground leading-relaxed">{review.content}</p>
        </div>

        <div className="flex items-center gap-2">
          {currentUserId && currentUserId !== review.user.id && (
            <PostClaimButton poemId={review.id} isAuthor={false} />
          )}
          {currentUserId && currentUserId === review.user.id && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditReview(review.id)}
                className="h-8 w-8 p-0 hover:bg-muted"
                title="Редактировать отзыв"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteClick}
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                title="Удалить отзыв"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Удалить отзыв"
        description="Вы уверены, что хотите удалить этот отзыв? Это действие нельзя отменить."
        confirmText="Удалить"
        cancelText="Отмена"
        isLoading={isDeleting}
      />
    </div>
  );
}
