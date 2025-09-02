import { useCallback, useOptimistic } from 'react';
import { toast } from 'sonner';
import { updateComment } from '@/features/comment/server-actions/updateComment';
import { UIConstants } from '../../constants/ui';

interface UseUpdateCommentProps {
  onSuccess?: () => void;
  comments?: Array<{
    id: string;
    content: string;
    createdAt: Date;
    author: { id: string; name: string; image: string | null };
  }>;
}

export const useUpdateComment = ({ onSuccess, comments = [] }: UseUpdateCommentProps = {}) => {
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (state, { commentId, content }: { commentId: string; content: string }) =>
      state.map(comment => (comment.id === commentId ? { ...comment, content } : comment))
  );

  const handleUpdateComment = useCallback(
    async (commentId: string, content: string) => {
      try {
        // Оптимистичное обновление
        addOptimisticComment({ commentId, content });

        const formData = new FormData();
        formData.append('content', content.trim());
        console.log('formData', Object.fromEntries(formData));

        const result = await updateComment(commentId, formData);

        if (result.success) {
          toast.success(result.message || UIConstants.COMMENT_UPDATE_SUCCESS_MESSAGE);
          onSuccess?.();
          return { success: true };
        } else {
          toast.error(result.message || UIConstants.COMMENT_UPDATE_ERROR_MESSAGE);
          return { success: false, error: result.message };
        }
      } catch (error) {
        console.error('Error updating comment:', error);
        toast.error(UIConstants.COMMENT_SUBMIT_ERROR_MESSAGE);
        return { success: false, error: 'Произошла ошибка при обновлении комментария' };
      }
    },
    [onSuccess, addOptimisticComment]
  );

  return { updateComment: handleUpdateComment, optimisticComments };
};
