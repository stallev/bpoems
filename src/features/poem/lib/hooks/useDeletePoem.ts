'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { UIConstants } from '@/features/poem-creation/constants/ui';
import { deletePoem } from '../../server-actions';

interface UseDeletePoemResult {
  isDeleting: boolean;
  deletePoem: (poemId: string) => Promise<void>;
}

export const useDeletePoem = (): UseDeletePoemResult => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeletePoem = async (poemId: string) => {
    if (isDeleting) return;

    setIsDeleting(true);

    try {
      const result = await deletePoem(poemId);

      if (result.success) {
        window.location.href = '/profile';
        toast.success(result.message);
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
  };
};
