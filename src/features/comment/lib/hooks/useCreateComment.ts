import { useCallback } from 'react';
import { toast } from 'sonner';
import { createComment } from '@/features/comment/server-actions/createComment';
import { UIConstants } from '../../constants/ui';

interface UseCreateCommentProps {
  onSuccess?: () => void;
}

export const useCreateComment = ({ onSuccess }: UseCreateCommentProps = {}) => {
  const handleCreateComment = useCallback(
    async (poemId: string, content: string) => {
      try {
        const formData = new FormData();
        formData.append('content', content.trim());

        const result = await createComment(poemId, formData);

        if (result.success) {
          toast.success(result.message || UIConstants.COMMENT_SUCCESS_MESSAGE);
          onSuccess?.();
          return { success: true };
        } else {
          toast.error(result.message || UIConstants.COMMENT_ERROR_MESSAGE);
          return { success: false, error: result.message };
        }
      } catch (error) {
        console.error('Error creating comment:', error);
        toast.error(UIConstants.COMMENT_SUBMIT_ERROR_MESSAGE);
        return { success: false, error: 'Произошла ошибка при создании комментария' };
      }
    },
    [onSuccess]
  );

  return { createComment: handleCreateComment };
};
