import { useCallback } from 'react';
import { toast } from 'sonner';
import { createReview } from '@/features/review/server-actions/createReview';
import { UIConstants } from '../../constants/ui';

interface ReviewData {
  title: string;
  content: string;
  rating: number;
}

interface UseCreateReviewProps {
  onSuccess?: () => void;
}

export const useCreateReview = ({ onSuccess }: UseCreateReviewProps = {}) => {
  const handleCreateReview = useCallback(
    async (poemId: string, data: ReviewData) => {
      try {
        const formData = new FormData();
        formData.append('content', data.content.trim());
        formData.append('poemId', poemId);
        formData.append('rating', data.rating.toString());
        if (data.title.trim()) {
          formData.append('title', data.title.trim());
        }

        const result = await createReview(formData);

        if (result.success) {
          toast.success(result.message || UIConstants.REVIEW_SUCCESS_MESSAGE);
          onSuccess?.();
          return { success: true };
        } else {
          toast.error(result.message || UIConstants.REVIEW_ERROR_MESSAGE);
          return { success: false, error: result.message };
        }
      } catch (error) {
        console.error('Error creating review:', error);
        toast.error(UIConstants.REVIEW_SUBMIT_ERROR_MESSAGE);
        return { success: false, error: 'Произошла ошибка при создании отзыва' };
      }
    },
    [onSuccess]
  );

  return { createReview: handleCreateReview };
};
