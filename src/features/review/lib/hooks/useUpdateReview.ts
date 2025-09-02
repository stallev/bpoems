import { useCallback, useOptimistic } from 'react';
import { toast } from 'sonner';
import { updateReview } from '@/features/review/server-actions/updateReview';
import { UIConstants } from '../../constants/ui';

interface ReviewData {
  title: string;
  content: string;
  rating: number;
}

interface UseUpdateReviewProps {
  onSuccess?: () => void;
  reviews?: Array<{
    id: string;
    title?: string;
    content: string;
    rating: number;
    createdAt: Date;
    user: { id: string; name: string; image: string | null };
  }>;
}

export const useUpdateReview = ({ onSuccess, reviews = [] }: UseUpdateReviewProps = {}) => {
  const [optimisticReviews, addOptimisticReview] = useOptimistic(
    reviews,
    (state, { reviewId, data }: { reviewId: string; data: ReviewData }) =>
      state.map(review => (review.id === reviewId ? { ...review, ...data } : review))
  );

  const handleUpdateReview = useCallback(
    async (reviewId: string, data: ReviewData) => {
      try {
        // Оптимистичное обновление
        addOptimisticReview({ reviewId, data });

        const formData = new FormData();
        formData.append('content', data.content.trim());
        formData.append('rating', data.rating.toString());
        if (data.title.trim()) {
          formData.append('title', data.title.trim());
        }

        const result = await updateReview(reviewId, formData);

        if (result.success) {
          toast.success(result.message || UIConstants.REVIEW_UPDATE_SUCCESS_MESSAGE);
          onSuccess?.();
          return { success: true };
        } else {
          toast.error(result.message || UIConstants.REVIEW_UPDATE_ERROR_MESSAGE);
          return { success: false, error: result.message };
        }
      } catch (error) {
        console.error('Error updating review:', error);
        toast.error(UIConstants.REVIEW_SUBMIT_ERROR_MESSAGE);
        return { success: false, error: 'Произошла ошибка при обновлении отзыва' };
      }
    },
    [onSuccess, addOptimisticReview]
  );

  return { updateReview: handleUpdateReview, optimisticReviews };
};
