import { useCallback, useOptimistic, startTransition } from 'react';
import { toast } from 'sonner';
import { deleteComment } from '@/features/comment/server-actions/deleteComment';
import { UIConstants } from '../../constants/ui';

interface UseDeleteCommentProps {
  onSuccess?: () => void;
  comments?: Array<{
    id: string;
    content: string;
    createdAt: Date;
    author: { id: string; name: string; image: string | null };
  }>;
}

export const useDeleteComment = ({ onSuccess, comments = [] }: UseDeleteCommentProps = {}) => {
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (state, commentId: string) => state.filter(comment => comment.id !== commentId)
  );

  const handleDeleteComment = useCallback(
    async (commentId: string) => {
      try {
        // Оптимистичное обновление в startTransition
        startTransition(() => {
          addOptimisticComment(commentId);
        });

        const result = await deleteComment(commentId);

        if (result.success) {
          toast.success(result.message || UIConstants.COMMENT_DELETE_SUCCESS_MESSAGE);
          onSuccess?.();
          return { success: true };
        } else {
          toast.error(result.message || UIConstants.COMMENT_DELETE_ERROR_MESSAGE);
          return { success: false, error: result.message };
        }
      } catch (error) {
        console.error('Error deleting comment:', error);
        toast.error(UIConstants.COMMENT_WORK_ERROR_MESSAGE);
        return { success: false, error: 'Произошла ошибка при удалении комментария' };
      }
    },
    [onSuccess, addOptimisticComment]
  );

  return { deleteComment: handleDeleteComment, optimisticComments };
};
