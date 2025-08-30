'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { deletePoem } from '../../server-actions';

interface UseDeletePoemResult {
  isDeleting: boolean;
  deletePoem: (poemId: string) => Promise<void>;
}

/**
 * Custom hook for deleting poems
 * Handles the delete operation with loading state and navigation
 */
export const useDeletePoem = (): UseDeletePoemResult => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDeletePoem = async (poemId: string) => {
    if (isDeleting) return;

    setIsDeleting(true);

    try {
      const result = await deletePoem(poemId);

      if (result.success) {
        toast.success(result.message);
        router.push('/profile');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error in useDeletePoem:', error);
      toast.error('Произошла ошибка при удалении стихотворения');
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    deletePoem: handleDeletePoem,
  };
};
