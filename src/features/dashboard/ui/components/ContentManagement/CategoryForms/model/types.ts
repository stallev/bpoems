import type { CategoryWithTranslation } from '@/entities/category/model/types';

export interface CategoryFormProps {
  defaultValues: CategoryFormData;
  onSubmit: (data: CategoryFormData) => void;
  children: React.ReactNode;
}

export interface CategoryCreateFormProps {
  // Базовые пропсы для формы создания
}

export interface CategoryEditFormProps {
  category: CategoryWithTranslation;
  onCancel: () => void;
  onSuccess: () => void;
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
