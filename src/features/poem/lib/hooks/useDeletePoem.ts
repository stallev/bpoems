'use client';

import { useRouter } from 'next/navigation';
import { useState, useOptimistic } from 'react';
import { toast } from 'sonner';
import { UIConstants } from '@/features/poem-creation/constants/ui';
import { deletePoem } from '../../server-actions';

interface UseDeletePoemResult {
  isDeleting: boolean;
  deletePoem: (poemId: string) => Promise<void>;
  optimisticPoems?: Array<{ id: string; title: string; slug: string }>;
}

/**
 * Custom hook for deleting poems
 * Handles the delete operation with loading state and navigation
 */
export const useDeletePoem = (
  poems: Array<{ id: string; title: string; slug: string }> = []
): UseDeletePoemResult => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const [optimisticPoems, addOptimisticPoem] = useOptimistic(poems, (state, poemId: string) =>
    state.filter(poem => poem.id !== poemId)
  );

  const handleDeletePoem = async (poemId: string) => {
    if (isDeleting) return;

    setIsDeleting(true);

    try {
      // Оптимистичное обновление
      addOptimisticPoem(poemId);

      const result = await deletePoem(poemId);

      if (result.success) {
        toast.success(result.message);
        router.push('/profile');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error in useDeletePoem:', error);
      toast.error(UIConstants.POEM_DELETE_ERROR_MESSAGE);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    deletePoem: handleDeletePoem,
    optimisticPoems,
  };
};
