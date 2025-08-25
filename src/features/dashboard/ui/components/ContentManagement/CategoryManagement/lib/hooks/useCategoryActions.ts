'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import {
  deleteCategory,
  toggleCategoryStatus,
} from '@/features/dashboard/server-actions/categories';
import { CATEGORY_MESSAGES } from '../../model/constants';

export const useCategoryActions = () => {
  const [, startTransition] = useTransition();

  const handleDelete = (id: string, onSuccess?: () => void) => {
    if (!confirm(CATEGORY_MESSAGES.DELETE_CONFIRMATION)) return;

    startTransition(async () => {
      const result = await deleteCategory(id);
      if (result.success) {
        toast.success(result.message);
        onSuccess?.();
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleToggleStatus = (id: string, isActive: boolean, onSuccess?: () => void) => {
    startTransition(async () => {
      const result = await toggleCategoryStatus(id, isActive);
      if (result.success) {
        toast.success(result.message);
        onSuccess?.();
      } else {
        toast.error(result.message);
      }
    });
  };

  return {
    handleDelete,
    handleToggleStatus,
  };
};
