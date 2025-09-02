import { useCallback } from 'react';
import { toast } from 'sonner';
import { UIConstants } from '@/features/poem-creation/constants/ui';
import type { TiptapJson } from '@/features/poem-creation/model/types';
import { createPoem } from '@/features/poem-creation/server-actions/createPoem';

interface PoemData {
  title: string;
  content: TiptapJson;
  categoryId: string;
}

interface UseCreatePoemProps {
  onSuccess?: (data: { id: string; slug: string }) => void;
}

export const useCreatePoem = ({ onSuccess }: UseCreatePoemProps = {}) => {
  const handleCreatePoem = useCallback(
    async (data: PoemData) => {
      try {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('content', JSON.stringify(data.content));
        formData.append('categoryId', data.categoryId);

        const result = await createPoem(formData);

        if (result.success && result.data) {
          toast.success(result.message || UIConstants.POEM_SUCCESS_MESSAGE);
          onSuccess?.(result.data);
          return { success: true, data: result.data };
        } else {
          toast.error(result.message || UIConstants.POEM_ERROR_MESSAGE);
          return { success: false, error: result.message };
        }
      } catch (error) {
        console.error('Error creating poem:', error);
        toast.error(UIConstants.POEM_ERROR_MESSAGE);
        return { success: false, error: 'Произошла ошибка при создании стихотворения' };
      }
    },
    [onSuccess]
  );

  return { createPoem: handleCreatePoem };
};
