'use client';

import { X, Save } from 'lucide-react';
import { startTransition, useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import type { CategoryWithTranslation } from '@/entities/category/model/types';
import { updateCategory } from '@/features/dashboard/server-actions/categories';
import { CategoryForm } from './CategoryForm';
import { Button } from '@/shared/ui/shadcnComponents/button';
import { useCategoryForm } from '../lib/hooks/useCategoryForm';
import type { CategoryFormData } from '../model/schemas';

interface CategoryEditFormProps {
  category: CategoryWithTranslation;
  onCancel: () => void;
  onSuccess: () => void;
}

export const CategoryEditForm = ({ category, onCancel, onSuccess }: CategoryEditFormProps) => {
  const [state, formAction] = useActionState(
    (prevState: any, formData: FormData) => updateCategory(category.id, formData),
    { success: false, message: '' }
  );

  const { handleSubmit } = useCategoryForm();

  useEffect(() => {
    if (state.success) {
      onSuccess();
    }
  }, [state.success, onSuccess]);

  const onSubmit = (data: CategoryFormData) => {
    const formData = handleSubmit(data);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium">Редактирование категории</h4>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel} className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <CategoryForm
        defaultValues={{
          translations: {
            EN: category.name.EN,
            RU: category.name.RU,
            UA: category.name.UA,
          },
          isActive: category.isActive,
          order: category.order,
        }}
        onSubmit={onSubmit}
      >
        {state.message && (
          <div className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
            {state.message}
          </div>
        )}
        <div className="flex items-center justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
          <SubmitButton />
        </div>
      </CategoryForm>
    </div>
  );
};

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      <Save className="h-4 w-4 mr-2" />
      {pending ? 'Сохранение...' : 'Сохранить'}
    </Button>
  );
};
