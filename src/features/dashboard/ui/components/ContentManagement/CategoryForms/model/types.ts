import type { CategoryWithTranslation } from '@/entities/category';

export interface CategoryFormProps {
  onSubmit: (data: CategoryFormData) => void;
  isLoading?: boolean;
  initialData?: Partial<CategoryFormData>;
}

export interface CategoryCreateFormProps {
  onSubmit: (data: CategoryFormData) => void;
  isLoading?: boolean;
}

export interface CategoryEditFormProps {
  category: CategoryWithTranslation;
  onSubmit: (data: CategoryFormData) => void;
  isLoading?: boolean;
}

export interface CategoryFormData {
  translations: {
    EN: string;
    RU: string;
    UA: string;
  };
  isActive: boolean;
  order?: number;
}
