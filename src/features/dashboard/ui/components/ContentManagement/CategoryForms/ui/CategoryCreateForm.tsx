'use client';

import { Plus, X } from 'lucide-react';
import { useState, useActionState, startTransition, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { createCategory } from '@/features/dashboard/server-actions/categories';
import { Button } from '@/shared/ui/shadcnComponents/button';
import { CategoryForm } from './CategoryForm';
import { useCategoryForm } from '../lib/hooks/useCategoryForm';
import type { CategoryFormData } from '../model/schemas';

export const CategoryCreateForm = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [state, formAction] = useActionState(
    (prevState: any, formData: FormData) => createCategory(formData),
    { success: false, message: '' }
  );

  const { handleSubmit } = useCategoryForm();

  useEffect(() => {
    if (state.success) {
      setIsExpanded(false);
    }
  }, [state.success]);

  const onSubmit = (data: CategoryFormData) => {
    const formData = handleSubmit(data);
    startTransition(() => {
      formAction(formData);
    });
  };

  if (!isExpanded) {
    return (
      <Button onClick={() => setIsExpanded(true)} className="w-full" variant="outline">
        <Plus className="h-4 w-4 mr-2" />
        Добавить новую категорию
      </Button>
    );
  }

  return (
    <div className="bg-muted/30 p-4 rounded-lg border">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium">Создание новой категории</h4>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(false)}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <CategoryForm
        defaultValues={{
          translations: { EN: '', RU: '', UA: '' },
          isActive: true,
          order: undefined,
        }}
        onSubmit={onSubmit}
      >
        {state.message && (
          <div className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
            {state.message}
          </div>
        )}
        <div className="flex items-center justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => setIsExpanded(false)}>
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
      <Plus className="h-4 w-4 mr-2" />
      {pending ? 'Создание...' : 'Создать категорию'}
    </Button>
  );
};
