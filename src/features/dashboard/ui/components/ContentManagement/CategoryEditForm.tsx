'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save } from 'lucide-react';
import { startTransition, useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';

import type { CategoryWithTranslation } from '@/entities/category/model/types';
import { categoryFormSchema, type CategoryFormData } from '@/features/dashboard/model/schemas';
import { updateCategory } from '@/features/dashboard/server-actions/categories';
import { Button } from '@/shared/ui/shadcnComponents/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/shadcnComponents/form';
import { Input } from '@/shared/ui/shadcnComponents/input';
import { Switch } from '@/shared/ui/shadcnComponents/switch';

interface CategoryEditFormProps {
  category: CategoryWithTranslation;
  onCancel: () => void;
  onSuccess: () => void;
}

export function CategoryEditForm({ category, onCancel, onSuccess }: CategoryEditFormProps) {
  const [state, formAction] = useActionState(
    (prevState: any, formData: FormData) => updateCategory(category.id, formData),
    { success: false, message: '' }
  );

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      translations: {
        EN: category.name.EN,
        RU: category.name.RU,
        UA: category.name.UA,
      },
      isActive: category.isActive,
      order: category.order,
    },
  });

  // Обработка успешного обновления через useEffect
  useEffect(() => {
    if (state.success) {
      onSuccess();
    }
  }, [state.success, onSuccess]);

  const onSubmit = (data: CategoryFormData) => {
    const formData = new FormData();
    formData.append('translations.EN', data.translations.EN);
    formData.append('translations.RU', data.translations.RU);
    formData.append('translations.UA', data.translations.UA);
    formData.append('isActive', data.isActive.toString());
    if (data.order !== undefined) {
      formData.append('order', data.order.toString());
    }

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Редактирование категории</h4>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Название на английском */}
          <FormField
            control={form.control}
            name="translations.EN"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Название (EN)</FormLabel>
                <FormControl>
                  <Input placeholder="English name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Название на русском */}
          <FormField
            control={form.control}
            name="translations.RU"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Название (RU)</FormLabel>
                <FormControl>
                  <Input placeholder="Русское название" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Название на украинском */}
          <FormField
            control={form.control}
            name="translations.UA"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Название (UA)</FormLabel>
                <FormControl>
                  <Input placeholder="Українська назва" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Порядок */}
          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Порядок</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    max="1000"
                    {...field}
                    onChange={e =>
                      field.onChange(e.target.value ? Number(e.target.value) : undefined)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Статус */}
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Активна</FormLabel>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Сообщения об ошибках */}
        {state.message && (
          <div className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
            {state.message}
          </div>
        )}

        {/* Кнопки действий */}
        <div className="flex items-center justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
          <SubmitButton />
        </div>
      </form>
    </Form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      <Save className="h-4 w-4 mr-2" />
      {pending ? 'Сохранение...' : 'Сохранить'}
    </Button>
  );
}
