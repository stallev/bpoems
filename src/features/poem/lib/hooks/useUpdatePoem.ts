import { useCallback } from 'react';
import { toast } from 'sonner';
import { UIConstants } from '@/features/poem-creation/constants/ui';
import type { TiptapJson } from '@/features/poem-creation/model/types';
import { updatePoem } from '@/features/poem-creation/server-actions/updatePoem';

interface PoemData {
  title: string;
  content: TiptapJson;
  categoryId: string;
}

interface UseUpdatePoemProps {
  onSuccess?: (data: { id: string; slug: string }) => void;
}

export const useUpdatePoem = ({ onSuccess }: UseUpdatePoemProps = {}) => {
  const handleUpdatePoem = useCallback(
    async (slug: string, data: PoemData) => {
      try {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('content', JSON.stringify(data.content));
        formData.append('categoryId', data.categoryId);

        const result = await updatePoem(slug, formData);

        if (result.success && result.data) {
          toast.success(result.message || UIConstants.POEM_UPDATE_SUCCESS_MESSAGE);
          onSuccess?.(result.data);
          return { success: true, data: result.data };
        } else {
          toast.error(result.message || UIConstants.POEM_UPDATE_ERROR_MESSAGE);
          return { success: false, error: result.message };
        }
      } catch (error) {
        console.error('Error updating poem:', error);
        toast.error(UIConstants.POEM_UPDATE_ERROR_MESSAGE);
        return { success: false, error: 'Произошла ошибка при обновлении стихотворения' };
      }
    },
    [onSuccess]
  );

  return { updatePoem: handleUpdatePoem };
};
