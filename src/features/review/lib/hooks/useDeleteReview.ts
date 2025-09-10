import { useCallback, useOptimistic, startTransition } from 'react';
import { toast } from 'sonner';
import { deleteReview } from '@/features/review/server-actions/deleteReview';
import { UIConstants } from '../../constants/ui';

interface UseDeleteReviewProps {
  onSuccess?: () => void;
  reviews?: Array<{
    id: string;
    title?: string | null;
    content: string;
    rating: number;
    createdAt: Date;
    user: { id: string; name: string | null; image: string | null };
  }>;
}

export const useDeleteReview = ({ onSuccess, reviews = [] }: UseDeleteReviewProps = {}) => {
  const [optimisticReviews, addOptimisticReview] = useOptimistic(
    reviews,
    (state, reviewId: string) => state.filter(review => review.id !== reviewId)
  );

  const handleDeleteReview = useCallback(
    async (reviewId: string) => {
      try {
        // Оптимистичное обновление в startTransition
        startTransition(() => {
          addOptimisticReview(reviewId);
        });

        const result = await deleteReview(reviewId);

        if (result.success) {
          toast.success(result.message || UIConstants.REVIEW_DELETE_SUCCESS_MESSAGE);
          onSuccess?.();
          return { success: true };
        } else {
          toast.error(result.message || UIConstants.REVIEW_DELETE_ERROR_MESSAGE);
          return { success: false, error: result.message };
        }
      } catch (error) {
        console.error('Error deleting review:', error);
        toast.error(UIConstants.REVIEW_WORK_ERROR_MESSAGE);
        return { success: false, error: 'Произошла ошибка при удалении отзыва' };
      }
    },
    [onSuccess, addOptimisticReview]
  );

  return { deleteReview: handleDeleteReview, optimisticReviews };
};
