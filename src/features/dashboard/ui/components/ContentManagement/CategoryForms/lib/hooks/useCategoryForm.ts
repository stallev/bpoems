import { prepareFormData } from '@/features/dashboard/ui/components/ContentManagement/CategoryManagement/lib/utils';
import type { CategoryFormData } from '../../model/types';

export const useCategoryForm = () => {
  const handleSubmit = (data: CategoryFormData): FormData => {
    return prepareFormData(data);
  };

  return {
    handleSubmit,
    prepareFormData,
  };
};
